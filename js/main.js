/* ----------------------------------------------------------------------
   POURHOUSE - site behaviour
   Vanilla JS, no dependencies. Reads everything from js/config.js.
   ---------------------------------------------------------------------- */
(function () {
  "use strict";

  var CFG = window.POURHOUSE || {};
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     YEAR - keeps the footer copyright current on its own
     ---------------------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------------------
     RELEASE WINDOW - the line under the hero, driven by config
     ---------------------------------------------------------------------- */
  var rw = document.getElementById("releaseWindow");
  if (rw && CFG.releaseWindow) rw.textContent = CFG.releaseWindow;

  /* ----------------------------------------------------------------------
     WISHLIST BUTTONS - a real Steam link once config.steamUrl is set. Until
     then the same button points at the mailing list instead, so the page
     never ships a dead link to a store page that does not exist yet. It stays
     a genuine control the whole time, which is why it is not marked disabled.
     ---------------------------------------------------------------------- */
  var steamIcon =
    '<svg class="ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M11.98 2C6.53 2 2.06 6.15 1.55 11.46l5.62 2.32a3.03 3.03 0 0 1 1.72-.53l2.5-3.62v-.05c0-2.18 1.77-3.96 3.96-3.96s3.96 1.78 3.96 3.96a3.97 3.97 0 0 1-4.1 3.96l-3.56 2.54c0 .05.01.1.01.16 0 1.64-1.33 2.97-2.97 2.97-1.44 0-2.65-1.03-2.92-2.4L1.76 15.1C3.05 19.08 6.98 22 11.98 22c5.52 0 10-4.48 10-10s-4.48-10-10-10zm-4.7 15.17.83.34a2.23 2.23 0 0 0 2.9-1.2 2.23 2.23 0 0 0-2.32-3.07l.86.36a1.64 1.64 0 1 1-1.27 3.02l-1-.45zm10.7-8.42c0-1.45-1.18-2.64-2.64-2.64a2.64 2.64 0 0 0 0 5.28 2.64 2.64 0 0 0 2.64-2.64zm-4.62 0c0-1.1.89-1.98 1.98-1.98 1.1 0 1.99.89 1.99 1.98 0 1.1-.89 1.99-1.99 1.99a1.98 1.98 0 0 1-1.98-1.99z"/>' +
    "</svg>";

  Array.prototype.forEach.call(document.querySelectorAll(".js-wishlist"), function (btn) {
    var inNav = !!btn.closest(".nav");
    if (CFG.steamUrl) {
      btn.href = CFG.steamUrl;
      btn.target = "_blank";
      btn.rel = "noopener";
      btn.classList.remove("btn-pending");
      btn.innerHTML = steamIcon + "<span>" + (inNav ? "Wishlist" : "Wishlist on Steam") + "</span>";
    } else {
      btn.classList.add("btn-pending");
      btn.innerHTML = steamIcon + "<span>" + (inNav ? "Sign up" : "Get on the list") + "</span>";
      btn.addEventListener("click", function (e) {
        /* No store page yet: send them to the mailing list instead of nowhere. */
        e.preventDefault();
        var t = document.getElementById("signup");
        if (t) t.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
      });
    }
  });

  /* ----------------------------------------------------------------------
     FOOTER LINKS - only render the ones that actually exist
     ---------------------------------------------------------------------- */
  var footer = document.getElementById("footerLinks");
  if (footer) {
    var labels = {
      discord: "Discord", twitter: "X", youtube: "YouTube",
      twitch: "Twitch", itch: "itch.io", press: "Press kit"
    };
    var links = CFG.links || {};
    var html = "";
    Object.keys(labels).forEach(function (k) {
      if (links[k]) {
        var ext = /^https?:/i.test(links[k]) ? ' target="_blank" rel="noopener"' : "";
        html += '<a href="' + links[k] + '"' + ext + ">" + labels[k] + "</a>";
      }
    });
    if (CFG.steamUrl) html += '<a href="' + CFG.steamUrl + '" target="_blank" rel="noopener">Steam</a>';
    footer.innerHTML = html;
  }

  /* ----------------------------------------------------------------------
     STICKY NAV - drops in once the hero is mostly scrolled past
     ---------------------------------------------------------------------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > window.innerHeight * 0.7) nav.classList.add("on");
      else nav.classList.remove("on");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------------------
     HERO PARALLAX - HERO_SCALE must match the resting transform on
     .hero-bg in style.css. If the two differ, the background visibly
     jumps the moment the first scroll event lands.
     ---------------------------------------------------------------------- */
  var heroBg = document.getElementById("heroBg");
  if (heroBg && !reduced) {
    var HERO_SCALE = 1.04;
    var ticking = false;

    var paint = function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroBg.style.transform =
          "translate3d(0," + (y * 0.28).toFixed(2) + "px,0) scale(" + HERO_SCALE + ")";
      }
      ticking = false;
    };

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(paint);
    }, { passive: true });

    /* Paint once up front so a restored scroll position (refresh mid-page, or
       a deep link) starts correct instead of correcting itself on first scroll. */
    paint();
  }

  /* ----------------------------------------------------------------------
     REVEAL ON SCROLL - adds .in as each .rv element comes into view
     ---------------------------------------------------------------------- */
  var revealables = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    Array.prototype.forEach.call(revealables, function (el) { io.observe(el); });
  } else {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add("in"); });
  }

  /* ----------------------------------------------------------------------
     TRAILER - swaps the placeholder frame for a real player once
     config.trailer is filled in
     ---------------------------------------------------------------------- */
  var frame = document.getElementById("trailerFrame");
  var tr = CFG.trailer || {};
  if (frame && tr.type && tr.src) {
    if (tr.type === "file") {
      frame.innerHTML =
        '<video controls playsinline preload="metadata" poster="' + (tr.poster || "") + '">' +
        '<source src="' + tr.src + '" type="video/mp4">' +
        "Your browser cannot play this video." +
        "</video>";
    } else if (tr.type === "youtube") {
      frame.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' + tr.src + '" ' +
        'title="Pourhouse trailer" loading="lazy" allowfullscreen ' +
        'allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>';
    }
  }

  /* ----------------------------------------------------------------------
     LIGHTBOX - full-size screenshot viewer, keyboard accessible
     ---------------------------------------------------------------------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCap = document.getElementById("lbCap");
  var lbClose = document.getElementById("lbClose");
  var lastFocus = null;

  function openLb(full, cap, alt) {
    lastFocus = document.activeElement;
    lbImg.src = full;
    lbImg.alt = alt || "";
    lbCap.textContent = cap || "";
    lb.classList.add("on");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }
  function closeLb() {
    lb.classList.remove("on");
    lbImg.removeAttribute("src");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".shot"), function (fig) {
    fig.setAttribute("tabindex", "0");
    fig.setAttribute("role", "button");
    var img = fig.querySelector("img");
    var cap = fig.getAttribute("data-cap") || "";
    fig.setAttribute("aria-label", "View larger: " + cap);
    function go() { openLb(fig.getAttribute("data-full"), cap, img ? img.alt : ""); }
    fig.addEventListener("click", go);
    fig.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
    });
  });

  if (lb) {
    lbClose.addEventListener("click", closeLb);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lb.classList.contains("on")) closeLb();
    });
  }

  /* ----------------------------------------------------------------------
     SIGNUP - posts to Kit when config.kitFormAction is set, and says so
     politely rather than failing silently when it is not
     ---------------------------------------------------------------------- */
  var form = document.getElementById("signupForm");
  var msg = document.getElementById("formMsg");

  function say(text, kind) {
    if (!msg) return;
    msg.textContent = text;
    msg.className = "form-msg " + (kind || "");
  }

  /* ----------------------------------------------------------------------
     ABUSE CONTROLS - read this before trusting them.

     This is a static site on GitHub Pages. There is no server of ours in
     the path, so NOTHING below is authoritative: a determined bot can POST
     straight at the Kit endpoint and skip this file entirely. These checks
     exist to stop drive-by form-spam bots, which is most of them, and to
     keep junk off the mailing list. The real defence lives in Kit itself:

       Kit > the form > Settings > enable DOUBLE OPT-IN, and turn on their
       spam/bot protection. Double opt-in is the big one: an address that
       never confirms never lands on the list, whatever hit this form.

     Do not remove the honeypot or the time trap thinking Kit covers it;
     they work together.
     ---------------------------------------------------------------------- */
  var formLoadedAt = Date.now();
  var MIN_FILL_MS = 2500;   /* humans take longer than this to read and type */
  var COOLDOWN_MS = 5000;   /* throttle repeat sends from one visitor */
  var lastSentAt = 0;

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var emailField = form.querySelector('input[name="email_address"]');
      var email = emailField.value.trim();
      var trap = form.querySelector('input[name="website"]').value;
      var now = Date.now();

      /* 1. Honeypot: a hidden field only an automated filler would populate.
            Stay silent, because telling a bot why it failed just helps it adapt. */
      if (trap) return;

      /* 2. Time trap: submitted implausibly fast after page load. Also silent. */
      if (now - formLoadedAt < MIN_FILL_MS) return;

      /* 3. Cooldown: throttles repeat SENDS. Checked here, but armed further
            down only when we actually POST - a typo'd address must not lock
            someone out while they fix it. */
      if (now - lastSentAt < COOLDOWN_MS) {
        say("Hold on a moment before trying again.", "err");
        return;
      }

      /* 4. Length guard - RFC 5321 caps an address at 254 characters. */
      if (email.length > 254) {
        say("That email doesn't look right.", "err");
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        say("That email doesn't look right.", "err");
        return;
      }

      if (!CFG.kitFormAction) {
        /* Nothing leaves the browser in this state, so there is nothing to
           throttle - deliberately do NOT arm the cooldown here. */
        say("Signups open soon - check back shortly.", "err");
        return;
      }

      /* Armed only now, on the path that actually sends. */
      lastSentAt = now;

      var btn = form.querySelector('button[type="submit"]');
      var original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "Pouring...";
      say("", "");

      var data = new FormData();
      data.append("email_address", email);

      fetch(CFG.kitFormAction, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      })
        .then(function (r) { return r.ok ? r.json().catch(function () { return {}; }) : Promise.reject(r); })
        .then(function () {
          form.reset();
          say("You're on the list. See you at last call.", "ok");
        })
        .catch(function () {
          say("Something went wrong. Try again in a moment.", "err");
        })
        .finally(function () {
          btn.disabled = false;
          btn.innerHTML = original;
        });
    });
  }
})();
