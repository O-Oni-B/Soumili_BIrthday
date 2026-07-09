class GameSnake extends MiniGame {
  constructor() {
    super();
    this.CONFIG = {
      ...GAME_CONFIG.snake,
      gameKey: 'snake',
      title:   'Snake',
      controls:'Arrow keys or WASD',
      lives:   0,
    };
    this._canvas = null; this._ctx = null;
    this._snake = null; this._food = null;
    this._foodIdx = 0; this._speed = 0; this._lastTick = 0;
  }

  enter(area) {
    super.enter(area);
    const { canvasW:CW, canvasH:CH } = this.CONFIG;
    area.innerHTML = `<div style="width:100%;text-align:center"><div id="snakeHud"></div><div id="snakeWrap"></div></div>`;
    this._renderHUD('snakeHud');
    const c = document.createElement('canvas');
    c.width = CW; c.height = CH;
    c.style.cssText = 'border-radius:12px;border:1px solid rgba(212,96,122,0.2);background:#0a090e;display:block;';
    this.el('snakeWrap').appendChild(this._wrapCanvas(c));
    this._canvas = c; this._ctx = c.getContext('2d');
    this._fitCanvas(c);
    this._drawIdle();
    this._showStartScreen(this.CONFIG.title, this.CONFIG.controls, () => this._startGame());
  }

  exit() { this._stopLoop(); this._unbindKeys(); this._detachResize(); }

  update() {
    const now = performance.now();
    if (now - this._lastTick < this._speed) { this._drawFrame(); return; }
    this._lastTick = now;
    this._tick();
  }

  _startGame() {
    const { canvasW:CW, canvasH:CH, gridSize:G, startSpeed } = this.CONFIG;
    const cols = CW/G, rows = CH/G;
    this._snake   = new Snake(cols, rows, G);
    this._food    = new SnakeFood(cols, rows, G);
    this._food.spawn(this._snake);
    this._foodIdx = 0;
    this._speed   = startSpeed;
    this._lastTick = performance.now();
    this._resetScore(); this._score = 1; this._refreshHUD();
    this._bindKeys(e => {
      const map = {
        ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0},
        w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0},
      };
      const d = map[e.key]; if (!d) return;
      this._snake.setDir(d);
      if (e.key.startsWith('Arrow')) e.preventDefault();
    });
    this._startLoop();
  }

  _tick() {
    const { canvasW:CW, canvasH:CH, gridSize:G } = this.CONFIG;
    const cols = CW/G, rows = CH/G;
    this._snake.move();
    if (this._snake.hitsWall(cols, rows) || this._snake.hitsSelf()) {
      this._onGameOver(); return;
    }
    if (this._snake.hitsFood(this._food)) {
      this._addScore(10);
      this._foodIdx = (this._foodIdx + 1) % this.CONFIG.foods.length;
      this._food.spawn(this._snake);
      this._speed = Math.max(this.CONFIG.minSpeed, this._speed - this.CONFIG.speedUp);
    } else {
      this._snake.shrink();
    }
    this._drawFrame();
  }

  _drawFrame() {
    const { canvasW:CW, canvasH:CH, gridSize:G, foods } = this.CONFIG; const ctx = this._ctx;
    ctx.fillStyle = '#0a090e'; ctx.fillRect(0,0,CW,CH);
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.5;
    for(let x=0;x<CW;x+=G){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,CH);ctx.stroke();}
    for(let y=0;y<CH;y+=G){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(CW,y);ctx.stroke();}
    this._snake.draw(ctx, foods, this._foodIdx);
    this._food.draw(ctx, foods[this._foodIdx]);
  }

  _drawIdle() {
    const { canvasW:CW, canvasH:CH } = this.CONFIG; const ctx = this._ctx;
    ctx.fillStyle = '#0a090e'; ctx.fillRect(0,0,CW,CH);
  }
}
