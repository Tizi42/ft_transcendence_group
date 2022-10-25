import { MessageBody, SubscribeMessage, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GameRoomNS } from "./utils/gameNS";
import { GameRoom } from "./utils/gameRoom";
import { Invitation } from "./utils/invitation";
import { AppGateway } from '../gateway';
import { UsersService } from '../users/users.service';
import { ChatService } from '../chat/chat.service';
import { ChannelService } from 'src/channel/channel.service';
import { BattlesService } from '../battles/battles.service';
import { inviteInfo, queueInfo, roomInfo } from './utils/type';

export class GameGateway extends AppGateway {

  constructor(
    readonly chatService: ChatService,
    readonly usersService: UsersService,
    readonly channelService: ChannelService,
    readonly battlesService: BattlesService,
  ) {
    super(chatService, usersService, channelService, battlesService);
  }

  private static queues = {
    normal: {
      id: -1,
      sid: "",
    },
    magic: {
      id: -1,
      sid: "",
    },
    speed: {
      id: -1,
      sid: "",
    }
  };

  private static rooms: Map<string, GameRoom> = new Map(); //roomName, GameRoom
  private static invitations: Map<number, Invitation> = new Map(); //unserId, Invitaion
  private static inGameUsers: Map<number, string> = new Map(); //userId, roomName
  private static inGameSockets: Map<string, string> = new Map(); //socketId, roomName

  /*
  **    CONNECTIONS AND CREATION
  */

  async handleConnection(socket: Socket) {}

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    //check if socket is in queue
    if (GameGateway.queues.normal.sid === socket.id) {
      console.log("socket disconnect, quit queue");
      this.cleanQueue("normal");
    }
    else if (GameGateway.queues.magic.sid === socket.id)
      this.cleanQueue("magic");
    else if (GameGateway.queues.speed.sid === socket.id)
      this.cleanQueue("speed");

