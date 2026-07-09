class Paddle {
  constructor(cfg) {
    this.w = cfg.paddleWidth;
    this.h = cfg.paddleHeight;
    this.x = cfg.canvasW / 2 - this.w / 2;
    this.y = cfg.canvasH - 26;
  }
  draw(ctx) {
    const g = ctx.createLinearGradient(this.x, 0, this.x + this.w, 0);
    g.addColorStop(0, '#7a5f28'); g.addColorStop(0.5, '#c9a84c'); g.addColorStop(1, '#7a5f28');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(this.x, this.y, this.w, this.h, 6)
      : ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
  }
}
