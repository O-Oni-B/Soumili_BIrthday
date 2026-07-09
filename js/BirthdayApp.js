/**
 * BirthdayApp — Base class
 * All shared config, debug flags, and utilities live here.
 * Sub-classes extend this and call super() to inherit.
 */
class BirthdayApp {
  constructor() {
    // ── DEBUG ────────────────────────────────────────────────────────────────
    // Flip to true to simulate midnight July 14 IST (birthday moment)
    this.DEBUG_BIRTHDAY_MODE = false;
    // ────────────────────────────────────────────────────────────────────────

    // ── Core config ──────────────────────────────────────────────────────────
    this.BIRTHDAY_NAME   = 'Soumili';
    this.BIRTHDAY_AGE    = 22;
    this.BIRTHDAY_DATE   = 'July 14, 2026';

    // Midnight July 14 2026 IST = July 13 2026 18:30:00 UTC
    this.TARGET_UTC = Date.UTC(2026, 6, 13, 18, 30, 0);
    this.START_UTC  = Date.UTC(2026, 0, 1, 0, 0, 0);

    // ── Design tokens (shared palette) ───────────────────────────────────────
    this.COLORS = {
      gold:     '#c9a84c',
      goldPale: '#e8d08a',
      rose:     '#b05070',
      ice:      '#7ab8d4',
      purple:   '#a78bfa',
      green:    '#5db88a',
      night:    '#0a090e',
      mist:     '#1e1b2e',
    };
  }

  /** Returns "now" — swapped for TARGET in debug mode */
  getNow() {
    return this.DEBUG_BIRTHDAY_MODE ? this.TARGET_UTC : Date.now();
  }

  /** True if birthday moment has arrived */
  isBirthday() {
    return this.getNow() >= this.TARGET_UTC;
  }

  /** Zero-pad a number to 2 digits */
  pad(n) {
    return String(n).padStart(2, '0');
  }

  /** Safe querySelector */
  $(selector) {
    return document.querySelector(selector);
  }

  /** Safe querySelectorAll */
  $$(selector) {
    return document.querySelectorAll(selector);
  }

  /** Safe getElementById */
  el(id) {
    return document.getElementById(id);
  }
}
