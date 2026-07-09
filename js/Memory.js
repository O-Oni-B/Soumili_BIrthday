/**
 * Memory — extends BirthdayApp
 * Memory wall replaced with photo collage — this class is now a no-op
 * but kept in the hierarchy so the load order doesn't break.
 */
class Memory extends BirthdayApp {
  constructor() {
    super();
  }

  init() {
    // No-op — collage is static HTML, lightbox handled in index.html
  }
}
