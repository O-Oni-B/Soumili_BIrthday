/**
 * MiniGameConfig — single source of truth for all mini game difficulty settings.
 * Edit values here to tune difficulty. Each game reads its config from this object.
 *
 * NOOB-FRIENDLY defaults:
 *   - Slow speeds, wide gaps, many lives, big hitboxes forgiveness
 */
const GAME_CONFIG = {

  breakout: {
    canvasW:         680,
    canvasH:         400,
    lives:           5,          // more lives = more forgiving
    ballSpeed:       2.8,        // slow starting ball
    ballMaxSpeed:    6,          // low speed cap
    ballRadius:      8,          // bigger ball = easier to track
    paddleWidth:     140,        // wide paddle = much easier
    paddleHeight:    14,
    paddleMoveSpeed: 8,
    rows:            4,          // fewer rows = less to clear
    cols:            8,
    brickW:          74,
    brickH:          20,
    brickPad:        4,
    brickOffsetX:    12,
    brickOffsetY:    40,
    pointsPerBrick:  10,
    colors:  ['#b05070','#c9a84c','#7ab8d4','#a78bfa','#5db88a'],
    labels:  ['🖤','✨','🎂','🎵','🎈'],
  },

  snake: {
    canvasW:    400,
    canvasH:    400,
    gridSize:   24,         // larger cells = fewer cells = easier to navigate
    startSpeed: 220,        // slow start (higher ms = slower)
    speedUp:    2,          // very gradual speed increase
    minSpeed:   90,         // never gets too fast
    foods: ['🌸','🌺','🌷','💐','🎀'],
  },

  spaceshooter: {
    canvasW:          680,
    canvasH:          520,
    playerSpeed:      5,
    bulletSpeed:      9,
    bulletW:          6,    // wider bullet = easier to hit
    bulletH:          14,
    shootCooldown:    200,  // faster shooting
    enemyStartSpeed:  0.8,  // very slow to start
    enemySpeedIncr:   0.02, // barely speeds up
    enemyMaxSpeed:    3.5,  // never gets scary fast
    spawnInterval:    2000, // 2 seconds between spawns
    spawnDecrement:   8,    // very slow spawn acceleration
    minSpawnInterval: 600,  // never spawns too fast
    lives:            5,
    enemyEmojis: ['👾','🤖','👻','💀','🎃','🦠','🛸'],
    enemySizeMin: 28,
    enemySizeMax: 52,
    pointsPerKill: 10,
    // Explosion animation
    explosionDuration: 40, // frames
    explosionMaxScale: 2.5,
  },

  flappy: {
    canvasW:      400,
    canvasH:      500,
    gravity:      0.18,     // lighter gravity = floatier = easier
    flapForce:    -5.5,     // gentle flap
    birdRadius:   14,
    pipeWidth:    55,
    gapMin:       170,      // wide gap minimum
    gapMax:       220,      // even wider max
    scrollSpeed:  1.8,      // slow scroll
    pipeInterval: 110,      // more time between pipes
  },

  dino: {
    canvasW:          600,
    canvasH:          200,
    gravity:          0.45,
    jumpForce:        -11,
    groundY:          148,
    startSpeed:       3,    // slow start
    speedIncrease:    0.0005, // very gradual
    obstacleInterval: [80, 150], // more space between obstacles
    hitboxInset:      6,    // more forgiving hitbox inset
  },

};