    // check if socket is in game
    let room_name = GameGateway.inGameSockets.get(socket.id);
    if (room_name) {
      let room = GameGateway.rooms.get(room_name);
      this.server.to(room.room_name).emit("quit_game");
      this.closeRoom(room);
    }
  }

  informEveryoneGameUpdate() {
    this.server.emit("games_update_list");
  }

  async createGameRoom(
    l_id: number,
    l_sid: string,
    r_id: number,
    r_sid:string,
    mode: string
  ): Promise<string> {
    const room_name = l_id + " vs " + r_id;
    GameGateway.rooms.set(room_name, new GameRoom(
      l_id, l_sid, r_id, r_sid, mode, this.server, this.battlesService));
    
    // update user status
    await this.usersService.updateUserStatus(l_id, "in game");
    await this.usersService.updateUserStatus(r_id, "in game");

    // annonce to given socket
    this.server.in(l_sid).in(r_sid).socketsJoin(room_name);
    this.server.to(l_sid).to(r_sid).emit("game_found", room_name);

    // update register
    GameGateway.inGameUsers.set(l_id, room_name);
    GameGateway.inGameUsers.set(r_id, room_name);
    GameGateway.inGameSockets.set(l_sid, room_name);
    GameGateway.inGameSockets.set(r_sid, room_name);

    // inform everyone
    this.informEveryoneGameUpdate();

    return room_name;
  }

  async closeRoom(room: GameRoom) {
    if (!room)
      return;
    room.stop_game();
    this.server.in(room.room_name).socketsLeave(room.room_name);
    await this.usersService.updateUserStatus(room.playerL, "leave game");
    await this.usersService.updateUserStatus(room.playerR, "leave game");
    GameGateway.inGameUsers.delete(room.playerL);
    GameGateway.inGameUsers.delete(room.playerR);
    GameGateway.inGameSockets.delete(room.sidL);
    GameGateway.inGameSockets.delete(room.sidR);
    GameGateway.rooms.delete(room.room_name);

    // inform everyone
    this.informEveryoneGameUpdate();
  }

  cleanQueue(mode: string) {
    GameGateway.queues[mode].id = -1;
    GameGateway.queues[mode].sid = "";
  }

  @SubscribeMessage('queue_register')
  queueRegister(@ConnectedSocket() socket: Socket, @MessageBody() data: queueInfo) {
    console.log("Queue register received: ", data);
    if (GameGateway.queues.normal.id === data.user_id
        || GameGateway.queues.magic.id === data.user_id
        || GameGateway.queues.speed.id === data.user_id) {
      return true;
    }

    // if already in game, return

    let playerL = GameGateway.queues[data.mode];
    if (playerL.id === -1) {
      GameGateway.queues[data.mode].id = data.user_id;
      GameGateway.queues[data.mode].sid = socket.id;
      return false;
    } else {
      this.createGameRoom(playerL.id, playerL.sid, data.user_id, socket.id, data.mode);
      this.cleanQueue(data.mode);
      return false;
    }
  }

  @SubscribeMessage('quit_queue')
  quitQueue(@ConnectedSocket() socket: Socket, @MessageBody() data: queueInfo): string {
    console.log("Quit queue received: ", data);
    if (GameGateway.queues[data.mode].sid === socket.id)
      this.cleanQueue(data.mode);
    return "You are no longer in queue";
  }

  /*
  **    HANDLE INVITATIONS
  */

  @SubscribeMessage('send_invitation')
  async onInviteToPlay(@ConnectedSocket() socket: Socket, @MessageBody() data: inviteInfo) {
    // Delete old pending invitation of user
    GameGateway.invitations.delete(data.user_id);

    // check if sender or receiver is available
    let sender = await this.usersService.findOne(data.user_id);
    let invitee = await this.usersService.findOne(data.invitee);
    if (sender.status !== "online" || invitee.status !== "online")
      return this.server.to(socket.id).emit("unavailable");
    
    // check if they are friends or if invitee allow invites from anyone
    if (!(invitee.id in sender.friendWith) && invitee.allowNotifications == false)
      return this.server.to(socket.id).emit("not_allowed");

    // create invitation
    let invitation = new Invitation(sender.id, socket.id, invitee.id, data.mode);
    GameGateway.invitations.set(sender.id, invitation);

    // emit invitation
    this.server.to(data.invitee.toString()).emit("game_invitation", invitation);
  }

  @SubscribeMessage('cancel_invitation')
  onCancelInvite(@ConnectedSocket() socket: Socket, @MessageBody() data: inviteInfo) {
    console.log("cancel invitation from", data.user_id, "to", data.invitee);
    GameGateway.invitations.delete(data.user_id);
    this.server.to(data.invitee.toString()).emit("invitation_expired");
  }

  @SubscribeMessage('refuse_invitation')
  onRefuseInvite(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const invitation = GameGateway.invitations.get(data.sender);
    if (!invitation || invitation.invitee_id != data.user_id)
      return "invitation no longer exist...";
    
    GameGateway.invitations.delete(data.sender);
    this.server.to(invitation.sender_sid).emit("decline_invitation");
    this.server.to(data.user_id).emit("invitation_expired");
  }

  @SubscribeMessage('accept_invitation')
  async onAcceptInvite(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const invitation = GameGateway.invitations.get(data.sender);
    if (!invitation || invitation.invitee_id != data.user_id)
      return "invitation no longer exist...";

    // check if sender or receiver is available
    let sender = await this.usersService.findOne(data.sender);
    let invitee = await this.usersService.findOne(data.user_id);
    if (sender.status !== "online" || invitee.status !== "online") {
      GameGateway.invitations.delete(data.sender);
      return "You or your inviter is no longer available";
    }

    // start game
    const roomName = await this.createGameRoom(
      invitation.sender_id,
      invitation.sender_sid,
      invitation.invitee_id,
      socket.id,
      invitation.mode
    );

    // emit go play signal
    this.server.to(invitation.sender_sid).to(socket.id).emit("go_play", roomName);

    // clean invitaion
    this.server.to(data.user_id).emit("invitation_expired");
    GameGateway.invitations.delete(data.sender);
  }

  /*
  **    GAME
  */

  @SubscribeMessage('init_room')
  sendRoomInfo(@ConnectedSocket() socket: Socket, @MessageBody() data: any): roomInfo {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (data.user_id !== room.playerL && data.user_id !== room.playerR)
      this.server.in(socket.id).socketsJoin(data.room_name);
    return {
      playerL: room.playerL,
      playerR: room.playerR,
      mode: room.mode,
    };
  }

  @SubscribeMessage('leave_game')
  async onLeavingRoom(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (data.user_id !== room.playerL && data.user_id !== room.playerR) {
      this.server.in(socket.id).socketsLeave(data.room_name);
    } else {
      socket.to(data.room_name).emit("quit_game");
      this.closeRoom(room);
    }
  }

  @SubscribeMessage('ready')
  async onPlayerReady(@MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    console.log(data.user_id, " is ready");
    if (!room || (data.user_id !== room.playerL && data.user_id !== room.playerR)
        || room.ready === data.user_id)
      return null;
    if (room.ready === 0)
      room.ready = data.user_id;
    else {
      room.ready = 0;
      room.start_game();
    }
  }

  @SubscribeMessage('cancel_ready')
  async onCancelReady(@MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (room.ready === data.user_id)
      room.ready = 0;
  }

  @SubscribeMessage('update_paddle')
  async onUpdatePaddle(@MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    room.on_paddle_move(data.user_id, data.paddle_move_direction);
  }

  @SubscribeMessage('launch_spell')
  async onLaunchSPell(@MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room) return;
    room.on_spell_lauched(data.user_id);
  }

  @SubscribeMessage('switch_spell')
  async onSwitchPell(@MessageBody() data: any) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room) return;
    room.on_switch_spell(data.user_id);
  }

  getRandomInt(max: number = 100) : number {
    return Math.floor(Math.random() * max);
  }

  @SubscribeMessage('reset_score')
  async onResetScore(@ConnectedSocket() socket: Socket) {
    this.server.to(socket.id).emit("score_update", {
      left: 0,
      right: 0,
    });
    this.server.to(socket.id).emit("time_reset");
  }

  @SubscribeMessage('get_game_status')
  async onGetGameStatus(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: any
  ) {
    const room = GameGateway.rooms.get(data.room_name);
    if (!room)
      return null;
    if (room.game_status === "running") {
      let time_diff = (new Date()).getTime() - room.current_game_start_time.getTime() ;
      this.server.to(socket.id).emit("current_game_time", time_diff);
    }
    return {
      game_status: room.game_status,
    };
  }

  /*
  **    WATCH LIST
  */

  async transformRooms(): Promise<Array<GameRoomNS>> {
    let data: Array<GameRoomNS> = [];
    for await (const value of GameGateway.rooms) {
      data.push(new GameRoomNS(value[1], value[0]));
    }
    return data;
  }

  @SubscribeMessage('get_updated_rooms')
  async updateRooms(@ConnectedSocket() socket: Socket) {
    this.server.to(socket.id).emit("updated_rooms", await this.transformRooms());
  }

  @SubscribeMessage("logout_all")
  async handleLogout() {}
}
