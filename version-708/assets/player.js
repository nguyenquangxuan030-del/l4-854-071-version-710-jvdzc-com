(function() {
  window.setupMoviePlayer = function(sourceUrl) {
    var video = document.querySelector(".movie-video");
    var overlay = document.querySelector(".play-overlay");
    if (!video || !sourceUrl) return;

    var hlsInstance = null;
    var loaded = false;

    function load() {
      if (loaded) return;
      loaded = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = sourceUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(sourceUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = sourceUrl;
      }
    }

    function play() {
      load();
      if (overlay) overlay.classList.add("is-hidden");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function() {});
      }
    }

    if (overlay) {
      overlay.addEventListener("click", play);
    }

    video.addEventListener("play", function() {
      if (overlay) overlay.classList.add("is-hidden");
    });

    video.addEventListener("click", function() {
      if (!loaded) play();
    });

    window.addEventListener("beforeunload", function() {
      if (hlsInstance) hlsInstance.destroy();
    });
  };
})();
