class GameTrivia extends MiniGame {
  constructor(questions, config = {}) {
    super();
    this._allQuestions = questions; // full bank
    this._questions    = [];        // active set (random 10)
    this.CONFIG = {
      gameKey:       config.gameKey  || 'trivia',
      title:         config.title    || 'Trivia',
      winMsg:        config.winMsg   || '🎉 Perfect!',
      okMsg:         config.okMsg    || 'Not bad!',
      loseMsg:       config.loseMsg  || 'Better luck next time 😄',
      winAt:         config.winAt    ?? 8,
      questionsPerRound: config.questionsPerRound ?? 10,
      lives:         0,
    };
    this._idx = 0;
  }

  enter(area) {
    super.enter(area);
    // Pick a fresh random set each time
    this._questions = this._pickRandom(this._allQuestions, this.CONFIG.questionsPerRound);
    this._idx = 0;
    this._resetScore();
    this._render();
  }

  exit() { super.exit(); }

  _pickRandom(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, arr.length));
  }

  _render() {
    if (this._idx >= this._questions.length) { this._showResult(); return; }
    const q = this._questions[this._idx];
    this._area.innerHTML = `
      <div style="width:100%">
        <div style="display:flex;justify-content:space-between;margin-bottom:14px;font-size:11px;color:var(--muted)">
          <span>Q${this._idx+1} / ${this._questions.length}</span>
          <span class="score-badge">${this._score} correct</span>
        </div>
        <div class="trivia-q">${q.q}</div>
        <div class="trivia-opts">
          ${q.opts.map((o,i)=>`<button class="trivia-opt" data-i="${i}">${o}</button>`).join('')}
        </div>
        <div id="trivFb" style="font-size:12px;margin-top:10px;min-height:18px;color:var(--muted);"></div>
        <div id="trivNxt" style="display:none">
          <button class="trivia-next" id="trivNext">Next →</button>
        </div>
      </div>`;
    this.$$('.trivia-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-i'));
        this.$$('.trivia-opt').forEach(b => b.disabled = true);
        const fb = this.el('trivFb');
        if (idx === q.a) {
          btn.classList.add('correct'); this._addScore(1);
          fb.textContent = '✓ Correct!'; fb.style.color = '#52b788';
        } else {
          btn.classList.add('wrong');
          this.$$('.trivia-opt')[q.a].classList.add('correct');
          fb.textContent = 'Not quite — ' + q.opts[q.a]; fb.style.color = 'var(--muted)';
        }
        this.el('trivNxt').style.display = 'block';
        this.el('trivNext').addEventListener('click', () => { this._idx++; this._render(); });
      });
    });
  }

  _showResult() {
    const s=this._score, t=this._questions.length;
    const msg = s>=this.CONFIG.winAt ? this.CONFIG.winMsg
              : s>=Math.ceil(t/2)    ? this.CONFIG.okMsg
              : this.CONFIG.loseMsg;
    this._saveHiScore();
    const isNewBest = this._score > 0 && this._score >= this._getHiScore();
    this._area.innerHTML = `
      <div style="text-align:center">
        <div class="trivia-score">${s}/${t}</div>
        <div style="font-size:14px;color:var(--muted);margin-bottom:14px;">${msg}</div>
        ${isNewBest ? '<div style="font-size:12px;color:var(--petal);margin-bottom:10px;">🏆 New best!</div>' : ''}
        <button class="trivia-next" id="trivAgain">Play again</button>
      </div>`;
    this.el('trivAgain').addEventListener('click', () => this.enter(this._area));
  }
}
