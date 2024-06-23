import jwt from "jsonwebtoken";

import ChatModel from "../../models/ChatModel";
export default class MessageController {
  constructor(io) {
    this.io = io;
  }

  setupEventListeners(socket) {
    this._sendMessage(socket);
  }

  _sendMessage(socket) {
    socket.on("sendMessage", async (message, token) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email, name } = decoded.user;
        await ChatModel.create({ email, message });
        this.io.emit("newMessage", {
          message,
          name: name,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
}
