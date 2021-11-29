import { v4 } from "uuid";

export default class SceneObject {
  constructor(data, itemData, sceneId, io, socket) {
    this.id = `${sceneId}-${v4()}`;
    this.data = data;

    this.chests = {};
    this.monsters = {};
    this.players = {};
    this.items = {};
    this.npcs = {};

    this.playerLocations = [];
    this.chestLocations = [];
    this.monsterLocations = [];
    this.npcLocations = [];
    this.spawners = [];
    this.itemLocations = itemData.itemLocations;

    this.getLocations = {
      player_locations: (layer) => {
        layer.objects.forEach((obj) => {
          this.playerLocations.push([obj.x, obj.y]);
        });
      },
      monster_locations: (layer) => {
        layer.objects.forEach((obj) => {
          this.monsterLocations.push([obj.x, obj.y]);
        });
      },
      chest_locations: (layer) => {
        layer.objects.forEach((obj) => {
          this.monsterLocations.push([obj.x, obj.y]);
        });
      },
      npc_locations: (layer) => {
        layer.objects.forEach((obj) => {
          this.npcLocations.push([obj.x, obj.y]);
        });
      },
    };

    this.parseMapData();
    this.setupEventListeners(io,socket);
    this.setupSpawners();
  }

  parseMapData() {
    this.data.layers.forEach((layer) => {
      this.getLocations[layer.name](layer);
    });
  }
  setupEventListeners(io, socket) {
    socket.on("sendMessage", async (message, token, player) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { name, email } = decoded.user;
        await ChatModel.create({ email, message });
        io.emit("newMessage", {
          message,
          name: this.players[socket.id].playerName,
          frame: this.players[socket.id].frame,
        });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("newPlayer", async (token, key, room) => {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { name, _id } = decoded.user;

      const playerSchema = await UserModel.findById(_id);
      // create a new Player
      this.spawnPlayer(socket.id, name, key, playerSchema.player);

      // send the players object to the new player
      socket.emit("createPlayer", this.players[socket.id], true);

      // send the players object to the new player
      socket.emit("currentPlayers", this.players, false);

      // send the monsters object to the new player
      socket.emit("currentMonsters", this.monsters);

      // send the chests object to the new player
      socket.emit("currentChests", this.chests);

      // send the items object to the new player
      socket.emit("currentItems", this.items);

      // send the npcs object to the new player
      socket.emit("currentNpcs", this.npcs);

      // inform the other players of the new player that joined
      socket.broadcast.emit("spawnPlayer", this.players[socket.id]);
      socket.emit("updateItems", this.players[socket.id]);
      socket.broadcast.emit(
        "updatePlayersItems",
        socket.id,
        this.players[socket.id]
      );
    });

    socket.on("playerMovement", (playerData) => {
      if (this.players[socket.id]) {
        this.players[socket.id].x = playerData.x;
        this.players[socket.id].y = playerData.y;
        this.players[socket.id].flipX = playerData.flipX;
        this.players[socket.id].actionAActive = playerData.actionAActive;
        this.players[socket.id].actionBActive = playerData.actionBActive;
        this.players[socket.id].potionAActive = playerData.potionAActive;
        this.players[socket.id].frame = playerData.frame;
        this.players[socket.id].currentDirection = playerData.currentDirection;
        // emit a message to all players about the player that moved
        socket.broadcast.emit("playerMoved", this.players[socket.id]);
      }
    });

    socket.on("pickUpChest", (chestId) => {
      // update the spawner
      if (this.chests[chestId]) {
        const { gold } = this.chests[chestId];

        // updating the players gold
        this.players[socket.id].updateGold(gold);
        socket.to("world_1").emit("updateScore", this.players[socket.id].gold);
        socket
          .to("world_1")
          .broadcast.emit(
            "updatePlayersScore",
            socket.id,
            this.players[socket.id].gold
          );
        // removing the chest
        this.spawners[this.chests[chestId].spawnerId].removeObject(chestId);
      }
    });

    socket.on("pickUpItem", (itemId) => {
      // update the spawner
      if (this.items[itemId]) {
        if (this.players[socket.id].canPickupItem()) {
          this.players[socket.id].addItem(this.items[itemId]);
          socket.emit("updateItems", this.players[socket.id]);
          io.broadcast.emit(
            "updatePlayersItems",
            socket.id,
            this.players[socket.id]
          );

          // removing the item
          this.spawners[this.items[itemId].spawnerId].removeObject(itemId);
        }
      }
    });

    socket.on("playerDroppedItem", (itemId) => {
      this.players[socket.id].removeItem(itemId);
      socket.emit("updateItems", this.players[socket.id]);
      this.broadcast.emit(
        "updatePlayersItems",
        socket.id,
        this.players[socket.id]
      );
    });

    socket.on("playerEquipedItem", (itemId) => {
      if (this.players[socket.id].items[itemId]) {
        if (this.players[socket.id].canEquipItem()) {
          this.players[socket.id].equipItem(
            this.players[socket.id].items[itemId]
          );

          socket.emit("updateItems", this.players[socket.id]);
          io.broadcast.emit(
            "updatePlayersItems",
            socket.id,
            this.players[socket.id]
          );
        }
      }
    });

    socket.on("playerUnequipedItem", (itemId) => {
      if (this.players[socket.id].equipedItems[itemId]) {
        if (this.players[socket.id].canPickupItem()) {
          this.players[socket.id].addItem(
            this.players[socket.id].equipedItems[itemId]
          );

          this.players[socket.id].removeEquipedItem(itemId);

          socket.emit("updateItems", this.players[socket.id]);
          this.broadcast.emit(
            "updatePlayersItems",
            socket.id,
            this.players[socket.id]
          );
        }
      }
    });

    socket.on("levelUp", () => {
      this.players[socket.id].levelUp();
      io.emit(
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

    socket.on("attackedPlayer", (attackedPlayerId) => {
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
          io.broadcast.emit(
            "respawnPlayer",
            this.players[attackedPlayerId]
          );

          // send update gold message to player
          socket.emit("updateScore", this.players[socket.id].gold);

          // reset the attacked players gold
          this.players[attackedPlayerId].updateGold(-gold);
          io.to(`${attackedPlayerId}`).emit(
            "updateScore",
            this.players[attackedPlayerId].gold
          );

          // add bonus health to the player
          this.players[socket.id].updateHealth(15);
          io.emit(
            "updatePlayerHealth",
            socket.id,
            this.players[socket.id].health
          );
        } else {
          io.emit(
            "updatePlayerHealth",
            attackedPlayerId,
            this.players[attackedPlayerId].health
          );
        }
      }
    });

    socket.on("monsterAttacked", (monsterId, dis) => {
      // update the spawner
      if (this.monsters[monsterId]) {
        const { gold, attack, exp } = this.monsters[monsterId];
        const playerAttackValue = this.players[socket.id].attack;
        // subtract health monster model
        this.monsters[monsterId].loseHealth(playerAttackValue);

        // check the monsters health, and if dead remove that object
        if (this.monsters[monsterId].health <= 0) {
          // updating the players gold
          this.players[socket.id].updateGold(gold);
          socket.emit("updateScore", this.players[socket.id].gold);

          //socket.emit("dropItem", item);

          //update xp
          this.players[socket.id].updateExp(exp);
          io.emit("updateXp", exp, socket.id);

          // removing the monster
          this.spawners[this.monsters[monsterId].spawnerId].removeObject(
            monsterId
          );
          io.emit("monsterRemoved", monsterId);
        } else {
          // update the monsters health
          io.emit(
            "updateMonsterHealth",
            monsterId,
            this.monsters[monsterId].health
          );

          if (dis < 90) {
            // update the players health
            this.players[socket.id].playerAttacked(attack);
            io.emit(
              "updatePlayerHealth",
              socket.id,
              this.players[socket.id].health
            );

            // check the player's health, if below 0 have the player respawn
            if (this.players[socket.id].health <= 0) {
              // update the gold the player has
              this.players[socket.id].updateGold(
                parseInt(-this.players[socket.id].gold / 2, 10)
              );
              socket.emit("updateScore", this.players[socket.id].gold);

              // respawn the player
              this.players[socket.id].respawn(this.players);
              io.emit("respawnPlayer", this.players[socket.id]);
            }
          }
        }
      }
    });

    socket.on("playerHit", (damage) => {});

    socket.on("healthPotion", (playerId, health) => {
      if (socket.id === playerId) {
        this.players[socket.id];
        this.players[socket.id].potion(health);
        io.emit(
          "updatePlayerHealth",
          socket.id,
          this.players[socket.id].health
        );
      }
    });

    socket.on("sendBuyItemMessage", (item) => {
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
  setupSpawners() {}
}
