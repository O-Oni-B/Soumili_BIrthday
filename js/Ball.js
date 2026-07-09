class Ball {
  constructor(cfg) {
    this.r   = cfg.ballRadius;
    this.reset(cfg.canvasW, cfg.canvasH, cfg.ballSpeed);
  }
  reset(CW, CH, speed) {
    this.x  = CW / 2;
    this.y  = CH - 80;
    this.vx = speed * (Math.random() > 0.5 ? 1 : -1);
    this.vy = -(speed + 0.7);
  }
  draw(ctx) {
    const g = ctx.createRadialGradient(this.x-2, this.y-2, 1, this.x, this.y, this.r);
    g.addColorStop(0, '#fff8e8'); g.addColorStop(1, '#c9a84c');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill();
  }
}
