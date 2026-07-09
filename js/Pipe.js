class Pipe {
  constructor(cfg) {
    const { canvasW:CW, canvasH:CH, pipeWidth, gapMin, gapMax } = cfg;
    this.w      = pipeWidth;
    this.gap    = gapMin + Math.random() * (gapMax - gapMin);
    this.gapY   = 60 + Math.random() * (CH - this.gap - 120);
    this.x      = CW;
    this.scored = false;
    this.CH     = CH;
  }
  update(speed) { this.x -= speed; }
  isOffscreen() { return this.x + this.w < 0; }
  draw(ctx) {
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(this.x, 0, this.w, this.gapY);
    ctx.fillStyle = '#3a7a32'; ctx.fillRect(this.x-4, this.gapY-20, this.w+8, 20);
    ctx.fillStyle = '#2d5a27';
    const bTop = this.gapY + this.gap;
    ctx.fillRect(this.x, bTop, this.w, this.CH - bTop);
    ctx.fillStyle = '#3a7a32'; ctx.fillRect(this.x-4, bTop, this.w+8, 20);
  }
  get topRect()    { return { x:this.x, y:0,              w:this.w, h:this.gapY }; }
  get bottomRect() { return { x:this.x, y:this.gapY+this.gap, w:this.w, h:this.CH-(this.gapY+this.gap) }; }
}
