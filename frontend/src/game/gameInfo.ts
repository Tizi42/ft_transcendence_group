class GameInfo {
  user_id: number;
  room_name: string;
  user_role: string;

  setInfo(id: number, room: string, role: string) {
    this.user_id = id;
    this.room_name = room;
    this.user_role = role;
  }
}

const gameInfo = new GameInfo();

export default gameInfo;
