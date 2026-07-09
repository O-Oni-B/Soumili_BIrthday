class Snake {
  constructor(cols, rows, gridSize) {
    this.G = gridSize;
    const hx = Math.floor(cols/2), hy = Math.floor(rows/2);
    this.segments = [{ x:hx, y:hy }, { x:hx-1, y:hy }];
    this.dir      = { x:1, y:0 };
    this.nextDir  = { x:1, y:0 };
  }
  setDir(d) {
    if (d.x !== -this.dir.x || d.y !== -this.dir.y) this.nextDir = d;
  }
  move() {
    this.dir = { ...this.nextDir };
    const head = { x: this.segments[0].x + this.dir.x, y: this.segments[0].y + this.dir.y };
    this.segments.unshift(head);
    return head;
  }
  shrink() { this.segments.pop(); }
  hitsWall(cols, rows) {
    const h = this.segments[0];
    return h.x < 0 || h.x >= cols || h.y < 0 || h.y >= rows;
  }
  hitsSelf() {
    const [head, ...body] = this.segments;
    return body.some(s => s.x === head.x && s.y === head.y);
  }
  hitsFood(food) {
    return this.segments[0].x === food.x && this.segments[0].y === food.y;
  }
  draw(ctx, foods, foodIdx) {
    const G = this.G;
    this.segments.forEach((s, i) => {
      const alpha = i === 0 ? 1 : Math.max(0.3, 1 - i * 0.03);
      ctx.fillStyle = i === 0 ? '#e8889e' : `rgba(212,96,122,${alpha})`;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(s.x*G+1, s.y*G+1, G-2, G-2, i===0?6:3);
      else ctx.rect(s.x*G+1, s.y*G+1, G-2, G-2);
      ctx.fill();
    });
  }
}
