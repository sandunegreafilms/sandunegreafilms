(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var YOUTUBE_PLACEHOLDER = "https://youtube.com/watch?v=REPLACE_ME";
  var PORTFOLIO_INDEX = [
    // Keep the intentional "importance" order; only update specific titles/links.
    { title: "Tokyo drifter", youtubeUrl: null },
    { title: "Kandi kids", youtubeUrl: null },
    { title: "Akindo Fighter", youtubeUrl: null },
    { title: "Full Video", youtubeUrl: "https://youtu.be/sR9t_3WmNp8?si=Y3YVXfE4pOKPs-Sl" },
    { title: "The monsters in my pocket", youtubeUrl: null },
    { title: "Stefan + Christy", youtubeUrl: null },
    { title: "FOOLISH ENDEAVOR", youtubeUrl: null },
    { title: "VOGUE BRASIL", youtubeUrl: null },
    { title: "Newberry Park", youtubeUrl: "https://youtu.be/xNu2ziw02UM?si=oKVF3TQDlytuOpeI" },
    { title: "UNDERWORLD - DARK & LONG", youtubeUrl: null },
    { title: "House of the Unholy", youtubeUrl: "https://youtu.be/Jh4Il03rOxI?si=Os0ZG6oRowY_P4p6" },
    { title: "STROBE", youtubeUrl: null },
    { title: "Encounter", youtubeUrl: null },
    { title: "PTSD", youtubeUrl: "https://youtu.be/Uzm4RfBRWxU?si=K83TewlxlMmHkKh8" },
    { title: "Stampede", youtubeUrl: "https://youtu.be/-9rdDeWzvsU?si=QhY2mn2CBpzmytoS" },
    { title: "MINISTRY OF TOMORROW", youtubeUrl: null },

    // New additions can tag onto the bottom.
    { title: "Haley Reinhart", youtubeUrl: "https://youtu.be/sADOjoNux9o?si=4QASJApWCw8qPzMX" },
    { title: "Running Man", youtubeUrl: "https://youtu.be/svGCiJLHCg0?si=H1HaqcnvJBKpsZyb" },
    { title: "Promo", youtubeUrl: "https://youtu.be/B06kd5M8ddM?si=3RoK2i2ZQ4zkQe9L" }
  ];

  var list = document.getElementById("portfolio-index-list");
  if (list) renderIndex(list);

  function renderIndex(root) {
    root.innerHTML = "";
    for (var i = 0; i < PORTFOLIO_INDEX.length; i++) {
      var item = PORTFOLIO_INDEX[i];
      var li = document.createElement("li");
      if (item.youtubeUrl) {
        var a = document.createElement("a");
        a.href = item.youtubeUrl || YOUTUBE_PLACEHOLDER;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = item.title;
        li.appendChild(a);
      } else {
        var span = document.createElement("span");
        span.textContent = item.title;
        li.appendChild(span);
      }
      root.appendChild(li);
    }
  }

  var SECTION_IDS = ["home", "info", "portfolio"];
  var sections = SECTION_IDS.map(function (id) {
    return document.getElementById(id);
  });
  var videos = Array.prototype.slice.call(
    document.querySelectorAll(".bg-stack__video[data-bg-video]")
  );
  var stack = document.querySelector(".bg-stack");
  var chromeHeader = document.querySelector(".chrome");

  function primarySectionIndex() {
    var w = sectionWeights();
    var maxI = 0;
    for (var i = 1; i < w.length; i++) {
      if (w[i] > w[maxI]) maxI = i;
    }
    return maxI;
  }

  function updateChromeNav() {
    if (!chromeHeader) return;
    var idx = primarySectionIndex();
    if (idx === 0) {
      chromeHeader.classList.add("chrome--on-home");
    } else {
      chromeHeader.classList.remove("chrome--on-home");
    }
  }

  function sectionWeights() {
    var vh = window.innerHeight || 1;
    var w = [];
    var sum = 0;
    var i;
    for (i = 0; i < sections.length; i++) {
      var sec = sections[i];
      if (!sec) {
        w[i] = 0;
        continue;
      }
      var r = sec.getBoundingClientRect();
      var vis = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
      w[i] = vis / vh;
      sum += w[i];
    }
    if (sum < 0.0001) sum = 1;
    for (i = 0; i < w.length; i++) {
      w[i] = w[i] / sum;
    }
    return w;
  }

  function updateBgOpacity() {
    var w = sectionWeights();
    for (var i = 0; i < videos.length; i++) {
      if (!videos[i]) continue;
      var o = Math.min(1, Math.max(0, w[i]));
      videos[i].style.opacity = String(o);
    }
  }

  var soundBtn = document.querySelector("[data-sound-toggle]");
  var soundEnabled = true;
  var audioUnlocked = false;

  function setSoundUi() {
    if (!soundBtn) return;
    soundBtn.textContent = soundEnabled ? "Sound: On" : "Sound: Off";
    soundBtn.setAttribute("aria-pressed", soundEnabled ? "true" : "false");
  }

  /** Home clip (first video) is the only audio source; info/portfolio stay muted but still crossfade visually. */
  function applyAudioState() {
    if (!videos.length) return;
    var i;
    for (i = 0; i < videos.length; i++) {
      var v = videos[i];
      if (i === 0) {
        var shouldHear = soundEnabled && audioUnlocked;
        v.muted = !shouldHear;
        v.volume = 0.9;
        if (shouldHear) {
          try {
            v.play();
          } catch (_e) {}
        }
      } else {
        v.muted = true;
        v.volume = 0.9;
      }
    }
  }

  function tryPlayAll() {
    for (var i = 0; i < videos.length; i++) {
      try {
        videos[i].play();
      } catch (_e) {}
    }
  }

  var rafScheduled = false;
  function onScrollResize() {
    updateBgOpacity();
    updateChromeNav();
    applyAudioState();
  }

  function scheduleUpdate() {
    if (rafScheduled) return;
    rafScheduled = true;
    requestAnimationFrame(function () {
      rafScheduled = false;
      onScrollResize();
    });
  }

  if (stack && videos.length) {
    updateBgOpacity();
    requestAnimationFrame(function () {
      updateBgOpacity();
      stack.classList.add("bg-stack--live");
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener("click", function () {
      soundEnabled = !soundEnabled;
      audioUnlocked = true;
      setSoundUi();
      tryPlayAll();
      applyAudioState();
    });
  }

  setSoundUi();
  tryPlayAll();
  updateChromeNav();
  applyAudioState();

  /* Browsers block unmuted autoplay until a gesture; first tap/scroll path re-applies audio. */
  function unlockBgAudioFromGesture() {
    audioUnlocked = true;
    tryPlayAll();
    applyAudioState();
  }
  document.addEventListener(
    "pointerdown",
    function onFirstPointer() {
      document.removeEventListener("pointerdown", onFirstPointer, true);
      unlockBgAudioFromGesture();
    },
    true
  );

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("hashchange", scheduleUpdate);
  window.addEventListener("load", function () {
    scheduleUpdate();
    applyAudioState();
  });
})();
