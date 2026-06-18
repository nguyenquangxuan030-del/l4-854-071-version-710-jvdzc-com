(function () {
  function initPlayer(box) {
    var video = box.querySelector('video');
    var cover = box.querySelector('[data-play-cover]');
    var stream = video ? video.getAttribute('data-stream') : '';
    var initialized = false;
    var hlsInstance = null;

    if (!video || !stream) {
      return;
    }

    function bindStream() {
      if (initialized) {
        return;
      }

      initialized = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hlsInstance.loadSource(stream);
        hlsInstance.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function start() {
      bindStream();

      if (cover) {
        cover.classList.add('is-hidden');
      }

      video.setAttribute('controls', 'controls');
      var promise = video.play();

      if (promise && promise.catch) {
        promise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', start);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });

    video.addEventListener('play', function () {
      if (cover) {
        cover.classList.add('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  }

  document.querySelectorAll('[data-player]').forEach(initPlayer);
})();
