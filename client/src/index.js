import * as Phaser from "phaser";
import io from "socket.io-client";
import scenes from "./scenes/scenes";

const config = {
  type: Phaser.AUTO,

  scene: scenes,
  scale: {
    width: 1252,
    height: 937,
    mode: Phaser.Scale.RESIZE,
    parent: "phaser-game",
  },
  dom: {
    createContainer: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: {
        y: 0,
      },
    },
  },
  pixelArt: true,
  roundPixels: true,
};

class Game extends Phaser.Game {
  constructor(mobile) {
    super(config);
    const socket = io(`${SERVER_URL}`);
    this.globals = { socket };
    this.mobile = mobile;
    this.scene.start("Boot");
  }
}

window.onload = () => {
  var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return (
        navigator.userAgent.match(/IEMobile/i) ||
        navigator.userAgent.match(/WPDesktop/i)
      );
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };

  if (isMobile.any()) {
    window.game = new Game(true);
  } else {
    window.game = new Game(false);
  }
};
