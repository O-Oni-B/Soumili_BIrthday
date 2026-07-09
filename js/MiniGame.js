/**
 * MiniGame — Base class for all mini games.
 *
 * Provides: canvas setup, collision detection, score, lives,
 * hi-score (localStorage), HUD, start/gameover/win screens, loop, keys.
 *
 * Each subclass sets this.CONFIG from GAME_CONFIG[key] in its constructor,
 * then implements enter(area), exit(), update().
 */
class MiniGame extends BirthdayApp {
  constructor() {
    super();
    this._area           = null;
    this._canvas         = null;
    this._running        = false;
    this._anim           = null;
    this._keys           = {};
    this._keyDownHandler = null;
    this._keyUpHandler   = null;
    this._resizeHandler  = null;
    this._score          = 0;
    this._lives          = 0;
  }

  // ── Lifecycle stubs ───────────────────────────────────────────────────────
  enter(area) { this._area = area; }
  exit()      { this._stopLoop(); this._unbindKeys(); this._detachResize(); }
  update()    {}

  // ── Canvas ────────────────────────────────────────────────────────────────

  _wrapCanvas(canvas) {
    const wrap = document.createElement('div');
    wrap.className = 'canvas-wrap';
    wrap.style.cssText = 'position:relative;display:inline-block;line-height:0;';
    wrap.appendChild(canvas);
    return wrap;
  }

  _fitCanvas(canvas) {
    const fit = () => {
      const wrap = canvas.parentElement;
      if (!wrap) return;
      const availW = (this._area || document.body).clientWidth - 48;
      const scale  = Math.min(1, availW / canvas.width);
      const cssW   = Math.floor(canvas.width  * scale);
      const cssH   = Math.floor(canvas.height * scale);
      canvas.style.width   = cssW + 'px';
      canvas.style.height  = cssH + 'px';
      canvas.style.display = 'block';
      wrap.style.width  = cssW + 'px';
      wrap.style.height = cssH + 'px';
    };
    fit();
    this._detachResize();
    this._resizeHandler = fit;
    window.addEventListener('resize', this._resizeHandler);
  }

