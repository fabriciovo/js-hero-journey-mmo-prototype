/* eslint-disable func-names */
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import PlayerModel from "../game_manager/PlayerModel";
const { Schema } = mongoose;

const PlayerSchema = new Schema({
  playerName: {
    type: String,
  },
  attack: {
    type: Number,
  },
  defense: {
    type: Number,
  },
  maxHealth: {
    type: Number,
  },
  health: {
    type: Number,
  },
  frame: {
    type: Number,
  },
  gold: {
    type: Number,
  },
  items: {
    type:Object
  },
});

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  resetToken: {
    type: String,
  },
  resetTokenExp: {
    type: Date,
  },
  player: {
    type: PlayerSchema,
  },
});

UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;
