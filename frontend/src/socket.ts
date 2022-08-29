import { io } from "/usr/local/lib/node_modules/socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: true });

socket.onAny((event, ...args) => {
  console.log(event, args);
});
export default socket;
