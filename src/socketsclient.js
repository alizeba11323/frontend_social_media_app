import { io } from "socket.io-client";

export const socket = io("https://social-media-app-backend-xixq.onrender.com", {
  autoConnect: false,
});
