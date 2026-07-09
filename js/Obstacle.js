class Obstacle {
  constructor(canvasW, groundY, dinoH) {
    const h  = 30 + Math.floor(Math.random() * 30);
    this.x   = canvasW;
    this.y   = groundY + dinoH - h;
    this.w   = 20;
    this.h   = h;
    this.alive = true;
  }
  update(speed) { this.x -= speed; if (this.x + this.w < 0) this.alive = false; }
  draw(ctx) {
    ctx.fillStyle = '#8b4a6b';
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillRect(this.x - 4, this.y, this.w + 8, 8);
  }
  get rect() { return { x:this.x, y:this.y, w:this.w, h:this.h }; }
}
