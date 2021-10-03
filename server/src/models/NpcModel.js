import { v4 } from 'uuid';
import { randomNumber } from '../game_manager/utils';

export default class NpcModel {
  constructor(x, y, spawnerId, frame) {
    this.id = `${spawnerId}-${v4()}`;
    this.spawnerId = spawnerId;
    this.x = x * 2;
    this.y = y * 2;
    this.frame = frame;
  }


  move() {
    const randomPosition = randomNumber(1, 8);
    const distance = 64;

    switch (randomPosition) {
      case 1:
        this.x += distance;
        break;
      case 2:
        this.x -= distance;
        break;
      case 3:
        this.y += distance;
        break;
      case 4:
        this.y -= distance;
        break;
      case 5:
        this.x += distance;
        this.y += distance;
        break;
      case 6:
        this.x += distance;
        this.y -= distance;
        break;
      case 7:
        this.x -= distance;
        this.y += distance;
        break;
      case 8:
        this.x -= distance;
        this.y -= distance;
        break;
      default:
        break;
    }
  }
}
