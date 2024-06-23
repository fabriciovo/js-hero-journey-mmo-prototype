import jwt from "jsonwebtoken";

import UserModel from "../../models/UserModel";
import PlayerModel from "../../models/PlayerModel";
export default class PlayerController {
  constructor(io, playerLocations) {
    this.players = {};
    this.playerLocations = playerLocations;
    this.io = io;
  }

  setupEventListeners(socket) {
    this._eventNewPlayer(socket);
    this._eventPlayerMovement(socket);
    this._eventPickupChest(socket);
    this._eventPickupItem(socket);
    this._eventPlayerDroppedItem(socket);
    this._eventPlayerEquipedItem(socket);
    this._eventPlayerUnequipedItem(socket);
    this._eventHealthPotion(socket);
    this._eventAttackedPlayer(socket);
    this._eventPlayerHit(socket);
    this._eventSendBuyItemMessage(socket);
    this._eventPlayerUpdateXp(socket);
    this._eventLevelUp(socket);
    this._eventDisconnect(socket);
    this._eventSavePlayerData(socket);

    socket.on("playerGetItem", (item, playerId) => {
      const player = this.players[playerId];
      player.addItem(item);
      socket.emit("updateItems", player);
      socket.broadcast.emit("updatePlayersItems", playerId, player);
    });
  }

