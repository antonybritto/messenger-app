  // var prefix = (function () {
  //     var styles = window.getComputedStyle(document.documentElement, '');
  //     var pre = (Array.prototype.slice
  //             .call(styles)
  //             .join('')
  //             .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
  //         )[1];
  //     return '-' + pre + '-';
  // })();

  // var transitionEvent = (function() {
  //     var t, el = document.createElement("dummy");
  //     var transitions = {
  //         "transition"      : "transitionend",
  //         "OTransition"     : "oTransitionEnd",
  //         "MozTransition"   : "transitionend",
  //         "WebkitTransition": "webkitTransitionEnd"
  //     };
  //     for (t in transitions){
  //         if (el.style[t] !== undefined){
  //             return transitions[t];
  //         }
  //     }
  // })();

  // const cssProps = {
  //   transition: '-webkit-transition',
  //   transform: '-webkit-transform',
  // };
