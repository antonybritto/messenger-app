function swipeToDelete() {
  const swipeElems = {};
  let elemId = 0;
  let isEventBinded = false;
  let clientWidth = 600;

  const EventHelper = {
    addTouchEvents() {
      if (!isEventBinded) {
        clientWidth = window.innerWidth || document.documentElement.clientWidth;
        const events = ['touchstart', 'touchmove', 'touchend'];
        events.forEach((eventItem) => {
          document.addEventListener(eventItem, (e) => {
            Object.keys(swipeElems).forEach((key) => {
              if (Object.prototype.hasOwnProperty.call(swipeElems, key)) {
                const swipeInstance = swipeElems[key];
                let target = e.target;
                while (target) {
                  if (target === swipeInstance.elem) {
                    swipeInstance[eventItem](e);
                    return false;
                  }
                  target = target.parentNode;
                }
                return false;
              }
            });
          }, { passive: true });
        });
      }
      isEventBinded = true;
    },
  };

 /**
 * Adds swipe to delete to given DOM
 * @param {number} elem DOM object
 * @param {number} touch.threshold min pixels to be dragged for deleting
 * @param {number} touch.time max time limit for performing faster swipe
 * @param {number} transform.duration animation duration  defaults to 400ms
 * @param {function} onDelete callback to be executed after deleting
 * @param {function} onRestore callback to be executed while restoring
 */
  const Swipe = function (o) {
    const defaultOptions = {
      touch: {
        threshold: 100, // px
        time: 200, // ms
      },
      transform: {
        duration: 400, // ms
      }
    };
    o = Object.assign(defaultOptions, o || {});
    this.touch = o.touch;
    this.transform = o.transform;
    this.elem = o.elem;
    this.id = elemId++;
    this.onDelete = typeof o.onDelete === 'function' ? o.onDelete : () => {};
    this.onRestore = typeof o.onRestore === 'function' ? o.onRestore : () => {};
  };

  Swipe.prototype.transitionEnd = function (node, cb) {
    const onEnd = () => {
      cb.call(this);
      node.removeEventListener('transitionend', onEnd);
    }
    node.addEventListener('transitionend', onEnd, { passive: true });
  };

  Swipe.prototype.touchstart = function (e) {
    const touch = e.changedTouches[0];
    if (e.touches.length !== 1) {
      return;
    }
    this.touchId = touch.identifier;
    this.startX = touch.pageX;
    this.startY = touch.pageY;
    this.startTime = new Date();
    this.elem.setAttribute('aria-grabbed', true);
    this.reset();
  };

  Swipe.prototype.touchmove = function (e) {
    const touch = e.changedTouches[0];
    if (!this.isValidTouch(e)) {
      return;
    }
    this.delta = touch.pageX - this.startX;
    this.direction = this.delta < 0 ? -1 : 1;
    this.setSwipePattern(touch);
    if (this.startSwipe) {
      this.animation(this.delta, 0);
    }
  };

  Swipe.prototype.touchend = function (e) {
    if (!this.isValidTouch(e, true) || !this.startSwipe) {
      return;
    }
    // if swiped distance is more than threshold or swipe time is less then 200ms
    if (this.direction * this.delta > this.touch.threshold || new Date() - this.startTime < this.touch.time) {
      this.delete();
    } else {
      this.restore();
    }
    this.elem.setAttribute('aria-grabbed', false);
    e.stopPropagation();
  };

  Swipe.prototype.delete = function () {
    this.animation(this.direction * clientWidth);
    this.swiped = true;
    this.transitionEnd(this.elem, this.onDelete);
    this.reset();
  };

  Swipe.prototype.restore = function () {
    this.animation(0);
    this.swiped = false;
    this.transitionEnd(this.elem, this.onRestore);
    this.reset();
  };

  Swipe.prototype.reset = function () {
    this.startSwipe = false;
    this.startScroll = false;
    this.delta = 0;
  };

  Swipe.prototype.setSwipePattern = function (touch) {
    if (Math.abs(this.startY - touch.pageY) > 10 && !this.startSwipe) {
      this.startScroll = true;
    } else if (Math.abs(this.delta) > 10 && !this.startScroll) {
      this.startSwipe = true;
    }
  };

  Swipe.prototype.isValidTouch = function (e, isTouchEnd) {
    const touches = isTouchEnd ? 'changedTouches' : 'targetTouches';
    return e[touches][0].identifier === this.touchId;
  };

  Swipe.prototype.animation = function (x, duration) {
    duration = duration === undefined ? this.transform.duration : duration;
    this.elem.style.cssText = `transition: transform ${duration}ms; transform: translate3d(${x}px, 0, 0)`;
  };

  Swipe.prototype.destroy = function (isRemoveNode) {
    delete swipeElems[this.id];
    if (isRemoveNode) {
      const elemRect = this.elem.getBoundingClientRect();
      let currentHeight = elemRect.height;
      const animateHide = () => {
        currentHeight = Math.round(currentHeight - 25);
        this.elem.style.height = `${Math.max(0, currentHeight)}px`;
        if (currentHeight > 0) {
          window.requestAnimationFrame(animateHide);
        } else {
          this.elem.style.display = 'none';
        }
      }
      window.requestAnimationFrame(animateHide);
    }
    this.elem.removeAttribute('aria-grabbed');
  };

  return {
    init(config) {
      if (!config.elem) {
        return;
      }
      config.elem.setAttribute('aria-grabbed', 'false');
      const swipeInstance = new Swipe(config);
      swipeElems[swipeInstance.id] = swipeInstance;
      EventHelper.addTouchEvents();
    },
  };
}

export default swipeToDelete();
