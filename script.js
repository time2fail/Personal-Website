(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile nav ---- */
  var navToggle = document.getElementById("navToggle");
  var navList = document.getElementById("navList");
  if (navToggle && navList) {
    navToggle.addEventListener("click", function () {
      var open = navList.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navList.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navList.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---- Hero clustering animation ---- */
  var canvas = document.getElementById("clusterCanvas");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var W = canvas.width;
  var H = canvas.height;

  var colors = ["#1F4E79", "#B8873A", "#4C7A5E"];
  var clusters = [
    { x: W * 0.28, y: H * 0.32 },
    { x: W * 0.72, y: H * 0.30 },
    { x: W * 0.5, y: H * 0.75 }
  ];

  var POINT_COUNT = 42;
  var points = [];
  for (var i = 0; i < POINT_COUNT; i++) {
    var cluster = i % 3;
    var target = clusters[cluster];
    var angle = Math.random() * Math.PI * 2;
    var radius = 14 + Math.random() * 34;
    points.push({
      startX: Math.random() * W,
      startY: Math.random() * H,
      endX: target.x + Math.cos(angle) * radius,
      endY: target.y + Math.sin(angle) * radius,
      color: colors[cluster],
      r: 3 + Math.random() * 2.5
    });
  }

  function drawFrame(t) {
    ctx.clearRect(0, 0, W, H);
    points.forEach(function (p) {
      var x = p.startX + (p.endX - p.startX) * t;
      var y = p.startY + (p.endY - p.startY) * t;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  if (prefersReducedMotion) {
    drawFrame(1);
    return;
  }

  var duration = 1600;
  var startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var elapsed = timestamp - startTime;
    var t = Math.min(elapsed / duration, 1);
    drawFrame(easeOutCubic(t));
    if (t < 1) window.requestAnimationFrame(step);
  }

  function startWhenVisible() {
    var io = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          window.requestAnimationFrame(step);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(canvas);
  }

  if ("IntersectionObserver" in window) {
    startWhenVisible();
  } else {
    window.requestAnimationFrame(step);
  }
})();
