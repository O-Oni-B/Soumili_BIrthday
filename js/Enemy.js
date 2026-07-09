class Enemy {
  constructor(cfg) {
    const { canvasW:CW, enemyEmojis, enemySizeMin, enemySizeMax } = cfg;
    this.size  = enemySizeMin + Math.floor(Math.random() * (enemySizeMax - enemySizeMin + 1));
    this.x     = this.size/2 + Math.random() * (CW - this.size);
    this.y     = -this.size;
    this.speed = cfg._currentSpeed + Math.random() * 0.8;
    this.emoji = enemyEmojis[Math.floor(Math.random() * enemyEmojis.length)];
    this.alive = true;

    // Explosion state
    this.exploding    = false;
    this.explodeFrame = 0;
    this.explodeDuration = cfg.explosionDuration  || 40;
    this.explodeMaxScale = cfg.explosionMaxScale   || 2.5;
  }

  update() {
    if (this.exploding) {
      this.explodeFrame++;
      if (this.explodeFrame >= this.explodeDuration) this.alive = false;
      return;
    }
    this.y += this.speed;
  }

  explode() { this.exploding = true; this.explodeFrame = 0; }

  draw(ctx) {
    if (!this.alive) return;
    ctx.save();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    if (this.exploding) {
      // Scale up then fade out
      const t     = this.explodeFrame / this.explodeDuration;
      const scale = 1 + (this.explodeMaxScale - 1) * Math.sin(t * Math.PI);
      const alpha = 1 - t;
      ctx.globalAlpha = alpha;
      ctx.font = `${this.size * scale}px serif`;
      ctx.fillText('💥', this.x, this.y + this.size/2);
    } else {
      ctx.font = `${this.size}px serif`;
      ctx.fillText(this.emoji, this.x, this.y + this.size/2);
    }
    ctx.restore();
  }

  get rect() { return { x: this.x - this.size/2, y: this.y, w: this.size, h: this.size }; }
}
