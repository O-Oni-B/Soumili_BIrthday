class Dino {
  constructor(cfg) {
    this.x        = 60;
    this.y        = cfg.groundY;
    this.vy       = 0;
    this.w        = 36;
    this.h        = 44;
    this.onGround = true;
    this._frame   = 0;
  }
  jump(force) {
    if (this.onGround) { this.vy = force; this.onGround = false; }
  }
  update(gravity, groundY) {
    this.vy += gravity;
    this.y  += this.vy;
    this._frame++;
    if (this.y >= groundY) { this.y = groundY; this.vy = 0; this.onGround = true; }
  }
  draw(ctx) {
    ctx.font = `${this.h}px serif`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText(Math.floor(this._frame/8) % 2 === 0 ? '🌸' : '🌺', this.x, this.y);
  }
  // Inset hitbox for forgiveness
  get rect() {
    const i = 6;
    return { x:this.x+i, y:this.y+i, w:this.w-i*2, h:this.h-i*2 };
  }
}
