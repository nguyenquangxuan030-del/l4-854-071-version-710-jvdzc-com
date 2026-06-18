(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var value = input ? input.value.trim() : '';
      var target = './search.html';

      if (value) {
        target += '?q=' + encodeURIComponent(value);
      }

      window.location.href = target;
    });
  });

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 6500);
    }
  }

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
  var keywordInput = document.querySelector('[data-filter-input]');
  var queryInput = document.querySelector('[data-query-input]');
  var yearFilter = document.querySelector('[data-year-filter]');
  var genreFilter = document.querySelector('[data-genre-filter]');
  var emptyState = document.querySelector('[data-empty-state]');

  function text(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    var keyword = text(keywordInput && keywordInput.value);
    var year = text(yearFilter && yearFilter.value);
    var genre = text(genreFilter && genreFilter.value);
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = text([
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-type'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year')
      ].join(' '));
      var cardYear = text(card.getAttribute('data-year'));
      var cardGenre = text(card.getAttribute('data-genre'));
      var matched = true;

      if (keyword && haystack.indexOf(keyword) === -1) {
        matched = false;
      }

      if (year && cardYear !== year) {
        matched = false;
      }

      if (genre && cardGenre.indexOf(genre) === -1) {
        matched = false;
      }

      card.classList.toggle('is-filter-hidden', !matched);

      if (matched) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (queryInput) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');

    if (q) {
      queryInput.value = q;
    }
  }

  [keywordInput, yearFilter, genreFilter].forEach(function (control) {
    if (control) {
      control.addEventListener('input', applyFilters);
      control.addEventListener('change', applyFilters);
    }
  });

  applyFilters();
})();
