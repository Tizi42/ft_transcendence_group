export class Ball extends Phaser.Physics.Arcade.Sprite {
  initialVelocityX = 100;
  initialVelocityY = 100;
  lastVelX = 0;
  lastVelY = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "ball", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setScale(0.8);
    this.setBounce(1, 1);
  }

  update_state(
    pos_x: number,
    pos_y: number,
    dir_x: number,
    dir_y: number,
    speed: number
  ): void {
    this.x = pos_x;
    this.y = pos_y;

    if (this.lastVelX != dir_x || this.lastVelY != dir_y) {
      this.lastVelX = dir_x;
      this.lastVelY = dir_y;
      this.setVelocityX(dir_x * speed);
      this.setVelocityY(dir_y * speed);
    }
  }

  update_velocity() {
    this.setVelocityX(this.initialVelocityX);
    this.setVelocityY(this.initialVelocityY);
  }
}
