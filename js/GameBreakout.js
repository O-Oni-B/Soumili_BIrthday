class GameBreakout extends MiniGame {
  constructor() {
    super();
    this.CONFIG = {
      ...GAME_CONFIG.breakout,
      gameKey: 'breakout',
      title:   'Birthday Breakout',
      winMsg:  '🎉 All bricks smashed!',
      controls:'← → / WASD or mouse',
    };
    this._canvas = null; this._ctx = null;
    this._ball = null; this._paddle = null; this._bricks = [];
    this._mouseHandler = null; this._touchHandler = null;
  }

  enter(area) {
    super.enter(area);
    this._resetScore();
    this._lives = this.CONFIG.lives;
    const { canvasW:CW, canvasH:CH } = this.CONFIG;
    area.innerHTML = `<div style="width:100%"><div id="bkHud"></div><div id="bkWrap"></div></div>`;
    this._renderHUD('bkHud');
    const c = document.createElement('canvas');
    c.width = CW; c.height = CH;
    c.style.cssText = 'border-radius:12px;border:1px solid rgba(212,96,122,0.2);display:block;';
    this.el('bkWrap').appendChild(this._wrapCanvas(c));
    this._canvas = c; this._ctx = c.getContext('2d');
    this._fitCanvas(c);
    this._buildBricks();
    this._ball   = new Ball(this.CONFIG);
    this._paddle = new Paddle(this.CONFIG);
    this._drawFrame();
    this._showStartScreen(this.CONFIG.title, this.CONFIG.controls, () => this._startGame());
  }

  exit() {
    this._stopLoop(); this._unbindKeys(); this._detachResize();
    if (this._mouseHandler && this._canvas) this._canvas.removeEventListener('mousemove', this._mouseHandler);
    if (this._touchHandler && this._canvas) this._canvas.removeEventListener('touchmove', this._touchHandler);
    this._mouseHandler = null; this._touchHandler = null;
  }

  update() { this._updateGame(); this._drawFrame(); }

  _buildBricks() {
    const { cols, rows, brickW, brickH, brickPad, brickOffsetX, brickOffsetY, colors, labels } = this.CONFIG;
    this._bricks = [];
    for (let r=0; r<rows; r++)
      for (let c=0; c<cols; c++)
        this._bricks.push(new Brick(
          brickOffsetX + c*(brickW+brickPad),
          brickOffsetY + r*(brickH+brickPad),
          brickW, brickH,
          colors[r % colors.length],
          labels[r % labels.length]
        ));
  }

  _startGame() {
    const { canvasW:CW } = this.CONFIG;
    this._bindKeys();
    this._mouseHandler = e => {
      const p = this._getInputPos(this._canvas, e);
      this._paddle.x = Math.max(0, Math.min(CW - this._paddle.w, p.x - this._paddle.w/2));
    };
    this._touchHandler = e => {
      e.preventDefault();
      const p = this._getInputPos(this._canvas, e.touches[0]);
      this._paddle.x = Math.max(0, Math.min(CW - this._paddle.w, p.x - this._paddle.w/2));
    };
    this._canvas.addEventListener('mousemove', this._mouseHandler);
    this._canvas.addEventListener('touchmove', this._touchHandler, { passive:false });
    this._startLoop();
  }

  _updateGame() {
    const { canvasW:CW, canvasH:CH, ballMaxSpeed, paddleMoveSpeed, pointsPerBrick, ballSpeed } = this.CONFIG;
    const ball = this._ball, paddle = this._paddle;

    if (this._keys['ArrowLeft'] || this._keys['KeyA'])  paddle.x = Math.max(0, paddle.x - paddleMoveSpeed);
    if (this._keys['ArrowRight']|| this._keys['KeyD'])  paddle.x = Math.min(CW - paddle.w, paddle.x + paddleMoveSpeed);

    ball.x += ball.vx; ball.y += ball.vy;
    if (ball.x - ball.r < 0)  { ball.x = ball.r;    ball.vx *= -1; }
    if (ball.x + ball.r > CW) { ball.x = CW-ball.r; ball.vx *= -1; }
    if (ball.y - ball.r < 0)  { ball.y = ball.r;    ball.vy *= -1; }

    if (this._collideCircleRect(ball, paddle)) {
      ball.y = paddle.y - ball.r;
      const rel = (ball.x - (paddle.x + paddle.w/2)) / (paddle.w/2);
      const spd = Math.min(ballMaxSpeed, Math.sqrt(ball.vx**2 + ball.vy**2) + 0.1);
      ball.vx = rel * spd * 1.1;
      ball.vy = -Math.abs(spd);
      if (Math.abs(ball.vx) < 0.4) ball.vx = (ball.vx >= 0 ? 1 : -1) * 0.4;
    }

    if (ball.y - ball.r > CH) {
      ball.reset(CW, CH, ballSpeed);
      if (!this._loseLife()) return;
    }

    let allGone = true;
    for (const b of this._bricks) {
      if (!b.alive) continue;
      allGone = false;
      if (this._collideCircleRect(ball, b)) {
        b.alive = false;
        this._addScore(pointsPerBrick);
        const ol=ball.x-b.x, or_=(b.x+b.w)-ball.x, ot=ball.y-b.y, ob=(b.y+b.h)-ball.y;
        if (Math.min(ot,ob) < Math.min(ol,or_)) ball.vy *= -1; else ball.vx *= -1;
        break;
      }
    }
    if (allGone) this._onWin();
  }

  _drawFrame() {
    const { canvasW:CW, canvasH:CH } = this.CONFIG; const ctx = this._ctx;
    ctx.fillStyle = '#0a090e'; ctx.fillRect(0,0,CW,CH);
    ctx.strokeStyle = 'rgba(201,168,76,0.04)'; ctx.lineWidth = 0.5;
    for (let x=0;x<CW;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,CH);ctx.stroke();}
    for (let y=0;y<CH;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(CW,y);ctx.stroke();}
    this._bricks.forEach(b => b.draw(ctx));
    this._paddle.draw(ctx);
    this._ball.draw(ctx);
  }
}
