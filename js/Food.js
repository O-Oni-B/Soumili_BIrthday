class SnakeFood {
  constructor(cols, rows, gridSize) {
    this.G    = gridSize;
    this.cols = cols;
    this.rows = rows;
    this.x = 0; this.y = 0;
  }
  spawn(snake) {
    do {
      this.x = Math.floor(Math.random() * this.cols);
      this.y = Math.floor(Math.random() * this.rows);
    } while (snake.segments.some(s => s.x === this.x && s.y === this.y));
  }
  draw(ctx, emoji) {
    const G = this.G;
    ctx.font = `${G-2}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(emoji, this.x*G + G/2, this.y*G + G/2);
  }
}
