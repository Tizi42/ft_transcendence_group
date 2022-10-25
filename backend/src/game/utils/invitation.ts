export class Invitation {
  constructor(
    sender: number,
    senderSocketId: string,
    invitee: number,
    gameMode: string
  ) {
    this.sender_id = sender;
    this.sender_sid = senderSocketId;
    this.invitee_id = invitee;
    this.mode = gameMode;
  }
  sender_id: number;
  sender_sid: string;
  invitee_id: number;
  mode: string;
}
