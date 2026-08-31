# Pourhouse website and press kit

The pre-launch site for **Pourhouse**, a game by Bruno Franchini.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.
Edit a file, commit, and GitHub Pages publishes it.

---

## The only file you need to edit

Everything that changes as the game gets closer to launch lives in **`js/config.js`**.
Nothing else needs touching.

| Setting | What it does |
|---|---|
| `steamUrl` | While this is `null`, every wishlist button reads "Get on the list" and sends people to the mailing list instead. Paste the real store URL and every button becomes a live gold Steam link on its own. |
| `releaseWindow` | The small line under the hero. Currently "Coming soon to Steam". |
| `kitFormAction` | The Kit (ConvertKit) form endpoint. Until it is set, the signup form says "Signups open soon" rather than failing silently. |
| `links` | Discord, X, YouTube, Twitch, itch. Any left as `null` is left out of the footer, so a dead link can never ship. |
| `contactEmail` | Press contact on the press page. Hidden until set. |
| `trailer` | Set `type` to `"file"` or `"youtube"` and `src` to the path or video ID to replace the "trailer in production" placeholder. |

---

## Running it locally

Any static file server works. From the repository root:

```bash
python -m http.server 4173
```

Then open <http://127.0.0.1:4173/>. Opening `index.html` directly from disk will
not work properly, because the pages fetch `config.js` and the browser blocks that
over `file://`.

If a change does not appear, hard-refresh with Ctrl-F5. GitHub Pages sends
`Cache-Control: max-age=600`, so a published change can also take up to ten
minutes to reach someone who visited recently. It corrects itself.

---

## File structure

```
index.html          the main page
press.html          press kit: fact sheet, boilerplate copy, downloads
css/style.css       all styling; the brand palette is defined as CSS
                    variables at the top of this file
js/config.js        settings, see above
js/main.js          behaviour: parallax, reveals, lightbox, signup form
assets/img/         hero art at four widths, logo, icon, social preview
assets/img/screens/ screenshots, full size and thumbnails
assets/press/       downloadable zips offered on the press page
```

Images are WebP. The hero is supplied at four widths and the browser picks one, so
the page stays fast on a phone.

Colour values were sampled from the game art rather than estimated. They live at the
top of `css/style.css` as two groups: the illustrated marketing palette, and the
in-game UI palette used for buttons and panels so the site matches the product.

---

## Mailing list

The signup form posts to Kit. It carries a honeypot field, a timing check, a send
cooldown and address validation, which stops ordinary form-spam bots.

**None of that is authoritative.** This is a static site, so there is no server of
ours in the path and a determined bot can post straight at the Kit endpoint. The
real protection is **double opt-in, which must be switched on in Kit's form
settings**. An address that never confirms never joins the list. Turn on Kit's spam
protection at the same time.

---

## Deployment

GitHub Pages serves this repository from the `main` branch, root folder. Pushing to
`main` publishes. There is no build step to wait on.

The custom domain is configured under **Settings > Pages**, and DNS is managed
separately at the registrar. Once the domain is attached, GitHub provisions a
certificate for it. That is often quick but can take up to 24 hours on a domain
whose DNS was only recently set up, and the site stays reachable over plain http
in the meantime. **Enforce HTTPS** cannot be enabled until the certificate exists,
so a greyed-out checkbox means it is still provisioning.

---

## Credits

Game, art and code: **Bruno Franchini**.

Pourhouse and the Pourhouse logo are trademarks of Bruno Franchini.
