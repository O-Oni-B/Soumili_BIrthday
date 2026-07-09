/**
 * MiniGames — router only.
 * All question banks are here — GameTrivia picks 10 randomly each round.
 */
class MiniGames extends BirthdayApp {
  constructor() {
    super();
    this._current = null;

    // ── Deftones — 25 questions in the bank ──────────────────────────────────
    const deftonesQ = [
      { q:"What year was the Deftones' self-titled album released?",          opts:["2000","2003","2006","2009"], a:1 },
      { q:"Which album contains 'Change (In the House of Flies)'?",           opts:["Adrenaline","Around the Fur","White Pony","Diamond Eyes"], a:2 },
      { q:"What city are the Deftones from?",                                 opts:["Los Angeles","San Diego","Sacramento","San Francisco"], a:2 },
      { q:"'Ohms' was released in which year?",                               opts:["2016","2018","2020","2022"], a:2 },
      { q:"Who is the lead vocalist of Deftones?",                            opts:["Abe Cunningham","Frank Delgado","Chi Cheng","Chino Moreno"], a:3 },
      { q:"What was the Deftones' debut album?",                              opts:["White Pony","Adrenaline","Around the Fur","Saturday Night Wrist"], a:1 },
      { q:"Which Deftones song features Maynard James Keenan?",              opts:["Digital Bath","Passenger","Knife Party","Minerva"], a:1 },
      { q:"What instrument does Abe Cunningham play?",                        opts:["Bass","Guitar","Drums","Keys"], a:2 },
      { q:"'Diamond Eyes' was released in which year?",                       opts:["2008","2010","2012","2014"], a:1 },
      { q:"Which album is 'Be Quiet and Drive' on?",                          opts:["Adrenaline","Around the Fur","White Pony","Saturday Night Wrist"], a:1 },
      { q:"Who plays bass for Deftones?",                                     opts:["Frank Delgado","Chino Moreno","Sergio Vega","Abe Cunningham"], a:2 },
      { q:"What genre is most associated with Deftones?",                     opts:["Death metal","Nu-metal / alternative metal","Pop punk","Indie rock"], a:1 },
      { q:"Which album contains 'Minerva'?",                                  opts:["White Pony","Deftones","Diamond Eyes","Koi No Yokan"], a:1 },
      { q:"'Koi No Yokan' was released in which year?",                       opts:["2010","2012","2014","2016"], a:1 },
      { q:"What does 'Koi No Yokan' roughly mean in Japanese?",              opts:["Love at first sight","Premonition of love","Falling forever","Silent storm"], a:1 },
      { q:"Which song opens the album White Pony?",                           opts:["Digital Bath","Feiticeira","Back to School","Change"], a:1 },
      { q:"Chino Moreno has a side project called?",                          opts:["Team Sleep","Crosses","††† (Crosses)","All of these"], a:3 },
      { q:"What year did Deftones form?",                                     opts:["1988","1990","1993","1995"], a:0 },
      { q:"Which song has the lyric 'I'll dress you up in red'?",             opts:["Minerva","Digital Bath","Be Quiet and Drive","Change"], a:1 },
      { q:"Frank Delgado primarily plays what in Deftones?",                  opts:["Guitar","Turntables and keyboards","Bass","Drums"], a:1 },
      { q:"Which album was made during Chi Cheng's hospitalisation?",         opts:["Koi No Yokan","Diamond Eyes","Ohms","Saturday Night Wrist"], a:1 },
      { q:"'Around the Fur' was released in which year?",                     opts:["1995","1997","1999","2001"], a:1 },
      { q:"Which label did Deftones originally sign to?",                     opts:["Atlantic","Maverick","Roadrunner","Reprise"], a:1 },
      { q:"Which Deftones album has a white horse on the cover?",             opts:["Ohms","Diamond Eyes","White Pony","Adrenaline"], a:2 },
      { q:"What is the opening track on 'Adrenaline'?",                       opts:["7 Words","Bored","Nosebleed","Root"], a:0 },
    ];

    // ── Eternal Sunshine — 20 questions ──────────────────────────────────────
    const esQ = [
      { q:"What procedure does Joel undergo in the film?",                              opts:["Brain surgery","Memory erasure","Hypnotherapy","Shock therapy"], a:1 },
      { q:"What company performs the memory erasure?",                                  opts:["Neurovolt","MindWipe Inc","Lacuna Inc","Oblivion Corp"], a:2 },
      { q:"What is the name of Joel's ex-girlfriend?",                                  opts:["Clementine","Mary","Naomi","Sophie"], a:0 },
      { q:"What colour is Clementine's hair when Joel first meets her on the train?",   opts:["Blue","Red","Orange","Green"], a:2 },
      { q:"Who directed Eternal Sunshine of the Spotless Mind?",                        opts:["Wes Anderson","Charlie Kaufman","Michel Gondry","Spike Jonze"], a:2 },
      { q:"Who wrote the screenplay?",                                                  opts:["Michel Gondry","Spike Jonze","Charlie Kaufman","Jim Carrey"], a:2 },
      { q:"Who plays Clementine?",                                                      opts:["Kirsten Dunst","Kate Winslet","Cate Blanchett","Natalie Portman"], a:1 },
      { q:"Who plays Joel?",                                                            opts:["Jim Carrey","Tom Hanks","Ryan Gosling","Edward Norton"], a:0 },
      { q:"What year was the film released?",                                           opts:["2001","2002","2004","2006"], a:2 },
      { q:"What does the title reference?",                                             opts:["A Shakespeare sonnet","An Alexander Pope poem","A Keats ode","A Blake painting"], a:1 },
      { q:"What is the name of the receptionist at Lacuna who has feelings for Joel?",  opts:["Mary","Clementine","Naomi","Carrie"], a:0 },
      { q:"Who plays the Lacuna technician Patrick?",                                   opts:["Mark Ruffalo","Elijah Wood","Thomas Haden Church","Paul Dano"], a:1 },
      { q:"Where do Joel and Clementine first meet (in their constructed memory)?",     opts:["A bar","Montauk beach","A library","A bookshop"], a:1 },
      { q:"Who plays Dr Howard Mierzwiak?",                                             opts:["Tom Wilkinson","Jeff Bridges","Harrison Ford","Anthony Hopkins"], a:0 },
      { q:"What award did the film win at the Oscars?",                                 opts:["Best Picture","Best Director","Best Original Screenplay","Best Editing"], a:2 },
      { q:"Clementine works at which store?",                                           opts:["Borders","Barnes & Noble","Walgreens","Henrix Books"], a:0 },
      { q:"What does Joel clutch as his memories are erased?",                          opts:["A photo","Clementine's journal","A map to Montauk","Her orange sweatshirt"], a:3 },
      { q:"The film's non-linear structure moves in which direction through time?",      opts:["Forward then backward","Backward through Joel's memories","Randomly","Parallel timelines"], a:1 },
      { q:"What does Clementine call Joel as a term of affection?",                     opts:["Joey","Jules","Joely","J"], a:2 },
      { q:"Where does the film ultimately end — at the start or end of the story?",     opts:["The end — they part ways","The beginning — they choose each other again","The middle — during erasure","Neither — it is ambiguous"], a:1 },
    ];

    // ── Brooklyn 99 — 25 questions ────────────────────────────────────────────
    const b99Q = [
      { q:"What is Jake Peralta's catchphrase?",                              opts:["Cool cool cool","Nine nine!","Title of your sex tape","Noice"], a:0 },
      { q:"What precinct does the show take place in?",                       opts:["77th","99th","42nd","Brooklyn South"], a:1 },
      { q:"What is Captain Holt's dog's name?",                              opts:["Sherlock","Cheddar","Biscuit","Watson"], a:1 },
      { q:"What is Gina Linetti's job at the precinct?",                     opts:["Detective","Forensics","Administrative assistant","IT specialist"], a:2 },
      { q:"Which character is obsessed with the Pontiac Bandit?",            opts:["Rosa","Charles","Jake","Terry"], a:2 },
      { q:"What does Amy Santiago love collecting?",                         opts:["Stickers","Binders","Stamps","Certificates"], a:1 },
      { q:"What is Terry Jeffords' obsession?",                              opts:["Cats","Yoghurt","Coffee","Weights"], a:1 },
      { q:"Who is Jake Peralta's childhood best friend?",                    opts:["Charles Boyle","Gina Linetti","Raymond Holt","Amy Santiago"], a:1 },
      { q:"Rosa Diaz is known for being?",                                   opts:["Cheerful and bubbly","Mysterious and intimidating","Clumsy and sweet","Loud and sarcastic"], a:1 },
      { q:"What is the name of the recurring criminal played by Craig Robinson?", opts:["The Pontiac Bandit","The Disco Strangler","The Fulcrum","Doug Judy"], a:3 },
      { q:"Captain Holt is married to whom?",                                opts:["Marcus","Kevin","David","Patrick"], a:1 },
      { q:"What does 'Nine-Nine!' refer to?",                                opts:["The precinct number","Jake's badge number","A celebration chant","A criminal code"], a:2 },
      { q:"Which character leaves the show to join Beyoncé's dance team?",   opts:["Amy","Rosa","Gina","Scully"], a:2 },
      { q:"What is Charles Boyle's defining passion besides police work?",   opts:["Wine","Food","Art","Theatre"], a:1 },
      { q:"What is the name of Holt and Kevin's dog?",                       opts:["Sherlock","Watson","Cheddar","Biscuit"], a:2 },
      { q:"Jake and Amy get married in which season?",                       opts:["Season 4","Season 5","Season 6","Season 7"], a:1 },
      { q:"Scully and Hitchcock are known for being?",                       opts:["The best detectives","Lazy and incompetent","Overly competitive","Tech geniuses"], a:1 },
      { q:"Who takes over as captain when Holt leaves?",                     opts:["Jake","Amy","Wuntch","CJ"], a:3 },
      { q:"What is Jake's favourite movie?",                                 opts:["Die Hard","Lethal Weapon","Speed","Point Break"], a:0 },
      { q:"Rosa Diaz comes out as what in season 5?",                        opts:["Gay","Bisexual","Pansexual","Non-binary"], a:1 },
      { q:"What is Amy's competitive weakness?",                             opts:["She can't lose a bet","She hates losing at anything","She always cheats","She cries when she wins"], a:1 },
      { q:"Who voices the phone in the Halloween heist episodes?",           opts:["Andy Samberg","Chelsea Peretti","Stephanie Beatriz","Melissa Fumero"], a:1 },
      { q:"What nickname does Jake give to the annual Halloween heist?",     opts:["The Big One","The Heistmas","The Halloween Heist","Jake's Game"], a:2 },
      { q:"Which character has a secret soft side revealed through knitting?", opts:["Rosa","Holt","Hitchcock","Scully"], a:0 },
      { q:"What does Holt say instead of expressing emotion?",               opts:["Nothing at all","'Bingpot!'","'Interesting'","A single slow blink"], a:1 },
    ];

    this._games = {
      trivia: new GameTrivia(deftonesQ, {
        gameKey:'deftones', title:'Deftones Trivia',
        winMsg:'🖤 True Deftones fan!', okMsg:'Not bad — keep listening!',
        loseMsg:'Revisit the discography 😄', winAt:8,
      }),

      estrivia: new GameTrivia(esQ, {
        gameKey:'eternalSunshine', title:'Eternal Sunshine',
        winMsg:'☀️ You know this film by heart!', okMsg:'Not bad — watch it again 🎬',
        loseMsg:'Time for a rewatch 😄', winAt:8,
      }),

      b99trivia: new GameTrivia(b99Q, {
        gameKey:'brooklyn99', title:'Brooklyn 99 Trivia',
        winMsg:'🚔 Nine Nine! Perfect!', okMsg:'Not bad, detective!',
        loseMsg:'Back to the academy 😄', winAt:8,
      }),

      breakout:     new GameBreakout(),
      snake:        new GameSnake(),
      spaceshooter: new GameSpaceShooter(),
      flappy:       new GameFlappy(),
      dino:         new GameDino(),
    };
  }

  init() {
    const section = this.el('s-games');
    if (!section) return;
    section.addEventListener('click', e => {
      const card = e.target.closest('.game-card');
      if (!card) return;
      this.$$('.game-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const key  = card.getAttribute('data-game');
      const next = this._games[key];
      if (!next) return;
      if (this._current) { this._current.exit(); this._current = null; }
      this._current = next;
      this._current.enter(this.el('gameArea'));
    });
  }
}
