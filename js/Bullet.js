class Bullet {
  constructor(x, y, cfg) {
    this.x = x; this.y = y;
    this.w = cfg.bulletW || 4;
    this.h = cfg.bulletH || 12;
    this.speed = cfg.bulletSpeed;
    this.alive = true;
  }
  update() { this.y -= this.speed; if (this.y < -this.h) this.alive = false; }
  draw(ctx) {
    ctx.fillStyle = '#f5d0db';
    ctx.fillRect(this.x - this.w/2, this.y, this.w, this.h);
  }
  get rect() { return { x: this.x - this.w/2, y: this.y, w: this.w, h: this.h }; }
}
