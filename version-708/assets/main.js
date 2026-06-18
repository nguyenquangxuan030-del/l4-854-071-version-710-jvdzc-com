(function() {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function initMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function() {
      panel.hidden = !panel.hidden;
    });
  }

  function initHero() {
    var slider = document.getElementById("heroSlider");
    if (!slider) return;
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll(".hero-dot"));
    if (slides.length <= 1) return;
    var index = 0;
    var timer;

    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function(slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function(dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        show(Number(dot.getAttribute("data-slide")) || 0);
        restart();
      });
    });

    restart();
  }

  function initGlobalSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll(".global-search"));
    if (!inputs.length || !window.SEARCH_ITEMS) return;
    inputs.forEach(function(input) {
      var wrap = input.closest(".header-search") || input.closest(".home-search") || document;
      var panel = wrap.querySelector(".global-results");
      if (!panel) return;

      input.addEventListener("input", function() {
        var query = input.value.trim().toLowerCase();
        if (!query) {
          panel.hidden = true;
          panel.innerHTML = "";
          return;
        }
        var hits = window.SEARCH_ITEMS.filter(function(item) {
          return item.t.toLowerCase().indexOf(query) > -1 ||
            item.g.toLowerCase().indexOf(query) > -1 ||
            item.y.toLowerCase().indexOf(query) > -1;
        }).slice(0, 12);
        panel.innerHTML = hits.map(function(item) {
          return '<a class="search-item" href="' + item.u + '">' +
            '<img src="' + item.c + '" alt="' + escapeHtml(item.t) + '封面">' +
            '<span><strong>' + escapeHtml(item.t) + '</strong><span>' + escapeHtml(item.y + ' · ' + item.r + ' · ' + item.g) + '</span></span>' +
            '</a>';
        }).join("");
        panel.hidden = hits.length === 0;
      });
    });
  }

  function initLocalFilter() {
    var input = document.querySelector(".local-filter");
    var year = document.querySelector(".year-filter");
    var type = document.querySelector(".type-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".category-movie-grid .movie-card"));
    var empty = document.querySelector(".empty-state");
    if (!cards.length) return;

    function apply() {
      var q = input ? input.value.trim().toLowerCase() : "";
      var y = year ? year.value : "";
      var t = type ? type.value : "";
      var shown = 0;
      cards.forEach(function(card) {
        var text = [
          card.getAttribute("data-title") || "",
          card.getAttribute("data-tags") || "",
          card.getAttribute("data-text") || ""
        ].join(" ").toLowerCase();
        var ok = (!q || text.indexOf(q) > -1) &&
          (!y || (card.getAttribute("data-year") || "").indexOf(y) > -1) &&
          (!t || (card.getAttribute("data-type") || "") === t);
        card.hidden = !ok;
        if (ok) shown += 1;
      });
      if (empty) empty.hidden = shown !== 0;
    }

    [input, year, type].forEach(function(el) {
      if (el) el.addEventListener("input", apply);
      if (el) el.addEventListener("change", apply);
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function(ch) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
      }[ch];
    });
  }

  ready(function() {
    initMenu();
    initHero();
    initGlobalSearch();
    initLocalFilter();
  });
})();
