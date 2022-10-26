export type GameStatus =
  | "not_ready"
  | "running"
  | "ended";

export type queueInfo = {
  mode: string,
  user_id: number,
}

export type inviteInfo = {
  mode: string,
  user_id: number,
  invitee: number,
}

export type roomInfo = {
  playerL: number,
  playerR: number,
  mode: string,
}

export type objectPos = {
  paddle_left_posY: number,
  paddle_right_posY: number,
  ball_x: number,
  ball_y: number,
}

export type spellUpdate = {
  spell1_L: number,
  spell2_L: number,
  spell1_R: number,
  spell2_R: number,
}

export type paddleSizes = {
  left: number,
  right: number,
}

export type spellInfo = {
  launcher: string,
  target: string,
  effect: number,
}

export type inviteData = {
  sender: number,
  user_id: number,
}

export type smallInfoRoom = {
  room_name: string,
  user_id: number,
}

export type onlyRoomName = {
  room_name: string,
}

export type movePaddle = {
  user_id: number,
  room_name: string,
  paddle_move_direction: number,
}
