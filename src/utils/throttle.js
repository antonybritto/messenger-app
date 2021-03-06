export default function throttle(fn, threshhold, scope) {
  threshhold = threshhold || (threshhold = 250);
  let last;
  let deferTimer;
  return function inner(...args) {
    const context = scope || this;
    const now = +new Date();
    if (last && now < last + threshhold) {
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
