import MonsterModel from "../../models/MonsterModel";
import * as enemyData from "../../../public/assets/Enemies/enemies.json";
import { v4 } from "uuid";
import UserModel from "../../models/UserModel";

export default class MonsterController {
  constructor(io) {
    this.players = {};
    this.playerLocations = [];
    this.io = io;

    this.init();
  }

  init() {}

  setupEventListeners(socket) {
    socket.on("savePlayerData", async () => {
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
    socket.on("newPlayer", async (token, key) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { name, _id } = decoded.user;

        const playerSchema = await UserModel.findById(_id);
        // create a new Player

        this.spawnPlayer(socket.id, name, key, playerSchema.player);

        socket.emit("currents");

        // inform the other players of the new player that joined
        socket.broadcast.emit("spawnPlayer", this.players[socket.id]);
        socket.emit("updateItems", this.players[socket.id]);
        socket.broadcast.emit(
          "updatePlayersItems",
          socket.id,
          this.players[socket.id]
        );
      } catch (error) {
        console.log(error);
        socket.emit("invalidToken");
      }
    });

    socket.on("playerMovement", (playerData) => {
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

      socket.on("pickUpChest", (chestId) => {
        // update the spawner
        if (this.chests[chestId]) {
          const { gold } = this.chests[chestId];

          // updating the players gold
          this.players[socket.id].updateGold(gold);
          socket.emit("updateScore", this.players[socket.id].gold);
          socket.broadcast.emit(
            "updatePlayersScore",
            socket.id,
            this.players[socket.id].gold
          );
          // removing the chest
          this.deleteChest(chestId);
        }
      });

      socket.on("pickUpItem", (itemId) => {
        // update the spawner
        if (this.items[itemId]) {
          if (this.players[socket.id].canPickupItem()) {
            this.players[socket.id].addItem(this.items[itemId]);
            socket.emit("updateItems", this.players[socket.id]);
            socket.broadcast.emit(
              "updatePlayersItems",
              socket.id,
              this.players[socket.id]
            );

            // removing the item
            this.deleteItems(itemId);
          }
        }
      });

      socket.on("playerDroppedItem", (itemId) => {
        this.players[socket.id].removeItem(itemId);
        socket.emit("updateItems", this.players[socket.id]);
        socket.broadcast.emit(
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
            socket.broadcast.emit(
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
            socket.broadcast.emit(
              "updatePlayersItems",
              socket.id,
              this.players[socket.id]
            );
          }
        }
      });

      socket.on("levelUp", () => {
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

      socket.on("healthPotion", (playerId, health) => {
        if (socket.id === playerId) {
          this.players[socket.id];
          this.players[socket.id].potion(health);
          this.io.emit(
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
    });
  }

  spawnPlayer(playerId, name, key, playerSchema) {
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
  }
}
