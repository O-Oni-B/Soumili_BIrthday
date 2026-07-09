class Ship {
  constructor(cfg) {
    this.w = 40; this.h = 30;
    this.x = cfg.canvasW/2 - this.w/2;
    this.y = cfg.canvasH - 48;
  }
  draw(ctx, thrusting) {
    ctx.fillStyle = '#e8889e';
    ctx.beginPath();
    ctx.moveTo(this.x+this.w/2, this.y);
    ctx.lineTo(this.x+this.w,   this.y+this.h);
    ctx.lineTo(this.x+this.w*0.65, this.y+this.h*0.7);
    ctx.lineTo(this.x+this.w/2, this.y+this.h*0.85);
    ctx.lineTo(this.x+this.w*0.35, this.y+this.h*0.7);
    ctx.lineTo(this.x, this.y+this.h);
    ctx.closePath(); ctx.fill();
    if (thrusting) {
      ctx.fillStyle = 'rgba(201,168,76,0.7)';
      ctx.beginPath();
      ctx.ellipse(this.x+this.w/2, this.y+this.h+5, 6, 10+Math.random()*6, 0, 0, Math.PI*2);
      ctx.fill();
    }
  }
}
