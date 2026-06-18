(function () {
  "use strict";

  var activePlayers = new WeakMap();

  function attachVideo(video, source) {
    if (activePlayers.has(video)) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
      activePlayers.set(video, { type: "native" });
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(source);
      hls.attachMedia(video);
      activePlayers.set(video, hls);
      return;
    }

    video.src = source;
    activePlayers.set(video, { type: "direct" });
  }

  window.initVideoPlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);

    if (!video || !overlay || !options.source) {
      return;
    }

    function play() {
      attachVideo(video, options.source);
      overlay.classList.add("is-hidden");
      video.play().catch(function () {
        overlay.classList.remove("is-hidden");
      });
    }

    overlay.addEventListener("click", play);
    video.addEventListener("play", function () {
      overlay.classList.add("is-hidden");
    });
  };
})();
