class Bird {
  constructor(cfg) {
    this.x  = 80;
    this.y  = cfg.canvasH / 2;
    this.vy = 0;
    this.r  = cfg.birdRadius || 14;
  }
  flap(force) { this.vy = force; }
  update(gravity) { this.vy += gravity; this.y += this.vy; }
  draw(ctx) {
    const rot = Math.min(Math.PI/4, Math.max(-Math.PI/4, this.vy * 0.05));
    ctx.save();
    ctx.translate(this.x, this.y); ctx.rotate(rot);
    ctx.font = '28px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🌸', 0, 0);
    ctx.restore();
  }
  get circle() { return { x: this.x, y: this.y, r: this.r }; }
}
