class GameFlappy extends MiniGame {
  constructor() {
    super();
    this.CONFIG = {
      ...GAME_CONFIG.flappy,
      gameKey:  'flappy',
      title:    'Flappy Flower',
      controls: 'Space or click to flap',
      lives:    0,
    };
    this._canvas = null; this._ctx = null;
    this._bird = null; this._pipes = [];
    this._frame = 0; this._started = false;
    this._clickHandler = null;
  }

  enter(area) {
    super.enter(area);
    const { canvasW:CW, canvasH:CH } = this.CONFIG;
    area.innerHTML = `<div style="width:100%;text-align:center"><div id="flappyHud"></div><div id="flappyWrap"></div></div>`;
    this._renderHUD('flappyHud');
    const c = document.createElement('canvas');
    c.width = CW; c.height = CH;
    c.style.cssText = 'border-radius:12px;border:1px solid rgba(212,96,122,0.2);background:#0a090e;display:block;';
    this.el('flappyWrap').appendChild(this._wrapCanvas(c));
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

  update() { this._updateGame(); this._drawFrame(); }

  _startGame() {
    this._bird    = new Bird(this.CONFIG);
    this._pipes   = [];
    this._frame   = 0;
    this._started = false;
    this._resetScore();
    this._bindKeys(e => { if (e.code === 'Space') { e.preventDefault(); this._flap(); } });
    if (this._clickHandler) this._canvas.removeEventListener('click', this._clickHandler);
    this._clickHandler = () => this._flap();
    this._canvas.addEventListener('click', this._clickHandler);
    this._startLoop();
  }

  _flap() {
    if (!this._running) return;
    this._started = true;
    this._bird.flap(this.CONFIG.flapForce);
  }

  _updateGame() {
    const { canvasH:CH, gravity, pipeInterval, scrollSpeed } = this.CONFIG;
    if (!this._started) return;
    this._frame++;
    this._bird.update(gravity);

    if (this._frame % pipeInterval === 0) this._pipes.push(new Pipe(this.CONFIG));
    this._pipes.forEach(p => p.update(scrollSpeed));
    this._pipes = this._pipes.filter(p => !p.isOffscreen());
    this._pipes.forEach(p => {
      if (!p.scored && p.x + p.w < this._bird.x) { p.scored = true; this._addScore(1); }
    });

    const b = this._bird.circle;
    if (b.y - b.r < 0 || b.y + b.r > CH) { this._onGameOver(); return; }
    for (const p of this._pipes) {
      if (this._collideCircleRect(b, p.topRect) || this._collideCircleRect(b, p.bottomRect)) {
        this._onGameOver(); return;
      }
    }
  }

  _drawFrame() {
    const { canvasW:CW, canvasH:CH } = this.CONFIG; const ctx = this._ctx;
    ctx.fillStyle = '#0a090e'; ctx.fillRect(0,0,CW,CH);
    this._pipes.forEach(p => p.draw(ctx));
    this._bird.draw(ctx);
    if (!this._started) {
      ctx.fillStyle = 'rgba(212,96,122,0.6)'; ctx.font = '14px Special Elite,cursive';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('Space or click to start', CW/2, CH/2 + 60);
    }
  }

  _drawIdle() {
    const { canvasW:CW, canvasH:CH } = this.CONFIG; const ctx = this._ctx;
    ctx.fillStyle = '#0a090e'; ctx.fillRect(0,0,CW,CH);
  }
}
