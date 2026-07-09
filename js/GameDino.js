class GameDino extends MiniGame {
  constructor() {
    super();
    this.CONFIG = {
      ...GAME_CONFIG.dino,
      gameKey:  'dino',
      title:    'Dino Run',
      controls: 'Space or click to jump',
      lives:    0,
    };
    this._canvas = null; this._ctx = null;
    this._dino = null; this._obstacles = [];
    this._speed = 0; this._frame = 0; this._nextObs = 0;
    this._started = false; this._clickHandler = null;
  }

  enter(area) {
    super.enter(area);
    const { canvasW:CW, canvasH:CH } = this.CONFIG;
    area.innerHTML = `<div style="width:100%;text-align:center"><div id="dinoHud"></div><div id="dinoWrap"></div></div>`;
    this._renderHUD('dinoHud');
    const c = document.createElement('canvas');
    c.width = CW; c.height = CH;
    c.style.cssText = 'border-radius:12px;border:1px solid rgba(212,96,122,0.2);background:#fdf8f9;display:block;';
    this.el('dinoWrap').appendChild(this._wrapCanvas(c));
    this._canvas = c; this._ctx = c.getContext('2d');
    this._fitCanvas(c);
    this._drawIdle();
    this._showStartScreen(this.CONFIG.title, this.CONFIG.controls, () => this._startGame());
  }

  exit() {
    this._stopLoop(); this._unbindKeys(); this._detachResize();
    if (this._clickHandler && this._canvas) {
      this._canvas.removeEventListener('click', this._clickHandler);
      this._clickHandler = null;
    }
  }

  update() { if (!this._started) return; this._updateGame(); this._drawFrame(); }

  _startGame() {
    this._dino       = new Dino(this.CONFIG);
    this._obstacles  = [];
    this._speed      = this.CONFIG.startSpeed;
    this._frame      = 0;
    this._nextObs    = 80;
    this._started    = false;
    this._resetScore();
    this._bindKeys(e => {
      if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); this._jump(); }
    });
    if (this._clickHandler) this._canvas.removeEventListener('click', this._clickHandler);
    this._clickHandler = () => this._jump();
    this._canvas.addEventListener('click', this._clickHandler);
    this._startLoop();
  }

  _jump() {
    if (!this._running) return;
    this._started = true;
    this._dino.jump(this.CONFIG.jumpForce);
  }

  _updateGame() {
    const { canvasW:CW, groundY, gravity, speedIncrease, obstacleInterval } = this.CONFIG;
    this._frame++;
    this._speed += speedIncrease;
    // Score = frames / 6, only add delta each tick
    const newScore = Math.floor(this._frame / 6);
    if (newScore > this._score) { this._addScore(newScore - this._score); }

    this._dino.update(gravity, groundY);

    if (this._frame >= this._nextObs) {
      this._obstacles.push(new Obstacle(CW, groundY, this._dino.h));
      const [mn, mx] = obstacleInterval;
      this._nextObs = this._frame + mn + Math.floor(Math.random() * (mx - mn));
    }

    this._obstacles.forEach(o => o.update(this._speed));
    this._obstacles = this._obstacles.filter(o => o.alive);

    for (const o of this._obstacles) {
      if (this._collideRect(this._dino.rect, o.rect)) { this._onGameOver(); return; }
    }
  }

  _drawFrame() {
    const { canvasW:CW, canvasH:CH, groundY } = this.CONFIG; const ctx = this._ctx;
    ctx.fillStyle = '#fdf8f9'; ctx.fillRect(0,0,CW,CH);
    ctx.strokeStyle = 'rgba(212,96,122,0.3)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, groundY+this._dino.h+2); ctx.lineTo(CW, groundY+this._dino.h+2); ctx.stroke();
    this._obstacles.forEach(o => o.draw(ctx));
    this._dino.draw(ctx);
    if (!this._started) {
      ctx.fillStyle = 'rgba(212,96,122,0.5)'; ctx.font = '13px Special Elite,cursive';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Space or click to start!', CW/2, groundY/2);
    }
  }

  _drawIdle() {
    const { canvasW:CW, canvasH:CH } = this.CONFIG; const ctx = this._ctx;
    ctx.fillStyle = '#fdf8f9'; ctx.fillRect(0,0,CW,CH);
  }
}
