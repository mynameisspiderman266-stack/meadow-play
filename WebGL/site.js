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
