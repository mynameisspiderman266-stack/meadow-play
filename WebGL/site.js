(function () {
  'use strict';
  var canvas = document.getElementById('unity-canvas');
  var loading = document.getElementById('loading');
  var progress = document.getElementById('progress');
  var bar = document.getElementById('bar');
  var retry = document.getElementById('retry');
  var config = JSON.parse(document.getElementById('meadow-config').textContent);
  var loaderUrl = config.loaderUrl;
  delete config.loaderUrl;
  // Every URL resolves next to index.html; works at a domain root or in a subdirectory.
  ['dataUrl', 'frameworkUrl', 'codeUrl', 'streamingAssetsUrl'].forEach(function (key) {
    config[key] = new URL(config[key], document.baseURI).href;
  });
  // Quality preset (2026-10-27): 0 流畅 / 1 均衡 / 2 精致. Phones default to 流畅. The canvas pixel
  // ratio is the biggest single cost on a 3x phone screen, so it is capped before Unity starts.
  var mobile = /Android|iPhone|iPad|iPod|HarmonyOS|Mobile/i.test(navigator.userAgent) ||
    (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  window.meadowQualityDefault = mobile ? 0 : 2;
  var level = window.meadowQualityDefault;
  try {
    var saved = window.localStorage.getItem('meadow.quality');
    if (saved !== null && /^[0-2]$/.test(saved)) level = parseInt(saved, 10);
  } catch (e) {}
  config.devicePixelRatio = Math.min(window.devicePixelRatio || 1, [1.5, 2, 4][level]);
  // Measure the display refresh rate so the game can render on every Nth frame (60 on 120 Hz).
  (function () {
    var stamps = [];
    function tick(t) {
      stamps.push(t);
      if (stamps.length < 40) { requestAnimationFrame(tick); return; }
      var gaps = [];
      for (var i = 1; i < stamps.length; i++) gaps.push(stamps[i] - stamps[i - 1]);
      gaps.sort(function (a, b) { return a - b; });
      var mid = gaps[gaps.length >> 1];
      window.meadowRafHz = mid > 0 ? Math.round(1000 / mid) : 60;
    }
    requestAnimationFrame(tick);
  }());
  retry.addEventListener('click', function () { window.location.reload(); });
  function failed(error) {
    console.error(error);
    progress.textContent = '暂时没能进入草原，请重新加载。';
    bar.hidden = true;
    retry.hidden = false;
  }
  var loader = document.createElement('script');
  loader.src = new URL(loaderUrl, document.baseURI).href;
  loader.onerror = failed;
  loader.onload = function () {
    createUnityInstance(canvas, config, function (value) {
      bar.value = value;
      progress.textContent = '准备出发  ' + Math.round(value * 100) + '%';
    }).then(function (instance) {
      window.meadowUnity = instance;
      loading.remove();
    }).catch(failed);
  };
  document.body.appendChild(loader);
}());