  _detachResize() {
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
      this._resizeHandler = null;
    }
  }

  _getInputPos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    };
  }

  // ── Collision ─────────────────────────────────────────────────────────────

  _collideRect(a, b) {
    return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
  }

  _collideCircleRect(c, r) {
    const nx = Math.max(r.x, Math.min(c.x, r.x+r.w));
    const ny = Math.max(r.y, Math.min(c.y, r.y+r.h));
    const dx = c.x-nx, dy = c.y-ny;
    return dx*dx + dy*dy < c.r*c.r;
  }

  _collideCircles(a, b) {
    const dx=a.x-b.x, dy=a.y-b.y, d=a.r+b.r;
    return dx*dx+dy*dy < d*d;
  }

  _collidePoint(px, py, r) {
    return px>=r.x && px<=r.x+r.w && py>=r.y && py<=r.y+r.h;
  }

  // ── Score & Lives ─────────────────────────────────────────────────────────

  _addScore(n)  { this._score += n; this._refreshHUD(); }
  _resetScore() { this._score  = 0; this._refreshHUD(); }

  _loseLife() {
    this._lives--;
    this._refreshHUD();
    if (this._lives <= 0) { this._onGameOver(); return false; }
    return true;
  }

  // ── Hi-score ──────────────────────────────────────────────────────────────

  _getHiScore() {
    const key = this.CONFIG && this.CONFIG.gameKey;
    if (!key) return 0;
    return parseInt(localStorage.getItem('hiscore_' + key) || '0');
  }

  _saveHiScore() {
    const key = this.CONFIG && this.CONFIG.gameKey;
    if (!key) return;
    if (this._score > this._getHiScore())
      localStorage.setItem('hiscore_' + key, String(this._score));
  }

  // ── HUD ───────────────────────────────────────────────────────────────────

  _renderHUD(containerId) {
    const el = this.el(containerId);
    if (!el) return;
    el.innerHTML = `
      <div class="game-hud">
        <div class="game-hud-left">
          <span class="hud-label">score</span>
          <span class="hud-val" id="hudScore">0</span>
        </div>
        <div class="game-hud-center" id="hudLives"></div>
        <div class="game-hud-right">
          <span class="hud-label">best</span>
          <span class="hud-val" id="hudHi">${this._getHiScore()}</span>
        </div>
      </div>`;
    this._refreshHUD();
  }

  _refreshHUD() {
    const sc = this.el('hudScore');
    const lv = this.el('hudLives');
    const hi = this.el('hudHi');
    if (sc) sc.textContent = this._score;
    if (lv) lv.innerHTML   = this._lives > 0 ? '❤️'.repeat(Math.max(0, this._lives)) : '';
    if (hi) hi.textContent = Math.max(this._score, this._getHiScore());
  }

  // ── Screens ───────────────────────────────────────────────────────────────

  _showStartScreen(title, controls, onStart) {
    const wrap = this._canvas && this._canvas.parentElement;
    if (!wrap) return;
    const old = wrap.querySelector('.game-screen');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'game-screen game-screen--start';
    el.innerHTML = `
      <div class="game-screen__inner">
        <div class="game-screen__title">${title}</div>
        ${controls ? `<div class="game-screen__controls">${controls}</div>` : ''}
        <button class="game-btn game-screen__btn" id="gameStartBtn">Start →</button>
      </div>`;
    wrap.appendChild(el);
    this.el('gameStartBtn').addEventListener('click', () => { el.remove(); onStart(); });
  }

  _onGameOver() {
    this._stopLoop();
    this._saveHiScore();
    const wrap = this._canvas && this._canvas.parentElement;
    if (!wrap) return;
    const old = wrap.querySelector('.game-screen');
    if (old) old.remove();
    const isNewBest = this._score > 0 && this._score >= this._getHiScore();
    const el = document.createElement('div');
    el.className = 'game-screen game-screen--over';
    el.innerHTML = `
      <div class="game-screen__inner">
        <div class="game-screen__title game-screen__title--over">Game Over</div>
        <div class="game-screen__score">${this._score}</div>
        ${isNewBest ? '<div class="game-screen__best">🏆 New best!</div>' : ''}
        <button class="game-btn game-screen__btn" id="gameRestartBtn">Play again →</button>
      </div>`;
    wrap.appendChild(el);
    this.el('gameRestartBtn').addEventListener('click', () => this.enter(this._area));
  }

  _onWin() {
    this._stopLoop();
    this._saveHiScore();
    const wrap = this._canvas && this._canvas.parentElement;
    if (!wrap) return;
    const old = wrap.querySelector('.game-screen');
    if (old) old.remove();
    const isNewBest = this._score > 0 && this._score >= this._getHiScore();
    const msg = (this.CONFIG && this.CONFIG.winMsg) || '🎉 You win!';
    const el = document.createElement('div');
    el.className = 'game-screen game-screen--win';
    el.innerHTML = `
      <div class="game-screen__inner">
        <div class="game-screen__title game-screen__title--win">${msg}</div>
        <div class="game-screen__score">${this._score}</div>
        ${isNewBest ? '<div class="game-screen__best">🏆 New best!</div>' : ''}
        <button class="game-btn game-screen__btn" id="gameRestartBtn">Play again →</button>
      </div>`;
    wrap.appendChild(el);
    this.el('gameRestartBtn').addEventListener('click', () => this.enter(this._area));
  }

  // ── Loop ─────────────────────────────────────────────────────────────────

  _startLoop() {
    this._running = true;
    const tick = () => {
      if (!this._running) return;
      this.update();
      this._anim = requestAnimationFrame(tick);
    };
    this._anim = requestAnimationFrame(tick);
  }

  _stopLoop() {
    this._running = false;
    if (this._anim) { cancelAnimationFrame(this._anim); this._anim = null; }
  }

  // ── Keys ─────────────────────────────────────────────────────────────────

  _bindKeys(onKeyDown) {
    this._unbindKeys();
    this._keys = {};
    this._keyDownHandler = e => { this._keys[e.code] = true;  if (onKeyDown) onKeyDown(e); };
    this._keyUpHandler   = e => { this._keys[e.code] = false; };
    document.addEventListener('keydown', this._keyDownHandler);
    document.addEventListener('keyup',   this._keyUpHandler);
  }

  _unbindKeys() {
    if (this._keyDownHandler) { document.removeEventListener('keydown', this._keyDownHandler); this._keyDownHandler = null; }
    if (this._keyUpHandler)   { document.removeEventListener('keyup',   this._keyUpHandler);   this._keyUpHandler   = null; }
    this._keys = {};
  }

  // ── Draw utils ────────────────────────────────────────────────────────────

  _roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
  }

  _wrapVal(val, max) { return ((val % max) + max) % max; }
}
