function swipeToDelete() {
  const swipeElems = [];
  let elemId = 0;
  let isEventBinded = false;

  const EventHelper = {
    addTouchEvents() {
      if (!isEventBinded) {
        const events = ['touchstart', 'touchmove', 'touchend'];
        events.forEach((eventItem) => {
          document.addEventListener(eventItem, (e) => {
            swipeElems.forEach((elem) => {
              let target = e.target;
              while (target) {
                if (target === elem.elem) {
                  elem[eventItem](e);
                  return false;
                }
                target = target.parentNode;
              }
              return false;
            });
          }, { passive: true });
        });
      }
      isEventBinded = true;
    },
  };

  const Swipe = function (o) {
    const defaultOptions = {
      touch: {
        threshold: 100, // px
        time: 200, // ms
      },
      transform: {
        duration: 400, // ms
      },
      right: 400, // px
      left: 400, // px
    };
    o = Object.assign(defaultOptions, o || {});
    this.touch = o.touch;
    this.transform = o.transform;
    this.width = o.left || o.right;
    this.elem = o.elem;
    this.id = elemId++;
    this.onDelete = typeof o.onDelete === 'function' ? o.onDelete : () => {};
    this.onRestore = typeof o.onRestore === 'function' ? o.onRestore : () => {};
    this.right = o.right;
    this.left = o.left;
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
    this.width = this.delta < 0 ? this.right : this.left;
    this.setSwipePattern(touch);
    if (this.startSwipe) {
      this.move();
    }
  };

  Swipe.prototype.touchend = function (e) {
    if (!this.isValidTouch(e, true) || !this.startSwipe) {
      return;
    }
    // if swipe distance is more than threshold or swipe time is less then 200ms
    if (this.direction * this.delta > this.touch.threshold || new Date() - this.startTime < this.touch.time) {
      this.delete();
    } else {
      this.restore();
    }
    this.elem.setAttribute('aria-grabbed', false);
    e.stopPropagation();
  };

  Swipe.prototype.delete = function () {
    this.animation(this.direction * this.width);
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

  Swipe.prototype.move = function () {
    const deltaAbs = Math.abs(this.delta);
    // if card is moved opposite to the configured direction then stop moving
    if ((this.direction > 0 && (this.delta < 0 || this.left === 0)) || (this.direction < 0 && (this.delta > 0 || this.right === 0))) {
      return;
    }
    if (deltaAbs > this.width) {
      this.delta = this.direction * (this.width + ((deltaAbs - this.width) / 8));
    }
    this.animation(this.delta, 0);
  };

  Swipe.prototype.animation = function (x, duration) {
    duration = duration === undefined ? this.transform.duration : duration;
    this.elem.style.cssText = `transition: transform ${duration}ms; transform: translate3d(${x}px, 0px, 0px)`;
  };

  Swipe.prototype.destroy = function (isRemoveNode) {
    const id = this.id;
    swipeElems.forEach((elem, i) => {
      if (elem.id === id) {
        swipeElems.splice(i, 1);
      }
    });
    if (isRemoveNode) {
      this.elem.style.display = 'none';
      this.elem.removeAttribute('aria-grabbed');
    }
  };

  return {
    init(config) {
      if (!config.elem) {
        return;
      }
      config.elem.setAttribute('aria-grabbed', 'false');
      swipeElems.push(new Swipe(config));
      EventHelper.addTouchEvents();
    },
  };
}

export default swipeToDelete();
