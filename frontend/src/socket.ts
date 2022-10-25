import { io } from "socket.io-client";

const socket = io("http://" + `${import.meta.env.VITE_IP_NETWORK}` + ":3000", {
  withCredentials: true,
});

socket.onAny((event, ...args) => {
  console.log("event :", event, args);
});

export default socket;
