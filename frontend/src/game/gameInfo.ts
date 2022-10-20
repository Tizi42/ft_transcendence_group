class GameInfo {
  user_id: number;
  room_name: string;
  user_role: string;
  mode: string;

  setInfo(id: number, room: string, role: string, mode: string) {
    this.user_id = id;
    this.room_name = room;
    this.user_role = role;
    this.mode = mode;
  }
}

const gameInfo = new GameInfo();

export default gameInfo;
