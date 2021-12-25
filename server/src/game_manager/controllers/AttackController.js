import jwt from "jsonwebtoken";

import UserModel from "../../models/UserModel";
import PlayerModel from "../../models/PlayerModel";
export default class AttackController {
  constructor(io) {
    this.players = {};
    this.playerLocations = [];
    this.io = io;
  }


  setupEventListeners(socket) {

  }

}
