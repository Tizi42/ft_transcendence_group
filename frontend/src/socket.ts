import { io } from "socket.io-client";

const socket = io("http://10.11.4.13:3000", {
  withCredentials: true,
});

socket.onAny((event, ...args) => {
  console.log("event :", event, args);
});

export default socket;
