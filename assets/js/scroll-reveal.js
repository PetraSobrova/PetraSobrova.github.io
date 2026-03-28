
(function () {
  var els = document.querySelectorAll('.reveal, .reveal-card');
  if (!els.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { io.observe(el); });
})();
