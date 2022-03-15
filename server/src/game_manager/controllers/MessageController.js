export default class MessageController {
  constructor(io) {
    this.io = io;
  }

  setupEventListeners(socket) {
    this._sendMessage(socket);
  }

  _sendMessage(socket) {
    socket.on("sendMessage", async (message, token, player) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded.user;
        await ChatModel.create({ email, message });
        this.io.emit("newMessage", {
          message,
          name: player.playerName,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }
}