  _eventSavePlayerData(socket) {
    return socket.on("savePlayerData", async () => {
      try {
        if (!this.players[socket.id].items) {
          this.players[socket.id].items = null;
        }

        if (!this.players[socket.id].equipedItems) {
          this.players[socket.id].equipedItems = null;
        }

        await UserModel.updateOne(
          { username: this.players[socket.id].playerName },
          {
            $set: {
              player: this.players[socket.id],
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    });
  }

  _eventNewPlayer(socket) {
    return socket.on("newPlayer", async (token, key, instanceId) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { name, _id } = decoded.user;

        const playerSchema = await UserModel.findById(_id);
        console.log(name);
        const player = this._spawnPlayer(
          socket.id,
          name,
          key,
          playerSchema.player
        );

        socket.emit("currentPlayers", this.players, instanceId);

        // inform the other players of the new player that joined
        socket.broadcast.emit("spawnPlayer", player);
        socket.emit("updateItems", player);
        socket.broadcast.emit("updatePlayersItems", socket.id, player);
      } catch (error) {
        console.log(error);
        socket.emit("invalidToken");
      }
    });
  }

  _eventPlayerMovement(socket) {
    return socket.on("playerMovement", (playerData) => {
      if (this.players[socket.id]) {
        this.players[socket.id].x = playerData.x;
        this.players[socket.id].y = playerData.y;
        this.players[socket.id].flipX = playerData.flipX;
        this.players[socket.id].actionAActive = playerData.actionAActive;
        this.players[socket.id].potionAActive = playerData.potionAActive;
        this.players[socket.id].frame = playerData.frame;
        this.players[socket.id].currentDirection = playerData.currentDirection;
        // emit a message to all players about the player that moved
        this.io.emit("playerMoved", this.players[socket.id]);
      }
    });
  }

  _eventPickupChest(socket) {
    return socket.on("pickUpChest", (chestId) => {
      const player = this.players[socket.id];
      player.updateGold(20);
      socket.emit("updateScore", player.gold);
      socket.broadcast.emit("updatePlayersScore", socket.id, player.gold);
      this.io.emit("chestRemoved", chestId);
    });
  }

  _eventPickupItem(socket) {
    return socket.on("pickUpItem", (itemId) => {
      const player = this.players[socket.id];
      if (player.canPickupItem()) {
        socket.emit("collectItem", itemId);
      }
    });
  }

  _eventPlayerDroppedItem(socket) {
    return socket.on("playerDroppedItem", (itemId) => {
      this.players[socket.id].removeItem(itemId);
      socket.emit("updateItems", this.players[socket.id]);
      socket.broadcast.emit(
        "updatePlayersItems",
        socket.id,
        this.players[socket.id]
      );
    });
  }

  _eventPlayerEquipedItem(socket) {
    return socket.on("playerEquipedItem", (itemId) => {
      if (this.players[socket.id].items[itemId]) {
        if (this.players[socket.id].canEquipItem()) {
          this.players[socket.id].equipItem(
            this.players[socket.id].items[itemId]
          );
          socket.emit("updateItems", this.players[socket.id]);
          socket.broadcast.emit(
            "updatePlayersItems",
            socket.id,
            this.players[socket.id]
          );
        }
      }
    });
  }

  _eventPlayerUnequipedItem(socket) {
    return socket.on("playerUnequipedItem", (itemId) => {
      if (this.players[socket.id].equipedItems[itemId]) {
        if (this.players[socket.id].canPickupItem()) {
          this.players[socket.id].addItem(
            this.players[socket.id].equipedItems[itemId]
          );
          this.players[socket.id].removeEquipedItem(itemId);
          socket.emit("updateItems", this.players[socket.id]);
          socket.broadcast.emit(
            "updatePlayersItems",
            socket.id,
            this.players[socket.id]
          );
        }
      }
    });
  }
  _eventLevelUp(socket) {
    return socket.on("levelUp", () => {
      this.players[socket.id].levelUp();
      this.io.emit(
        "updatePlayerStats",
        socket.id,
        this.players[socket.id].level,
        this.players[socket.id].attack,
        this.players[socket.id].defense,
        this.players[socket.id].maxHealth,
        this.players[socket.id].exp,
        this.players[socket.id].maxExp
      );
    });
  }

  _eventHealthPotion(socket) {
    return socket.on("healthPotion", (playerId, health) => {
      this.players[playerId];
      this.players[playerId].potion(health);
      this.io.emit(
        "updatePlayerHealth",
        playerId,
        this.players[playerId].health
      );
    });
  }

  _eventAttackedPlayer(socket) {
    return socket.on("attackedPlayer", (attackedPlayerId) => {
      if (this.players[attackedPlayerId]) {
        // get required info from attacked player
        const { gold } = this.players[attackedPlayerId];
        const playerAttackValue = this.players[socket.id].attack;

        // subtract health from attacked player
        this.players[attackedPlayerId].playerAttacked(playerAttackValue);

        // check attacked players health, if dead send gold to other player
        if (this.players[attackedPlayerId].health <= 0) {
          // get the amount of gold, and update player object
          this.players[socket.id].updateGold(gold);

          // respawn attacked player
          this.players[attackedPlayerId].respawn(this.players);
          this.io.emit("respawnPlayer", this.players[attackedPlayerId]);

          // send update gold message to player
          socket.emit("updateScore", this.players[socket.id].gold);

          // reset the attacked players gold
          this.players[attackedPlayerId].updateGold(-gold);
          this.io
            .to(`${attackedPlayerId}`)
            .emit("updateScore", this.players[attackedPlayerId].gold);

          // add bonus health to the player
          this.players[socket.id].updateHealth(15);
          this.io.emit(
            "updatePlayerHealth",
            socket.id,
            this.players[socket.id].health
          );
        } else {
          this.io.emit(
            "updatePlayerHealth",
            attackedPlayerId,
            this.players[attackedPlayerId].health
          );
        }
      }
    });
  }

  _eventPlayerHit(socket) {
    return socket.on("playerHit", (playerId, monsterAttack) => {
      this.players[playerId].playerAttacked(monsterAttack);
      this.io.emit(
        "updatePlayerHealth",
        playerId,
        this.players[playerId].health
      );
      // check the player's health, if below 0 have the player respawn
      if (this.players[playerId].health <= 0) {
        // update the gold the player has
        this.players[playerId].updateGold(
          parseInt(-this.players[playerId].gold / 2, 10)
        );
        socket.emit("updateScore", this.players[playerId].gold);

        // respawn the player
        this.players[playerId].respawn(this.players);
        this.io.emit("respawnPlayer", this.players[playerId]);
      }
    });
  }

  _eventSendBuyItemMessage(socket) {
    return socket.on("sendBuyItemMessage", (item) => {
      this.players[socket.id].potions++;

      this.players[socket.id].updateGold(-item.price);
      socket.emit("updateScore", this.players[socket.id].gold);
      socket.broadcast.emit(
        "updatePlayersScore",
        socket.id,
        this.players[socket.id].gold
      );
    });
  }

  _eventPlayerUpdateXp(socket) {
    return socket.on("playerUpdateXp", (playerId, exp) => {
      this.players[playerId].updateExp(exp);
      this.io.emit("updateXp", exp, socket.id);
    });
  }

  _eventDisconnect(socket) {
    return socket.on("disconnect", () => {
      // delete user data from server

      console.log("Player Disconnect");

      delete this.players[socket.id];

      // emit a message to all players to remove this player
      this.io.emit("disconnected", socket.id);
    });
  }

  _spawnPlayer(playerId, name, key, playerSchema) {
    const player = new PlayerModel(
      playerId,
      [
        [200, 200],
        [400, 400],
      ],
      this.players,
      name,
      key,
      undefined,
      playerSchema
    );
    this.players[playerId] = player;
    return this.players[playerId];
  }
}
