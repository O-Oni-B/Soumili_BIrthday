/**
 * MakeAWish — extends BirthdayApp
 */
class MakeAWish extends BirthdayApp {
  constructor() {
    super();
    this._wishes = [
      "May every song you love hit differently this year.",
      "May you always find beauty in the heavy things.",
      "May the next decade be everything you can't yet imagine.",
      "May you never lose the part of you that loves fiercely.",
      "May the universe conspire entirely in your favour.",
      "May you wake up on your birthday knowing you are deeply loved.",
      "May every day hold at least one perfect song.",
      "May twenty-one be the year everything starts to click.",
    ];
    this._wishCount = 0;
    this._submitted = false;
  }

  init() {
    // If birthday on load, unlock tabs immediately
    if (this.isBirthday()) this._unlockTabs();

    // Bind submit — elements exist in DOM always, just section is hidden
    const btn   = this.el('wishSubmitBtn');
    const input = this.el('wishInput');
    if (btn)   btn.addEventListener('click',   () => this._onSubmit());
    if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') this._onSubmit(); });
  }

  _unlockTabs() {
    const tabs = [
      { tab: 'memories', label: 'Memory Wall' },
      { tab: 'games',    label: 'Mini Games'  },
      { tab: 'wishes',   label: 'Make a Wish' },
    ];
    const nav = document.getElementById('navTabs');
    if (!nav) return;
    tabs.forEach(({ tab, label }) => {
      if (document.querySelector(`.nav-tab[data-tab="${tab}"]`)) return;
      const btn = document.createElement('button');
      btn.className = 'nav-tab';
      btn.setAttribute('data-tab', tab);
      btn.textContent = label;
      nav.appendChild(btn);
      btn.addEventListener('click', () => window._switchTab(tab, btn));
    });
  }

  _onSubmit() {
    if (this._submitted) return;
    const val = this.el('wishInput').value.trim();
    if (!val) {
      this.el('wishInput').style.borderBottomColor = '#d4607a';
      setTimeout(() => this.el('wishInput').style.borderBottomColor = '', 800);
      return;
    }
    this._submitted = true;
    this._animateSubmit(val);
  }

  _animateSubmit(wish) {
    this.el('wishInput').disabled = true;
    this.el('wishSubmitBtn').disabled = true;

    const orb = this.el('wishOrb');
    orb.classList.add('lit');
    orb.textContent = '🔥';

    setTimeout(() => {
      this.el('wishResult').innerHTML = `
        <div class="wish-analysis">
          <div class="wish-analysis-icon">✨</div>
          <div class="wish-analysis-title">Your Wish Request is Being Analysed</div>
          <div class="wish-analysis-sub">:)</div>
          <div class="wish-analysis-detail">I wish for "${wish}"</div>
        </div>`;
      this.el('wishResult').style.opacity = '0';
      this.el('wishResult').style.display = 'block';
      requestAnimationFrame(() => {
        this.el('wishResult').style.transition = 'opacity 0.6s ease';
        this.el('wishResult').style.opacity = '1';
      });
    }, 800);

    setTimeout(() => {
      const randomWish = this._wishes[this._wishCount % this._wishes.length];
      this._wishCount++;
      const extra = document.createElement('div');
      extra.className = 'wish-extra';
      extra.textContent = `"${randomWish}"`;
      this.el('wishResult').appendChild(extra);

      setTimeout(() => {
        this._submitted = false;
        this.el('wishInput').disabled = false;
        this.el('wishInput').value = '';
        this.el('wishSubmitBtn').disabled = false;
        this.el('wishSubmitBtn').textContent = 'Wish again ✨';
        orb.textContent = '🕯️';
        orb.classList.remove('lit');
      }, 3000);
    }, 3200);
  }
}
