class Brick {
  constructor(x, y, w, h, color, label) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.color = color; this.label = label;
    this.alive = true;
  }
  draw(ctx) {
    if (!this.alive) return;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(this.x, this.y, this.w, this.h, 4)
      : ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(this.x, this.y, this.w, 4);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '11px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(this.label, this.x + this.w/2, this.y + this.h/2);
  }
}
