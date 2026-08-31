/* ----------------------------------------------------------------------
   POURHOUSE - SITE CONFIG
   This is the ONLY file you need to edit when things go live.
   Everything else on the site reads from here.
   ---------------------------------------------------------------------- */

window.POURHOUSE = {

  /* ----------------------------------------------------------------------
     1. STEAM
     While steamUrl is null, every wishlist button reads "GET ON THE LIST"
     and sends people to the mailing list instead.

     WHEN THE STORE PAGE GOES LIVE:
       set steamUrl to the full URL, e.g.
       steamUrl: "https://store.steampowered.com/app/1234567/Pourhouse/"
     ...and every button turns gold and live automatically. Nothing else
     needs to change.
     ---------------------------------------------------------------------- */
  steamUrl: null,

  /* Shown under the hero. Keep it vague until a date is locked. */
  releaseWindow: "Coming soon to Steam",


  /* ----------------------------------------------------------------------
     2. EMAIL SIGNUP (Kit / ConvertKit, free to 10,000 subscribers)
     In Kit: Grow > Landing Pages & Forms > New > Form > pick any style.
     Then open the form's Embed > HTML tab and copy the <form action="...">
     URL. It looks like:
       https://app.kit.com/forms/1234567/subscriptions

     Paste that URL below. Until it is set, the form politely tells the
     visitor signups are not open yet instead of silently failing.

     IMPORTANT: when you create the form, TURN ON DOUBLE OPT-IN in Kit's form
     settings. This site is static, so the anti-bot checks in main.js can be
     bypassed by posting straight at the Kit endpoint. Double opt-in is what
     actually keeps junk off the list: an address that never confirms never
     subscribes. Enable Kit's spam protection as well.
     ---------------------------------------------------------------------- */
  kitFormAction: null,


  /* ----------------------------------------------------------------------
     3. LINKS. Add a URL as each account is created. Any left null is
        hidden from the footer automatically, so no dead links ever ship.
     ---------------------------------------------------------------------- */
  links: {
    discord: null,
    twitter: null,
    youtube: null,
    twitch:  null,
    itch:    null,
    press:   "press.html"
  },

  /* Press / business contact. Shown on the press page. */
  contactEmail: null,


  /* ----------------------------------------------------------------------
     4. TRAILER
     Once the trailer is cut, set type to "file" and point src at the mp4
     in assets/video/ (create the folder), or set type to "youtube" and use the ID
     in src. Until then the section shows a styled "in production" frame.
     ---------------------------------------------------------------------- */
  trailer: {
    type: null,       /* "file" | "youtube" | null */
    src:  null,       /* "assets/video/pourhouse-teaser.mp4"  or  "dQw4w9WgXcQ" */
    poster: "assets/img/screens/rush.webp"
  }
};
