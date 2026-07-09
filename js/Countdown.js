/**
 * Countdown — extends BirthdayApp
 */
class Countdown extends BirthdayApp {
  constructor() {
    super();
    this._interval = null;
  }

  init() {
    // If already birthday on load, go straight to reveal
    if (this.isBirthday()) {
      this._showBirthdayReveal();
    } else {
      this._updateTimer();
      this._interval = setInterval(() => {
        if (this.isBirthday()) {
          clearInterval(this._interval);
          this._showBirthdayReveal();
        } else {
          this._updateTimer();
        }
      }, 1000);
    }
  }

  _updateTimer() {
    const diff  = this.TARGET_UTC - this.getNow();
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    this.el('cd-d').textContent = this.pad(days);
    this.el('cd-h').textContent = this.pad(hours);
    this.el('cd-m').textContent = this.pad(mins);
    this.el('cd-s').textContent = this.pad(secs);

    const heroNum = this.el('ringDays');
    if (heroNum) heroNum.textContent = days;
  }

  _injectTab(tab, label) {
    if (document.querySelector(`.nav-tab[data-tab="${tab}"]`)) return;
    const nav = document.getElementById('navTabs');
    if (!nav) return;
    const btn = document.createElement('button');
    btn.className = 'nav-tab';
    btn.setAttribute('data-tab', tab);
    btn.textContent = label;
    nav.appendChild(btn);
    // Use the global tab switcher so it works same as static tabs
    btn.addEventListener('click', () => window._switchTab(tab, btn));
  }

  _unlockAllTabs() {
    this._injectTab('memories', 'Memory Wall');
    this._injectTab('games',    'Mini Games');
    this._injectTab('wishes',   'Make a Wish');
  }

  _showBirthdayReveal() {
    this._unlockAllTabs();

    // Shrink hero to just emoji
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.innerHTML = `
        <div class="confetti-container" id="confetti"></div>
        <div class="hero-birthday-ring">🎉</div>
      `;
      const ce = document.getElementById('confetti');
      const cc = ['#d4607a','#e8889e','#f5d0db','#7ab8d4','#c9a84c'];
      for (let i = 0; i < 28; i++) {
        const d = document.createElement('div'); d.className = 'confetti-dot';
        d.style.cssText = `left:${Math.random()*100}%;background:${cc[i%cc.length]};animation-duration:${4+Math.random()*5}s;animation-delay:${Math.random()*6}s;width:${2+Math.random()*4}px;height:${2+Math.random()*4}px;border-radius:${Math.random()>.5?'50%':'2px'};`;
        ce.appendChild(d);
      }
    }

    // Birthday reveal in countdown section
    const section = this.el('s-countdown');
    section.innerHTML = `
      <div class="birthday-reveal">
        <div class="reveal-fireworks" id="revealFireworks"></div>
        <div class="reveal-text">
          <div class="reveal-happy">Happy</div>
          <div class="reveal-age">${this.BIRTHDAY_AGE}</div>
          <div class="reveal-birthday">Birthday</div>
          <div class="reveal-name">${this.BIRTHDAY_NAME}!!!</div>
        </div>
        <div class="reveal-sub">wishing you the most beautiful day 🖤</div>
      </div>
    `;
    this._spawnFireworks();
  }

  _spawnFireworks() {
    const container = this.el('revealFireworks');
    if (!container) return;
    const colors = ['#d4607a','#e8889e','#f5d0db','#c9a84c','#7ab8d4','#a78bfa'];
    for (let i = 0; i < 60; i++) {
      const d = document.createElement('div');
      d.className = 'fw-dot';
      d.style.cssText = `
        left:${Math.random()*100}%;top:${Math.random()*100}%;
        background:${colors[i % colors.length]};
        animation-duration:${1.5 + Math.random()*2}s;
        animation-delay:${Math.random()*2}s;
        width:${3 + Math.random()*5}px;height:${3 + Math.random()*5}px;
        border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
      `;
      container.appendChild(d);
    }
  }
}
