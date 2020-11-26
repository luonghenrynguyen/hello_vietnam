(function () {
  function addARIcon (ele) {
    if (ele.querySelector('img') && ele.getAttribute('no-icon') === null) {
      var img = document.createElement('img');
      img.classList.add('ar-icon');
      img.setAttribute('src', 'images/ar-icon.png');
      img.setAttribute('style', 'width: 35px; height: 35px; border-radius: 50%; position: absolute; top: 10px; right: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, .1);');
      ele.appendChild(img);
      ele.style.position = 'relative';
    }
  }
  function androidARURL (gltfSrc, title, arScale) {
    var _location = location.toString();
    var modelUrl = new URL(gltfSrc, _location);
    var scheme = modelUrl.protocol.replace(':', '');
    var intentParams = '?file=' + encodeURIComponent(modelUrl.toString()) + '&mode=3d_preferred&link=' + _location + '&title=' + encodeURIComponent(title);
    if (arScale === 'fixed') intentParams += '&resizable=false';
    return 'intent://arvr.google.com/scene-viewer/1.0' + intentParams + '#Intent;scheme=' + scheme + ';package=com.google.ar.core;action=android.intent.action.VIEW;end;';
  }
  function setupQuickLookAction (ele) {
    var usdz = ele.getAttribute('ios-src');
    if (usdz && /.+\.(usdz|reality)/.test(usdz)) {
      addARIcon(ele);
      ele.addEventListener('click', function (e) {
        e.preventDefault();
        var anchor = document.createElement('a');
        anchor.setAttribute('rel', 'ar');
        anchor.setAttribute('href', usdz);
        anchor.appendChild(document.createElement('img'));
        anchor.click();
      }, false);
    } else {
      ele.addEventListener('click', function (e) {
        e.preventDefault();
      }, false);
    }
  }
  function setupARViewerAction (ele) {
    var glb = ele.getAttribute('href');
    if (glb && /.+\.(glb|gltf)/.test(glb)) {
      addARIcon(ele);
      ele.addEventListener('click', function (e) {
        e.preventDefault();
        var anchor = document.createElement('a');
        anchor.setAttribute('href', androidARURL(glb, ele.getAttribute('alt') || ''));
        anchor.click();
      }, false);
    } else {
      ele.addEventListener('click', function (e) {
        e.preventDefault();
      }, false);
    }
  }
  function setupDefaultAction (ele) {
    ele.addEventListener('click', function (e) {
      e.preventDefault();
    }, false);
  }

  var IS_ANDROID = /android/i.test(navigator.userAgent);
  var IS_AR_QUICKLOOK_CANDIDATE = (function () {
    var tempAnchor = document.createElement('a');
    return tempAnchor.relList && tempAnchor.relList.supports && tempAnchor.relList.supports('ar');
  })();

  var createEvent = function (os, arSupported) {
    return new CustomEvent('initAR', {detail: {os: os, arSupported: arSupported}});
  };

  document.addEventListener('DOMContentLoaded', function () {
    var event, objs = Array.prototype.slice.call(document.querySelectorAll('a[href$=".glb"],a[href$=".gltf"],a[ios-src$=".usdz"],a[ios-src$=".reality"]'), 0);
    if (IS_AR_QUICKLOOK_CANDIDATE) {
      document.body.classList.add('ar-supported');
      objs.forEach(setupQuickLookAction);
      event = createEvent('ios', true);
    } else if (IS_ANDROID) {
      document.body.classList.add('ar-supported');
      objs.forEach(setupARViewerAction);
      event = createEvent('android', true);
    } else {
      document.body.classList.add('ar-unsupported');
      objs.forEach(setupDefaultAction);
      event = createEvent('unknown', false);
    }
    document.dispatchEvent(event);
  });
})();