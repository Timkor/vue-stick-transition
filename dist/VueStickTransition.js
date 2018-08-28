"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var State = {
  ENTER: 'enter',
  ENTER_TO: 'enter-to',
  LEAVE: 'leave',
  LEAVE_TO: 'leave-to'
};
var OverarchingState = {};
OverarchingState[State.ENTER] = 'enter-active';
OverarchingState[State.ENTER_TO] = 'enter-active';
OverarchingState[State.LEAVE] = 'leave-active';
OverarchingState[State.LEAVE_TO] = 'leave-active';

var removeChilds = function removeChilds(node) {
  var last;

  while (last = node.lastChild) {
    node.removeChild(last);
  }
};

function getViewportPosition(element) {
  var domRect = element.getBoundingClientRect();
  return {
    x: domRect.left,
    y: domRect.top,
    width: domRect.width,
    height: domRect.height,
    centerX: domRect.left + domRect.width / 2,
    centerY: domRect.top + domRect.height / 2
  };
}

function nextFrame(callback) {
  window.requestAnimationFrame(callback);
}

var _default = {
  render: function render() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "transition",
      class: _vm.classes
    }, [_c('div', {
      ref: "source",
      staticClass: "source"
    }, [_vm._t("default")], 2), _c('div', {
      ref: "clone",
      staticClass: "clone",
      style: _vm.cloneStyle
    })]);
  },
  staticRenderFns: [],
  props: {
    name: {
      type: String,
      default: 'v'
    },
    duration: {
      type: Number,
      default: 500
    },
    transitionDuration: {
      type: Number,
      default: null
    },
    easing: {
      type: String,
      default: 'linear'
    },
    scale: {
      type: Boolean,
      default: false
    },
    prepare: Boolean
  },
  data: function data() {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
      state: null
    };
  },
  computed: {
    classes: function classes() {
      if (this.state == null) {
        return null;
      }

      return [this.name + '-' + this.state, this.name + '-' + OverarchingState[this.state]];
    },
    cloneStyle: function cloneStyle() {
      var duration = this.state === State.ENTER ? 0 : this.transitionDuration ? this.transitionDuration : this.duration;
      var transition = "transform ".concat(duration, "ms ease");
      return {
        position: 'fixed',
        left: this.x + 'px',
        top: this.y + 'px',
        transform: "translate(".concat(this.translateX, "px, ").concat(this.translateY, "px) scale(").concat(this.scaleX, ", ").concat(this.scaleY, ")"),
        transition: transition,
        zIndex: 999999
      };
    }
  },
  mounted: function mounted() {
    if (this.prepare) {
      this.prepareEnter();
    }
  },
  methods: {
    prepareEnter: function prepareEnter() {
      var _this = this;

      this.$emit('before-enter');

      if (this.state === State.ENTER) {
        return;
      }

      removeChilds(this.$refs.clone);

      var _getViewportPosition = getViewportPosition(this.$refs.source),
          x = _getViewportPosition.x,
          y = _getViewportPosition.y,
          width = _getViewportPosition.width,
          height = _getViewportPosition.height,
          centerX = _getViewportPosition.centerX,
          centerY = _getViewportPosition.centerY;

      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.centerX = centerX;
      this.centerY = centerY;
      Array.from(this.$refs.source.childNodes).forEach(function (node) {
        _this.$refs.clone.appendChild(node.cloneNode(true));
      });
      this.state = State.ENTER;
    },
    doEnter: function doEnter(targetElement) {
      var _this2 = this;

      this.prepareEnter();

      var _getViewportPosition2 = getViewportPosition(targetElement),
          centerX = _getViewportPosition2.centerX,
          centerY = _getViewportPosition2.centerY,
          width = _getViewportPosition2.width,
          height = _getViewportPosition2.height;

      if (this.scale) {
        this.scaleX = width / this.width;
        this.scaleY = height / this.height;
      }

      this.$emit('enter');
      nextFrame(function () {
        _this2.state = State.ENTER_TO;

        if (!_this2.scale) {
          _this2.scaleX = width / _this2.width;
          _this2.scaleY = height / _this2.height;
        }

        _this2.translateX = centerX - _this2.centerX;
        _this2.translateY = centerY - _this2.centerY;

        _this2.$emit('after-enter');
      });
      setTimeout(function () {
        _this2.doLeave();
      }, this.duration);
    },
    prepareLeave: function prepareLeave() {
      if (this.state === State.LEAVE) {
        return;
      }

      this.$emit('before-leave');
      this.state = State.LEAVE;
    },
    doLeave: function doLeave() {
      var _this3 = this;

      this.prepareLeave();
      this.$emit('leave');
      nextFrame(function () {
        _this3.state = State.LEAVE_TO;

        _this3.$emit('after-leave');
      });
    },
    reset: function reset() {
      var _this4 = this;

      this.translateX = 0;
      this.translateY = 0;
      this.scaleX = 1;
      this.scaleY = 1;
      nextFrame(function () {
        if (_this4.prepare) {
          _this4.prepareEnter();
        }
      });
    }
  }
};
exports.default = _default;