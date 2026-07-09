# 🖤 Soumili's 21st Birthday Website

A Deftones-aesthetic birthday website with countdown, memory wall, mini games, and a wish feature.

---

## 📁 File Structure

```
birthday-site/
│
├── index.html          ← open this in a browser
├── style.css           ← all styling / design tokens
├── README.md           ← this file
│
└── js/
    ├── BirthdayApp.js  ← BASE CLASS — shared config, debug flag, utilities
    ├── Countdown.js    ← sub-class — live countdown + birthday reveal
    ├── Memory.js       ← sub-class — memory/message wall
    ├── MiniGames.js    ← sub-class — cake builder, trivia, breakout game
    └── MakeAWish.js    ← sub-class — wish input + candle animation
```

---

## 🚀 How to Run It

### Option 1 — Just open it (simplest)
> ⚠️ This won't work by double-clicking because browsers block local JS file imports for security.
> Use one of the options below instead.

### Option 2 — VS Code Live Server (recommended)
1. Download and install [VS Code](https://code.visualstudio.com/)
2. Open VS Code, go to **Extensions** (Ctrl+Shift+X), search **Live Server**, install it
3. Open the `birthday-site/` folder in VS Code
4. Right-click `index.html` → **Open with Live Server**
5. It opens at `http://127.0.0.1:5500` in your browser ✅

### Option 3 — Python (if you have Python installed)
1. Open Terminal / Command Prompt
2. `cd` into the `birthday-site/` folder:
   ```bash
   cd path/to/birthday-site
   ```
3. Run:
   ```bash
   # Python 3
   python -m http.server 8080
   ```
4. Open your browser and go to `http://localhost:8080` ✅

### Option 4 — Put it online (share a link)
1. Go to [netlify.com/drop](https://app.netlify.com/drop)
2. Drag the entire `birthday-site/` folder onto the page
3. Netlify gives you a public URL you can send to anyone 🎉

---

## 🔧 Debug Mode

To preview what the site looks like **exactly at midnight on July 14th** (the birthday reveal screen):

1. Open `js/BirthdayApp.js`
2. Find this line near the top:
   ```js
   this.DEBUG_BIRTHDAY_MODE = false;
   ```
3. Change it to:
   ```js
   this.DEBUG_BIRTHDAY_MODE = true;
   ```
4. Save and refresh the browser

The countdown will disappear and the full **"Happy 21st Birthday Soumili!!!"** reveal will show.

Set it back to `false` before sharing with her!

---

## 🎨 Customisation

All key settings live in `js/BirthdayApp.js` (the base class):

| Property | What it controls |
|---|---|
| `DEBUG_BIRTHDAY_MODE` | Toggle birthday reveal preview |
| `BIRTHDAY_NAME` | The name shown on the reveal screen |
| `BIRTHDAY_AGE` | The age shown (21) |
| `TARGET_UTC` | The exact moment the countdown targets |
| `COLORS` | Shared colour palette used across all modules |

Because every sub-class extends `BirthdayApp`, any change you make in `BirthdayApp.js` is automatically picked up everywhere.

---

## 🖼️ Adding Assets Later

The `assets/` folder is ready for images, audio, or fonts:

```
birthday-site/
└── assets/
    ├── images/     ← add photos here
    ├── audio/      ← add music here (e.g. a Deftones clip)
    └── fonts/      ← add custom fonts here
```

To use a photo in the Memory Wall for example, reference it in `Memory.js`:
```js
// example
this._messages.push({ text: 'Happy birthday!', from: 'Mum', img: 'assets/images/photo1.jpg' });
```

---

## 📦 Class Hierarchy

```
BirthdayApp         ← base (config, debug, shared utils)
├── Countdown       ← timer + birthday reveal animation
├── Memory          ← message wall
├── MiniGames       ← cake, trivia, breakout
└── MakeAWish       ← wish input + candle glow
```

---

made with 🖤 for soumili's 21st
