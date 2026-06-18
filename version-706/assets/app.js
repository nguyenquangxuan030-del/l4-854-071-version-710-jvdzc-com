(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function escapeText(value) {
    return String(value || "").replace(/[&<>'"]/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        "\"": "&quot;"
      }[char];
    });
  }

  function initMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function initHero() {
    var carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) {
      return;
    }
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        start();
      });
    });

    carousel.addEventListener("mouseenter", function () {
      window.clearInterval(timer);
    });
    carousel.addEventListener("mouseleave", start);
    start();
  }

  function initCatalogFilters() {
    document.querySelectorAll("[data-catalog]").forEach(function (catalog) {
      var textInput = catalog.querySelector("[data-filter-text]");
      var yearSelect = catalog.querySelector("[data-filter-year]");
      var typeSelect = catalog.querySelector("[data-filter-type]");
      var regionSelect = catalog.querySelector("[data-filter-region]");
      var cards = Array.prototype.slice.call(catalog.querySelectorAll("[data-movie-card]"));
      var empty = catalog.querySelector("[data-empty-state]");
      if (!cards.length) {
        return;
      }

      function apply() {
        var text = textInput ? textInput.value.trim().toLowerCase() : "";
        var year = yearSelect ? yearSelect.value : "";
        var type = typeSelect ? typeSelect.value : "";
        var region = regionSelect ? regionSelect.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var haystack = (card.getAttribute("data-search") || "").toLowerCase();
          var ok = true;
          if (text && haystack.indexOf(text) === -1) {
            ok = false;
          }
          if (year && card.getAttribute("data-year") !== year) {
            ok = false;
          }
          if (type && card.getAttribute("data-type") !== type) {
            ok = false;
          }
          if (region && card.getAttribute("data-region") !== region) {
            ok = false;
          }
          card.style.display = ok ? "" : "none";
          if (ok) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      [textInput, yearSelect, typeSelect, regionSelect].forEach(function (control) {
        if (control) {
          control.addEventListener("input", apply);
          control.addEventListener("change", apply);
        }
      });
    });
  }

  function cardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 4).map(function (tag) {
      return "<span>" + escapeText(tag) + "</span>";
    }).join("");
    return "<article class=\"movie-card\">" +
      "<a class=\"poster-link\" href=\"" + escapeText(movie.url) + "\">" +
      "<img src=\"./" + escapeText(movie.cover) + "\" alt=\"" + escapeText(movie.title) + "\" loading=\"lazy\">" +
      "<span class=\"poster-year\">" + escapeText(movie.year) + "</span>" +
      "</a>" +
      "<div class=\"movie-card-body\">" +
      "<div class=\"movie-meta-line\"><span>" + escapeText(movie.region) + "</span><span>" + escapeText(movie.type) + "</span></div>" +
      "<h3><a href=\"" + escapeText(movie.url) + "\">" + escapeText(movie.title) + "</a></h3>" +
      "<p>" + escapeText(movie.oneLine) + "</p>" +
      "<div class=\"tag-row\">" + tags + "</div>" +
      "</div>" +
      "</article>";
  }

  function initSearchPage() {
    var root = document.querySelector("[data-search-page]");
    var grid = document.getElementById("search-results");
    var input = document.getElementById("search-input");
    var title = document.querySelector("[data-search-title]");
    if (!root || !grid || !window.SEARCH_MOVIES) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    if (input) {
      input.value = query;
    }
    if (!query) {
      return;
    }
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var results = window.SEARCH_MOVIES.filter(function (movie) {
      var haystack = [
        movie.title,
        movie.region,
        movie.type,
        movie.genre,
        movie.year,
        movie.oneLine,
        (movie.tags || []).join(" ")
      ].join(" ").toLowerCase();
      return words.every(function (word) {
        return haystack.indexOf(word) !== -1;
      });
    }).slice(0, 120);
    if (title) {
      title.textContent = "搜索结果";
    }
    if (results.length) {
      grid.innerHTML = results.map(cardTemplate).join("");
    } else {
      grid.innerHTML = "<div class=\"empty-state is-visible\">没有匹配内容</div>";
    }
  }

  ready(function () {
    initMenu();
    initHero();
    initCatalogFilters();
    initSearchPage();
  });
})();
