import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true,
});

socket.onAny((event, ...args) => {
  console.log("event :", event, args);
});

export default socket;
