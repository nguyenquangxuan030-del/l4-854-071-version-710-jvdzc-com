(function () {
    function ready(fn) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", fn);
        } else {
            fn();
        }
    }

    function initMenu() {
        var toggle = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-site-nav]");
        if (!toggle || !nav) {
            return;
        }
        toggle.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
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
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }
        function restart() {
            window.clearInterval(timer);
            start();
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }
        if (slides.length > 1) {
            start();
        }
    }

    function yearMatches(value, mode) {
        var year = Number(value);
        if (!mode || mode === "全部年份") {
            return true;
        }
        if (!Number.isFinite(year)) {
            return false;
        }
        if (mode === "2020以后") {
            return year >= 2020;
        }
        if (mode === "2010-2019") {
            return year >= 2010 && year <= 2019;
        }
        if (mode === "2000-2009") {
            return year >= 2000 && year <= 2009;
        }
        if (mode === "1990-1999") {
            return year >= 1990 && year <= 1999;
        }
        if (mode === "更早") {
            return year < 1990;
        }
        return true;
    }

    function initInlineFilters() {
        document.querySelectorAll("[data-filter-panel]").forEach(function (panel) {
            var section = panel.parentElement;
            var container = section ? section.querySelector("[data-card-container]") : null;
            var cards = container ? Array.prototype.slice.call(container.querySelectorAll("[data-card]")) : [];
            var keyword = panel.querySelector("[data-filter-keyword]");
            var type = panel.querySelector("[data-filter-type]");
            var year = panel.querySelector("[data-filter-year]");
            var empty = section ? section.querySelector("[data-filter-empty]") : null;
            function apply() {
                var q = keyword ? keyword.value.trim().toLowerCase() : "";
                var t = type ? type.value : "";
                var y = year ? year.value : "";
                var shown = 0;
                cards.forEach(function (card) {
                    var haystack = card.getAttribute("data-search") || "";
                    var ok = (!q || haystack.indexOf(q) !== -1) && (!t || card.getAttribute("data-type") === t) && yearMatches(card.getAttribute("data-year"), y);
                    card.style.display = ok ? "" : "none";
                    if (ok) {
                        shown += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle("is-visible", shown === 0);
                }
            }
            [keyword, type, year].forEach(function (node) {
                if (node) {
                    node.addEventListener("input", apply);
                    node.addEventListener("change", apply);
                }
            });
        });
    }

    function movieCard(movie) {
        var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
            return "<span>" + escapeHtml(tag) + "</span>";
        }).join("");
        return "<article class=\"movie-card\"><a href=\"" + escapeHtml(movie.url) + "\"><div class=\"movie-thumb\"><img src=\"" + escapeHtml(movie.cover) + "\" alt=\"" + escapeHtml(movie.title) + "\" loading=\"lazy\"><div class=\"movie-play\">▶</div></div><div class=\"movie-info\"><div class=\"movie-meta\">" + escapeHtml(movie.year) + " · " + escapeHtml(movie.region) + " · " + escapeHtml(movie.type) + "</div><h2>" + escapeHtml(movie.title) + "</h2><p>" + escapeHtml(movie.oneLine || "") + "</p><div class=\"tag-list\">" + tags + "</div></div></a></article>";
    }

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function initSearchPage() {
        var results = document.getElementById("searchResults");
        if (!results || !window.__MOVIES__) {
            return;
        }
        var input = document.getElementById("globalSearchInput");
        var type = document.getElementById("globalTypeSelect");
        var region = document.getElementById("globalRegionSelect");
        var empty = document.getElementById("searchEmpty");
        function matchRegion(movie, value) {
            if (!value) {
                return true;
            }
            if (value === "日韩") {
                return /日本|韩国|日韩/.test(movie.region + movie.genre + (movie.tags || []).join(""));
            }
            if (value === "欧美") {
                return /美国|英国|法国|德国|意大利|西班牙|加拿大|欧美|欧洲/.test(movie.region + movie.genre + (movie.tags || []).join(""));
            }
            if (value === "亚洲") {
                return /亚洲|泰国|印度|越南|新加坡|马来西亚|菲律宾|印尼/.test(movie.region + movie.genre + (movie.tags || []).join(""));
            }
            return (movie.region || "").indexOf(value) !== -1;
        }
        function apply() {
            var q = input ? input.value.trim().toLowerCase() : "";
            var t = type ? type.value : "";
            var r = region ? region.value : "";
            var matches = window.__MOVIES__.filter(function (movie) {
                var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.category, (movie.tags || []).join(" ")].join(" ").toLowerCase();
                return (!q || haystack.indexOf(q) !== -1) && (!t || movie.type === t) && matchRegion(movie, r);
            }).slice(0, 96);
            results.innerHTML = matches.map(movieCard).join("");
            if (empty) {
                empty.classList.toggle("is-visible", matches.length === 0);
            }
            initImageFallbacks(results);
        }
        [input, type, region].forEach(function (node) {
            if (node) {
                node.addEventListener("input", apply);
                node.addEventListener("change", apply);
            }
        });
        apply();
    }

    function initPlayers() {
        document.querySelectorAll("[data-player]").forEach(function (player) {
            var video = player.querySelector("video");
            var overlay = player.querySelector(".play-overlay");
            var src = player.getAttribute("data-video-src");
            var loaded = false;
            var hls = null;
            function load() {
                if (loaded || !video || !src) {
                    return;
                }
                loaded = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = src;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(src);
                    hls.attachMedia(video);
                } else {
                    video.src = src;
                }
            }
            function start() {
                load();
                if (overlay) {
                    overlay.classList.add("is-hidden");
                }
                video.setAttribute("controls", "controls");
                var promise = video.play();
                if (promise && typeof promise.catch === "function") {
                    promise.catch(function () {});
                }
            }
            if (overlay) {
                overlay.addEventListener("click", start);
            }
            if (video) {
                video.addEventListener("click", function () {
                    if (video.paused) {
                        start();
                    }
                });
            }
            window.addEventListener("pagehide", function () {
                if (hls && typeof hls.destroy === "function") {
                    hls.destroy();
                }
            });
        });
    }

    function initImageFallbacks(root) {
        var scope = root || document;
        scope.querySelectorAll("img").forEach(function (img) {
            img.addEventListener("error", function () {
                var parent = img.parentElement;
                if (parent) {
                    parent.classList.add("cover-empty");
                }
                img.style.opacity = "0";
            }, { once: true });
        });
    }

    ready(function () {
        initMenu();
        initHero();
        initInlineFilters();
        initSearchPage();
        initPlayers();
        initImageFallbacks(document);
    });
})();
