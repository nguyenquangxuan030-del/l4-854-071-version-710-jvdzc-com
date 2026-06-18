document.addEventListener("DOMContentLoaded", function() {
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navMenu = document.querySelector("[data-nav-menu]");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function() {
      navMenu.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("img").forEach(function(image) {
    image.addEventListener("error", function() {
      image.classList.add("image-missing");
    });
  });

  const slider = document.getElementById("heroSlider");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dots = Array.from(slider.querySelectorAll(".hero-dot"));
    let activeIndex = 0;

    function showSlide(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === activeIndex);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === activeIndex);
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        const nextIndex = Number(dot.getAttribute("data-slide"));
        showSlide(nextIndex);
      });
    });

    if (slides.length > 1) {
      setInterval(function() {
        showSlide(activeIndex + 1);
      }, 5200);
    }
  }

  const filterForm = document.querySelector("[data-filter-form]");
  const filterInput = document.querySelector("[data-filter-input]");
  const cardList = document.querySelector("[data-card-list]");

  if (filterInput && cardList) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    if (query) {
      filterInput.value = query;
    }

    function filterCards() {
      const value = filterInput.value.trim().toLowerCase();
      const cards = cardList.querySelectorAll("[data-title]");
      cards.forEach(function(card) {
        const text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-year"),
          card.getAttribute("data-region")
        ].join(" ").toLowerCase();
        card.style.display = text.includes(value) ? "" : "none";
      });
    }

    filterInput.addEventListener("input", filterCards);
    filterCards();

    if (filterForm) {
      filterForm.addEventListener("submit", function(event) {
        if (window.location.pathname.endsWith("movies.html")) {
          event.preventDefault();
          const nextUrl = new URL(window.location.href);
          nextUrl.searchParams.set("q", filterInput.value.trim());
          window.history.replaceState(null, "", nextUrl.toString());
          filterCards();
        }
      });
    }
  }
});
