(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  function setupMenu() {
    var button = document.querySelector(".menu-toggle");
    var panel = document.getElementById("mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function setupHero() {
    var hero = document.querySelector(".hero");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector(".hero-prev");
    var next = hero.querySelector(".hero-next");
    if (!slides.length) {
      return;
    }
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(current - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(current + 1);
        start();
      });
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    var grid = document.querySelector("[data-movie-grid]");
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
    var input = document.getElementById("movie-search");
    var category = document.getElementById("filter-category");
    var year = document.getElementById("filter-year");
    var type = document.getElementById("filter-type");
    var reset = document.getElementById("filter-reset");
    var empty = document.querySelector(".no-results");
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (input && q) {
      input.value = q;
    }

    function normalize(value) {
      return String(value || "").trim().toLowerCase();
    }

    function apply() {
      var query = normalize(input ? input.value : "");
      var selectedCategory = category ? category.value : "";
      var selectedYear = year ? year.value : "";
      var selectedType = type ? type.value : "";
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.dataset.title,
          card.dataset.tags,
          card.dataset.year,
          card.dataset.region,
          card.dataset.type
        ].join(" ").toLowerCase();
        var matchQuery = !query || text.indexOf(query) !== -1;
        var matchCategory = !selectedCategory || card.dataset.category === selectedCategory;
        var matchYear = !selectedYear || card.dataset.year === selectedYear;
        var matchType = !selectedType || card.dataset.type === selectedType;
        var show = matchQuery && matchCategory && matchYear && matchType;
        card.classList.toggle("is-hidden", !show);
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    [input, category, year, type].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });

    if (reset) {
      reset.addEventListener("click", function () {
        if (input) {
          input.value = "";
        }
        if (category) {
          category.value = "";
        }
        if (year) {
          year.value = "";
        }
        if (type) {
          type.value = "";
        }
        apply();
      });
    }

    apply();
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();
