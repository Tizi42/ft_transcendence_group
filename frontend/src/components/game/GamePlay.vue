<template>
  <div class="game-frame">
    <button @click="initializeGame">Initialize</button>
    <button @click="searchGame">Search</button>
    <div class="score">{{ score_left }} : {{ score_right }}</div>
    <ion-phaser
      v-bind:game.prop="gameConfig"
      v-bind:initialize.prop="initialize"
    />
  </div>
</template>

<script lang="ts" setup>
import { defineExpose, defineComponent, ref } from "vue";
import Phaser from "phaser";
// import GameScene from "@/game/scenes/Game";

let gameConfig: Phaser.Types.Core.GameConfig = {
  width: 1043,
  height: 591,
  type: Phaser.AUTO,
  physics: {
    default: "arcade",
  },
  // scene: [GameScene],
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// let game = new Phaser.Game(gameConfig);

let ball: Phaser.Physics.Arcade.Sprite;
let paddle_left: Phaser.Physics.Arcade.Sprite;
let paddle_right: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;

let score_left = ref(0);
let score_right = ref(0);

type GameStatus =
  | "not_ready"
  | "one_player_ready"
  | "ready"
  | "running"
  | "ended"; //left_won, right_won
let game_status: GameStatus = "ready";
let ball_velocity: number;

function preload(this: Phaser.Scene) {
  this.load.image("background", "background.png");
  this.load.image("ball", "ball.png");
  this.load.image("paddle", "paddle.png");
}

function create(this: Phaser.Scene) {
  // set up background
  this.add.image(
    this.cameras.main.centerX,
    this.cameras.main.centerY,
    "background"
  );

  // set up world bounds
  this.physics.world.setBounds(
    -100,
    0,
    this.cameras.main.width + 200,
    this.cameras.main.height
  );

  // set up ball
  ball = this.physics.add.sprite(
    this.cameras.main.width * 0.5,
    this.cameras.main.height * 0.5,
    "ball"
  );
  ball.setCollideWorldBounds(true);
  ball.setScale(0.8);
  ball.setBounce(1, 1);
  ball_velocity = 350;

  // set up paddles
  // paddle_left = create_paddle(
  //   this,
  //   this.cameras.main.width * 0.02,
  //   this.cameras.main.height * 0.5
  // );
  paddle_left = create_paddle(
    this,
    this.cameras.main.width * 0.02,
    this.cameras.main.height * 0.5
  );

  paddle_right = create_paddle(
    this,
    this.cameras.main.width * 0.98,
    this.cameras.main.height * 0.5
  );

  //  set up input event
  cursors = this.input.keyboard.createCursorKeys();

  // collide ball with paddle
  this.physics.add.collider(ball, paddle_left);
  this.physics.add.collider(ball, paddle_right);
}

function update(this: Phaser.Scene) {
  let keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  let keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

  if (game_status === "ready") {
    launch_ball(this, "toRight");
    game_status = "running";
  }

  if (cursors.up.isDown) {
    paddle_left.setVelocityY(-250);
  } else if (cursors.down.isDown) {
    paddle_left.setVelocityY(250);
  } else if (cursors.up.isUp) {
    paddle_left.setVelocityY(0);
  } else if (cursors.down.isUp) {
    paddle_left.setVelocityY(0);
  }

  if (keyW.isDown) {
    paddle_right.setVelocityY(-250);
  } else if (keyS.isDown) {
    paddle_right.setVelocityY(250);
  } else if (keyW.isUp) {
    paddle_right.setVelocityY(0);
  } else if (keyS.isUp) {
    paddle_right.setVelocityY(0);
  }

  const leftBounds = -30;
  const rightBounds = this.cameras.main.width + 30;

  if (ball.x < leftBounds) {
    score_right.value += 1;
    launch_ball(this, "toLeft");
  } else if (ball.x > rightBounds) {
    score_left.value += 1;
    launch_ball(this, "toRight");
  }
}

function create_paddle(scene: Phaser.Scene, x: number, y: number) {
  let paddle: Phaser.Physics.Arcade.Sprite;

  paddle = scene.physics.add.sprite(x, y, "paddle");
  paddle.setCollideWorldBounds(true);
  paddle.setImmovable(true);
  return paddle;
}

function launch_ball(scene: Phaser.Scene, direction: string) {
  ball.disableBody(true, true);
  ball.enableBody(
    true,
    scene.cameras.main.centerX,
    Phaser.Math.Between(0, scene.cameras.main.height),
    true,
    true
  );
  if (direction === "toLeft") ball.setVelocity(-300, 300);
  else ball.setVelocity(300, 300);
}

const initialize = ref(false);

function initializeGame() {
  console.log("test");
}

function searchGame() {
  initialize.value = true;
}

defineExpose(
  defineComponent({
    name: "GamePlay",
  })
);
</script>

<style scoped>
.score {
  font-size: 32px;
  color: white;
}
</style>
