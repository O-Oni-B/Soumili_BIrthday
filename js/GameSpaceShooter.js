class GameSpaceShooter extends MiniGame {
  constructor() {
    super();
    this.CONFIG = {
      ...GAME_CONFIG.spaceshooter,
      gameKey:  'spaceshooter',
      title:    'Space Shooter',
      controls: '← → / WASD move · Space shoot',
    };
    this._canvas = null; this._ctx = null;
    this._ship = null; this._bullets = []; this._enemies = [];
    this._lastShot = 0; this._killCount = 0;
    this._spawnTimer = null;
    this._currentSpeed = this.CONFIG.enemyStartSpeed;
    this._spawnMs      = this.CONFIG.spawnInterval;
  }

  enter(area) {
    super.enter(area);
    const { canvasW:CW, canvasH:CH } = this.CONFIG;
    area.innerHTML = `<div style="width:100%;text-align:center"><div id="ssHud"></div><div id="ssWrap"></div></div>`;
    this._renderHUD('ssHud');
    const c = document.createElement('canvas');
    c.width = CW; c.height = CH;
    c.style.cssText = 'border-radius:12px;border:1px solid rgba(212,96,122,0.2);background:#0a090e;display:block;';
    this.el('ssWrap').appendChild(this._wrapCanvas(c));
    this._canvas = c; this._ctx = c.getContext('2d');
    this._fitCanvas(c);
    this._drawIdle();
    this._showStartScreen(this.CONFIG.title, this.CONFIG.controls, () => this._startGame());
  }

  exit() {
    this._stopLoop(); this._unbindKeys(); this._detachResize();
    if (this._spawnTimer) { clearInterval(this._spawnTimer); this._spawnTimer = null; }
  }

  update() { this._updateGame(); this._drawFrame(); }

  _startGame() {
    this._resetScore();
    this._lives         = this.CONFIG.lives;
    this._bullets       = []; this._enemies = [];
    this._lastShot      = 0; this._killCount = 0;
    this._currentSpeed  = this.CONFIG.enemyStartSpeed;
    this._spawnMs       = this.CONFIG.spawnInterval;
    this._ship          = new Ship(this.CONFIG);
    this._refreshHUD();
    this._bindKeys(e => { if (e.code === 'Space') e.preventDefault(); });
    this._scheduleSpawn();
    this._startLoop();
  }

  _scheduleSpawn() {
    if (this._spawnTimer) clearInterval(this._spawnTimer);
    this._spawnTimer = setInterval(() => {
      if (!this._running) return;
      // Pass current speed via a temp property
      const cfg = { ...this.CONFIG, _currentSpeed: this._currentSpeed };
      this._enemies.push(new Enemy(cfg));
    }, this._spawnMs);
  }

  _updateGame() {
    const { canvasW:CW, canvasH:CH, playerSpeed, shootCooldown,
            enemySpeedIncr, enemyMaxSpeed, spawnDecrement, minSpawnInterval, pointsPerKill } = this.CONFIG;
    const now = Date.now(), s = this._ship;

    if (this._keys['ArrowLeft'] || this._keys['KeyA'])  s.x = Math.max(0, s.x - playerSpeed);
    if (this._keys['ArrowRight']|| this._keys['KeyD'])  s.x = Math.min(CW - s.w, s.x + playerSpeed);

    if (this._keys['Space'] && now - this._lastShot > shootCooldown) {
      this._bullets.push(new Bullet(s.x + s.w/2, s.y - 4, this.CONFIG));
      this._lastShot = now;
    }

    this._bullets.forEach(b => b.update());
    this._bullets = this._bullets.filter(b => b.alive);
    this._enemies.forEach(e => e.update());

    // Bullet → enemy
    for (const b of this._bullets) {
      for (const e of this._enemies) {
        if (!e.alive || e.exploding) continue;
        if (this._collideRect(b.rect, e.rect)) {
          b.alive = false;
          e.explode();
          this._addScore(pointsPerKill);
          this._killCount++;
          this._currentSpeed = Math.min(enemyMaxSpeed, this._currentSpeed + enemySpeedIncr);
          this._spawnMs      = Math.max(minSpawnInterval, this._spawnMs - spawnDecrement);
          this._scheduleSpawn();
        }
      }
    }

    // Enemy → player or missed
    for (const e of this._enemies) {
      if (e.exploding || !e.alive) continue;
      const hitPlayer = this._collideRect(e.rect, { x:s.x, y:s.y, w:s.w, h:s.h });
      const missed    = e.y > CH;
      if (hitPlayer || missed) {
        e.alive = false;
        if (!this._loseLife()) {
          if (this._spawnTimer) { clearInterval(this._spawnTimer); this._spawnTimer = null; }
          return;
        }
      }
    }

    this._enemies = this._enemies.filter(e => e.alive);
    this._bullets = this._bullets.filter(b => b.alive);
  }

  _drawFrame() {
    const { canvasW:CW, canvasH:CH } = this.CONFIG; const ctx = this._ctx;
    ctx.fillStyle = '#0a090e'; ctx.fillRect(0,0,CW,CH);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    for (let i=0;i<50;i++) ctx.fillRect((i*73+11)%CW, (i*47+23)%CH, 1, 1);
    this._enemies.forEach(e => e.draw(ctx));
    this._bullets.forEach(b => b.draw(ctx));
    const thrusting = this._keys['ArrowLeft']||this._keys['ArrowRight']||this._keys['KeyA']||this._keys['KeyD']||this._keys['Space'];
    this._ship.draw(ctx, thrusting);
  }

  _drawIdle() {
    const { canvasW:CW, canvasH:CH } = this.CONFIG; const ctx = this._ctx;
    ctx.fillStyle = '#0a090e'; ctx.fillRect(0,0,CW,CH);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    for (let i=0;i<50;i++) ctx.fillRect((i*73+11)%CW,(i*47+23)%CH,1,1);
  }
}
