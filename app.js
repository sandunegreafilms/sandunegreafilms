(function () {
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  var YOUTUBE_PLACEHOLDER = "https://youtube.com/watch?v=REPLACE_ME";
  var PORTFOLIO_INDEX = [
    { title: "Tokyo drifter", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "Kandi kids", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "Emiko Shibamura", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "The monsters in my pocket", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "Stefan + Christy", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "FOOLISH ENDEAVOR", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "VOGUE BRASIL", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "Newberry park", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "UNDERWORLD - DARK & LONG", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "THE HOUSE INVICTUS", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "STROBE ENCOUNTER", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "LINDSEY STERLING", youtubeUrl: YOUTUBE_PLACEHOLDER },
    { title: "MINISTRY OF TOMORROW", youtubeUrl: YOUTUBE_PLACEHOLDER }
  ];

  var list = document.getElementById("portfolio-index-list");
  if (list) renderIndex(list);

  function renderIndex(root) {
    root.innerHTML = "";
    for (var i = 0; i < PORTFOLIO_INDEX.length; i++) {
      var item = PORTFOLIO_INDEX[i];
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = item.youtubeUrl || YOUTUBE_PLACEHOLDER;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = item.title;
      li.appendChild(a);
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
        v.muted = !soundEnabled;
        v.volume = 0.9;
        if (soundEnabled) {
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
    unlockBgAudioFromGesture();
  });
})();
