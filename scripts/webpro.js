/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function (a, b) {
  function c() {}
  var d = {
    version: 0.1,
    inherit: function (a, c) {
      var b = function () {};
      b.prototype = c.prototype;
      a.prototype = new b;
      a.prototype.constructor = a;
      a.prototype._super = c
    },
    ensureArray: function () {
      var c = [],
        b = arguments.length;
      b > 0 && (c = b > 1 || !a.isArray(arguments[0]) ? a.makeArray(arguments) : arguments[0]);
      return c
    },
    hasPointerCapture: function () {
      return !!b.hasPointerCapture
    },
    setPointerCapture: function (a, c) {
      if (c.pointerId && !b.hasPointerCapture)
        if (a.setPointerCapture) a.setPointerCapture(c.pointerId), b.hasPointerCapture = !0;
        else if (a.msSetPointerCapture) a.msSetPointerCapture(c.pointerId), b.hasPointerCapture = !0
    },
    releasePointerCapture: function (a, c) {
      c.pointerId && b.hasPointerCapture && (a.releasePointerCapture ? a.releasePointerCapture(c.pointerId) : a.msReleasePointerCapture && a.msReleasePointerCapture(c.pointerId), delete b.hasPointerCapture)
    },
    scopedFind: function (c, b, d, h) {
      for (var d = " " + d + " ", i = [], c = a(c).find(b), b = c.length, h = a(h)[0], k = 0; k < b; k++)
        for (var l = c[k], m = l; m;) {
          if (m.className && (" " + m.className + " ").indexOf(d) !== -1) {
            m ===
              h && i.push(l);
            break
          }
          m = m.parentNode
        }
      return a(i)
    }
  };
  a.extend(c.prototype, {
    bind: function (c, b, d) {
      return a(this).bind(c, b, d)
    },
    unbind: function (c, b) {
      return a(this).unbind(c, b)
    },
    trigger: function (c, b) {
      var d = a.Event(c);
      a(this).trigger(d, b);
      return d
    }
  });
  d.EventDispatcher = c;
  b.WebPro = d
})(jQuery, window, document);
(function (a, b) {
  var c = 1;
  b.ImageLoader = function (c) {
    b.EventDispatcher.call();
    var g = this;
    this.options = a.extend({}, this.defaultOptions, c);
    this._currentEntry = null;
    this._queue = [];
    this._isRunning = this._needsSort = !1;
    this._loader = new Image;
    this._loadFunc = function () {
      g._handleLoad()
    };
    this._loadErrorFunc = function () {
      g._handleError()
    };
    this._timeoutFunc = function () {
      g.trigger("wp-image-loader-timeout", this._currentEntry);
      g._loadNext()
    }
  };
  b.inherit(b.ImageLoader, b.EventDispatcher);
  a.extend(b.ImageLoader.prototype, {
    defaultOptions: {
      timeoutInterval: 1E3
    },
    add: function (d, g) {
      if (d) {
        urls = b.ensureArray(d);
        for (var f = 0; f < urls.length; f++) {
          var j = a.extend({
            reqId: c++,
            src: urls[f],
            width: 0,
            height: 0,
            priority: 50,
            callback: null,
            data: null
          }, g);
          this._queue.push(j);
          this._needsSort = !0;
          this.trigger("wp-image-loader-add", j)
        }
        this._isRunning && !this._currentEntry && this._loadNext()
      }
    },
    reprioritize: function (a, c) {
      if (!(this._currentEntry && this._currentEntry.src == a)) {
        var b;
        for (b = 0; b < this._queue.length; ++b)
          if (this._queue[b].src == a) break;
        if (b != 0 && b < this._queue.length) this._queue = this._queue.splice(b,
          c ? this._queue.length - b : 1).concat(this._queue)
      }
    },
    start: function () {
      if (!this._isRunning) this._isRunning = !0, this._loadNext(), this.trigger("wp-image-loader-start")
    },
    stop: function () {
      if (this._isRunning) this._currentEntry && this._queue.unshift(this._currentEntry), this._resetLoader(), this._isRunning = !1, this.trigger("wp-image-loader-stop")
    },
    clearQueue: function () {
      var a = this._isRunning;
      this.stop();
      this._queue.length = 0;
      a && this.start()
    },
    isQueueEmpty: function () {
      return this._queue.length == 0
    },
    _loadNext: function () {
      var d;
      this._resetLoader();
      var a = this._queue;
      if (a.length) {
        if (this._needsSort) d = this._queue = a.sort(function (a, c) {
          var b = a.priority - c.priority;
          return b ? b : a.reqId - c.reqId
        }), a = d, this._needsSort = !1;
        this._currentEntry = a = a.shift();
        var c = this._loader;
        c.onload = this._loadFunc;
        c.onerror = this._loadErrorFunc;
        c.src = a.src
      }
    },
    _resetLoader: function () {
      var a = this._loader;
      a.onload = null;
      a.onerror = null;
      this._currentEntry = a.src = null;
      if (this._timeoutTimerId) clearTimeout(this._timeoutTimerId), this._timeoutTimerId = 0
    },
    _handleLoad: function () {
      var a =
        this._loader,
        c = this._currentEntry;
      c.width = a.width;
      c.height = a.height;
      c.callback && c.callback(c.src, c.width, c.height, c.data);
      this.trigger("wp-image-loader-load-success", c);
      this._loadNext()
    },
    _handleError: function () {
      this.trigger("wp-image-loader-load-error", this._currentEntry);
      this._loadNext()
    }
  })
})(jQuery, WebPro, window, document);
(function (a, b) {
  function c() {
    b.EventDispatcher.call(this);
    this._initialize.apply(this, arguments)
  }
  b.inherit(c, b.EventDispatcher);
  a.extend(c.prototype, {
    defaultOptions: {},
    _widgetName: "Widget",
    _initialize: function () {
      var c;
      this.plugins = [];
      var b = this.trigger("before-setup");
      b.isDefaultPrevented() || (c = this._setUp.apply(this, arguments), this.trigger("setup"));
      b = this.trigger("before-init-plugins");
      b.isDefaultPrevented() || (this._initializePlugins(c), this.trigger("init-plugins"));
      this.options = a.extend({}, this.defaultOptions,
        c);
      b = this.trigger("before-extract-data");
      b.isDefaultPrevented() || (this._extractData(), this.trigger("extract-data"));
      b = this.trigger("before-transform-markup");
      b.isDefaultPrevented() || (this._transformMarkup(), this.trigger("transform-markup"));
      b = this.trigger("before-attach-behavior");
      b.isDefaultPrevented() || (this._attachBehavior(), this.trigger("attach-behavior"));
      b = this.trigger("before-ready");
      b.isDefaultPrevented() || (this._ready(), this.trigger("ready"));
      var f = this;
      a("body").on("muse_bp_activate", function (a,
        c, b) {
        b.is(f.$bp) && (f._bpActivate(), f.trigger("bp-activate"))
      }).on("muse_bp_deactivate", function (a, c, b) {
        b.is(f.$bp) && (f._bpDeactivate(), f.trigger("bp-deactivate"))
      })
    },
    _setUp: function (c, b) {
      this.$element = a(c);
      var f = this.$element.closest(".breakpoint");
      if (1 == f.length) this.$bp = f, this.breakpoint = this.$bp.data("bpObj");
      return b
    },
    _initializePlugins: function (a) {
      for (var a = a || {}, c = ((typeof a.useDefaultPlugins === "undefined" || a.useDefaultPlugins) && this.defaultPlugins ? this.defaultPlugins : []).concat(a.plugins || []), c = c.sort(function (a, c) {
          a = typeof a.priority === "number" ? a.priority : 50;
          c = typeof c.priority === "number" ? c.priority : 50;
          return a - c
        }), b = 0; b < c.length; b++) {
        var j = c[b];
        j && j.initialize && j.initialize(this, a)
      }
      this.plugins = c
    },
    _extractData: function () {},
    _transformMarkup: function () {},
    _attachBehavior: function () {},
    _ready: function () {},
    _bpActivate: function () {},
    _bpDeactivate: function () {}
  });
  b.Widget = c;
  b.widget = function (c, g, f) {
    var j = f && g || b.Widget,
      f = f || g || {},
      g = function () {
        j.apply(this, arguments);
        this._widgetName = c
      };
    b.inherit(g,
      j);
    a.extend(g.prototype, f);
    g.prototype.defaultOptions = a.extend({}, j.prototype.defaultOptions, f.defaultOptions);
    var f = c.split("."),
      h = f.length;
    namespace = h > 1 && f[0] || "Widget";
    c = f[h - 1];
    b[namespace][c] = g
  }
})(jQuery, WebPro, window, document);
(function (a, b) {
  b.widget("Widget.Button", b.Widget, {
    defaultOptions: {
      hoverClass: "wp-button-hover",
      activeClass: "wp-button-down",
      disabledClass: "wp-button-disabled",
      disabled: !1,
      clickCallback: null,
      prevCallback: null,
      nextCallback: null
    },
    _attachBehavior: function () {
      var c = this,
        b = function (g) {
          c.$element.removeClass(c.options.activeClass);
          !c.options.disabled && c.options.clickCallback && c.mouseDown && c.options.clickCallback.call(this, g);
          a(c.$element).off("mouseup pointerup", b);
          c.mouseDown = !1
        };
      this.mouseDown = !1;
      this.$element.on("keydown",
        function (a) {
          if (!c.options.disabled) {
            var b = a.which || a.keyCode;
            switch (b) {
            case 37:
            case 38:
              a.preventDefault();
              c.options.prevCallback && c.options.prevCallback.call(this, a);
              break;
            case 39:
            case 40:
              a.preventDefault();
              c.options.nextCallback && c.options.nextCallback.call(this, a);
              break;
            case 32:
            case 13:
              b === 32 && a.preventDefault(), c.options.clickCallback && c.options.clickCallback.call(this, a)
            }
          }
        }).on("mouseover", function () {
        c.options.disabled || c.$element.addClass(c.options.hoverClass + (c.mouseDown ? " " + c.options.activeClass :
          ""))
      }).on("mouseleave", function () {
        c.$element.removeClass(c.options.hoverClass + " " + c.options.activeClass);
        a(c.$element).off("mouseup", b)
      }).on("mousedown pointerdown", function () {
        if (!c.options.disabled) c.mouseDown = !0, c.$element.addClass(c.options.activeClass), a(c.$element).on("mouseup pointerup", b)
      });
      this.disabled(this.options.disabled)
    },
    disabled: function (a) {
      if (typeof a === "boolean") this.options.disabled = a, this.$element[a ? "addClass" : "removeClass"](this.options.disabledClass);
      return this.options.disabled
    }
  });
  a.fn.wpButton = function (a) {
    this.each(function () {
      new b.Widget.Button(this, a)
    });
    return this
  }
})(jQuery, WebPro, window, document);
(function (a, b) {
  b.widget("Widget.RadioGroup", b.Widget, {
    _widgetName: "radio-group",
    defaultOptions: {
      defaultIndex: 0,
      hoverClass: "wp-radio-hover",
      downClass: "wp-radio-down",
      disabledClass: "wp-radio-disabled",
      checkedClass: "wp-radio-checked",
      disabled: !1,
      toggleStateEnabled: !1
    },
    _attachBehavior: function () {
      var a = this;
      this.buttons = [];
      this.activeElement = null;
      this.activeIndex = -1;
      this.$element.each(function () {
        a.buttons.push(a._addButtonBehavior(this))
      });
      this.disabled(this.options.disabled)
    },
    _bpActivate: function () {
      if (-1 !=
        this.activeIndex) {
        var c = this._getElement(this.activeIndex);
        c && a(c).addClass(this.options.checkedClass)
      }
    },
    _bpDeactivate: function () {
      if (-1 != this.activeIndex) {
        var c = this._getElement(this.activeIndex);
        c && a(c).removeClass(this.options.checkedClass)
      }
    },
    _addButtonBehavior: function (a) {
      var d = this,
        g = new b.Widget.Button(a, {
          hoverClass: this.options.hoverClass,
          downClass: this.options.downClass,
          disabledClass: this.options.disabledClass,
          clickCallback: function (b) {
            return d._handleClick(b, g, a)
          },
          prevCallback: function (b) {
            return d._handlePrev(b,
              g, a)
          },
          nextCallback: function (b) {
            return d._handleNext(b, g, a)
          }
        });
      return g
    },
    _handlePrev: function () {
      if (!this.options.disabled) {
        if (this.activeIndex > this._getElementIndex(this.firstButton.$element[0])) this.activeIndex--;
        else if (this.activeIndex === this._getElementIndex(this.firstButton.$element[0]) || this.activeIndex === -1) this.activeIndex = this._getElementIndex(this.lastButton.$element[0]);
        this._getElementByIndex(this.activeIndex).focus();
        this.checkButton(this.activeIndex)
      }
    },
    _handleNext: function () {
      if (!this.options.disabled) {
        if (this.activeIndex <
          this.numButtons - 1) this.activeIndex++;
        else if (this.activeIndex === this.numButtons - 1) this.activeIndex = this._getElementIndex(this.firstButton.$element[0]);
        this._getElementByIndex(this.activeIndex).focus();
        this.checkButton(this.activeIndex)
      }
    },
    _handleClick: function (a, b, g) {
      this.options.disabled || this.checkButton(g)
    },
    _getElementIndex: function (c) {
      return c ? a.inArray(c, this.$element.get()) : -1
    },
    _getElementByIndex: function (a) {
      return a >= 0 ? this.$element.eq(a)[0] : null
    },
    _getElement: function (a) {
      return typeof a === "number" ?
        this._getElementByIndex(a) : a
    },
    checkButton: function (c) {
      var c = this._getElement(c),
        b = this.activeElement,
        g = this.options.checkedClass;
      c !== b ? (b && this.uncheckButton(b), c && a(c).addClass(g)) : this.options.toggleStateEnabled && c && (this.uncheckButton(c, g), c = null);
      this.activeElement = c;
      this.activeIndex = this._getElementIndex(c)
    },
    uncheckButton: function (c) {
      a(c).removeClass(this.options.checkedClass)
    },
    disabled: function (c) {
      if (typeof c === "boolean") this.disabled = c, a.each(this.buttons, function () {
        this.disabled(c)
      });
      return this.options.disabled
    }
  });
  a.fn.wpRadioGroup = function (a) {
    new b.Widget.RadioGroup(this, a);
    return this
  }
})(jQuery, WebPro, window, document);
(function (a, b) {
  b.widget("Widget.TabGroup", b.Widget.RadioGroup, {
    defaultOptions: {
      defaultIndex: 0,
      hoverClass: "wp-tab-hover",
      downClass: "wp-tab-down",
      disabledClass: "wp-tab-disabled",
      checkedClass: "wp-tab-active",
      disabled: !1,
      toggleStateEnabled: !1,
      isPopupButtonWidget: !1,
      parentSelectors: [".ThumbGroup", ".AccordionWidget", ".TabbedPanelsWidget"]
    },
    _attachBehavior: function () {
      this._super.prototype._attachBehavior.apply(this, arguments);
      this.isPopupButtonWidget = this.options.isPopupButtonWidget;
      this.numButtons = this.buttons.length;
      this.firstButton = this.buttons[0];
      this.lastButton = this.buttons[this.numButtons - 1];
      this.configureAria()
    },
    selectTab: function (a) {
      this.checkButton(a)
    },
    configureAria: function () {
      var c = this;
      if (this.options.isPopupButtonWidget === !0 || this.numButtons === 1) a.each(this.buttons, function () {
        this.$element.attr({
          role: "button",
          tabindex: "0",
          "aria-haspopup": "true"
        })
      }), this.isPopupButtonWidget = !0;
      else if (this.numButtons > 1) this.parentElement = this.buttons[0].$element.parents(this.options.parentSelectors.join()), this.parentElement.attr("role",
        "tablist"), a.each(this.buttons, function (a) {
        this.$element.attr({
          role: "tab",
          tabindex: "0"
        });
        a > 0 && c.uncheckButton(this.$element)
      })
    },
    checkButton: function (c) {
      var b = this._getElement(c),
        g = this._getElementIndex(b),
        g = {
          tab: b,
          tabIndex: g
        };
      this.trigger("wp-tab-before-select", g);
      this._super.prototype.checkButton.apply(this, arguments);
      a(b).attr({
        tabindex: "0"
      });
      this.options.contentLayout_runtime !== "lightbox" && a(b).attr({
        "aria-selected": "true"
      });
      this.trigger("wp-tab-select", g)
    },
    uncheckButton: function (c) {
      this._super.prototype.uncheckButton.apply(this,
        arguments);
      this.isPopupButtonWidget || (a(c).attr({
        tabindex: "-1"
      }), this.options.contentLayout_runtime !== "lightbox" && a(c).attr({
        "aria-selected": "false"
      }))
    }
  });
  a.fn.wpTabGroup = function (a) {
    new b.Widget.TabGroup(this, a);
    return this
  }
})(jQuery, WebPro, window, document);
(function (a, b) {
  b.widget("Widget.PanelGroup", b.Widget, {
    _widgetName: "panel-group",
    defaultOptions: {
      defaultIndex: 0,
      panelClass: "wp-panel",
      activeClass: "wp-panel-active",
      toggleStateEnabled: !1,
      tabGroups: null
    },
    _setUp: function () {
      var a = this;
      this.tabGroups = [];
      this._tabCallback = function (b, g) {
        a._handleTabSelect(b, g)
      };
      this.showLock = 0;
      this.tabDriver = null;
      return this._super.prototype._setUp.apply(this, arguments)
    },
    _bpActivate: function () {
      if (-1 != this.activeIndex) {
        var c = this._getElement(this.activeIndex);
        c && a(c).addClass(this.options.activeClass)
      }
    },
    _bpDeactivate: function () {
      if (-1 != this.activeIndex) {
        var c = this._getElement(this.activeIndex);
        c && a(c).removeClass(this.options.activeClass)
      }
    },
    _attachBehavior: function () {
      this.activeElement = null;
      this.activeIndex = -1;
      this.$element.addClass(this.options.panelClass);
      var a = this.options.defaultIndex;
      typeof a === "number" && a >= 0 && this.showPanel(a);
      this.addTabGroup(this.options.tabGroups)
    },
    _getElementIndex: function (c) {
      return c ? a.inArray(c, this.$element.get()) : -1
    },
    _getElementByIndex: function (a) {
      return this.$element.eq(a)[0]
    },
    _getElement: function (a) {
      return typeof a === "number" ? this._getElementByIndex(a) : a
    },
    configureAria: function (c) {
      a.each(this.$element, function (b, g) {
        a(g).attr({
          role: "tabpanel",
          "aria-labelledby": c.buttons[b].$element.attr("id")
        });
        c.buttons[b].$element.attr({
          "aria-controls": a(g).attr("id")
        })
      })
    },
    showPanel: function (c) {
      if (!this.showLock) {
        ++this.showLock;
        var b = this._getElement(c),
          g = this.activeElement,
          f = this.options.activeClass;
        if (b)
          if (b !== g) {
            c = {
              panel: b,
              panelIndex: this._getElementIndex(b)
            };
            this.trigger("wp-panel-before-show",
              c);
            g && this.hidePanel(g);
            a(b).addClass(f);
            this.activeElement = b;
            this.activeIndex = this._getElementIndex(b);
            b = this.tabGroups;
            for (g = 0; g < b.length; g++) f = b[g], f !== this.tabDriver && f.selectTab(this.activeIndex);
            this.trigger("wp-panel-show", c)
          } else this.options.toggleStateEnabled && this.hidePanel(b);
          --this.showLock
      }
    },
    hidePanel: function (c) {
      if (c = typeof c === "number" ? this.$element.eq(c)[0] : c) {
        var b = {
          panel: c,
          panelIndex: this._getElementIndex(c)
        };
        this.trigger("wp-panel-before-hide", b);
        a(c).removeClass(this.options.activeClass);
        if (c === this.activeElement) this.activeElement = null, this.activeIndex = -1;
        this.trigger("wp-panel-hide", b)
      }
    },
    _handleTabSelect: function (a, b) {
      if (!this.showLock) this.tabDriver = a.target, this.showPanel(b.tabIndex), this.tabDriver = null
    },
    addTabGroup: function (c) {
      if (c)
        for (var c = b.ensureArray(c), d = c.length, g = 0; g < d; g++) {
          var f = c[g];
          a.inArray(this.tabGroups, f) === -1 && (this.tabGroups.push(f), f.selectTab(this.activeIndex), f.unbind("wp-tab-select").bind("wp-tab-select", this._tabCallback), this.configureAria(f))
        }
    },
    removeTabGroup: function (c) {
      for (var c =
          b.ensureArray(c), d = c.length, g = 0; g < d; g++) {
        var f = c[g];
        sets = this.tabGroups;
        loc = a.inArray(sets, f);
        loc !== -1 && sets.splice(loc, 1)
      }
    }
  });
  a.fn.wpPanelGroup = function (a) {
    new b.Widget.PanelGroup(this, a);
    return this
  }
})(jQuery, WebPro, window, document);
(function (a, b) {
  b.widget("Widget.Disclosure", b.Widget, {
    defaultOptions: {
      widgetClassName: "wp-disclosure-panels",
      tabClassName: "wp-disclosure-panels-tab",
      tabHoverClassName: "wp-disclosure-panels-tab-hover",
      tabDownClassName: "wp-disclosure-panels-tab-down",
      panelClassName: "wp-disclosure-panels-panel",
      tabActiveClassName: "wp-disclosure-panels-tab-active",
      panelActiveClassName: "wp-disclosure-panels-panel-active",
      defaultIndex: 0,
      toggleStateEnabled: !1
    },
    _attachBehavior: function () {
      var a = this.$element[0],
        d = this.options.widgetClassName,
        g = b.scopedFind(a, "." + this.options.tabClassName, d, a),
        a = b.scopedFind(a, "." + this.options.panelClassName, d, a);
      this.tabs = new b.Widget.TabGroup(g, {
        hoverClass: this.options.tabHoverClassName,
        downClass: this.options.tabDownClassName,
        checkedClass: this.options.tabActiveClassName,
        toggleStateEnabled: this.options.toggleStateEnabled
      });
      this.panels = new b.Widget.PanelGroup(a, {
        panelClass: this.options.panelClassName,
        activeClass: this.options.panelActiveClassName,
        defaultIndex: this.options.defaultIndex,
        toggleStateEnabled: this.options.toggleStateEnabled
      });
      this.panels.addTabGroup(this.tabs)
    }
  });
  b.widget("Widget.TabbedPanels", b.Widget.Disclosure, {
    defaultOptions: {
      widgetClassName: "wp-tabbed-panels-panels",
      tabClassName: "wp-tabbed-panels-panels-tab",
      tabHoverClassName: "wp-tabbed-panels-panels-tab-hover",
      tabDownClassName: "wp-tabbed-panels-panels-tab-down",
      tabActiveClassName: "wp-tabbed-panels-panels-tab-active",
      panelClassName: "wp-tabbed-panels-panels-panel",
      panelActiveClassName: "wp-tabbed-panels-panels-panel-active",
      toggleStateEnabled: !1
    }
  });
  b.widget("Widget.Accordion",
    b.Widget.Disclosure, {
      defaultOptions: {
        widgetClassName: "wp-accordion",
        tabClassName: "wp-accordion-tab",
        tabHoverClassName: "wp-accordion-tab-hover",
        tabDownClassName: "wp-accordion-tab-down",
        tabActiveClassName: "wp-accordion-tab-active",
        panelClassName: "wp-accordion-panel",
        panelActiveClassName: "wp-accordion-panel-active",
        toggleStateEnabled: !1
      }
    })
})(jQuery, WebPro, window, document);
(function (a, b) {
  b.Widget.Disclosure.DisplayPropertyTransitionPlugin = {
    defaultOptions: {},
    initialize: function (c, b) {
      var g = this;
      a.extend(b, a.extend({}, g.defaultOptions, b));
      c.bind("attach-behavior", function () {
        g._attachBehavior(c)
      })
    },
    _attachBehavior: function (a) {
      var a = a.panels,
        b = a.$element,
        g = a.activeIndex;
      a.bind("wp-panel-show", function (a, b) {
        b.panel.style.display = "block"
      });
      a.bind("wp-panel-hide", function (a, b) {
        b.panel.style.display = "none"
      });
      b.each(function (a) {
        this.style.display = a !== g ? "none" : "block"
      })
    }
  };
  b.Widget.Disclosure.AccordionTransitionPlugin = {
    defaultOptions: {
      transitionDirection: "vertical",
      transitionDuration: 500,
      dispatchTransitionEvents: !0
    },
    initialize: function (b, d) {
      var g = this;
      a.extend(d, a.extend({}, g.defaultOptions, d));
      b.bind("attach-behavior", function () {
        g._attachBehavior(b)
      }).bind("bp-activate", function () {
        g._bpActivate(b)
      }).bind("bp-deactivate", function () {
        g._bpDeactivate(b)
      })
    },
    _bpActivate: function (a) {
      if (-1 != a.panels.activeIndex) {
        var b = a.options,
          g = b.tabActiveClassName,
          b = b.transitionDirection,
          f = a.panels.activeIndex,
          a = a.panels.$element,
          j = {
            overflow: "hidden"
          };
        if (b === "vertical" || b === "both") j.height = "auto";
        if (b === "horizontal" || b === "both") j.width = "auto";
        a.eq(f).addClass(g).css(j)
      }
    },
    _bpDeactivate: function (b) {
      var d = b.options,
        g = d.tabActiveClassName,
        f = d.transitionDirection;
      b.panels.$element.each(function () {
        var b = {
          overflow: "hidden"
        };
        if (f === "vertical" || f === "both") b.height = "0";
        if (f === "horizontal" || f === "both") b.width = "0";
        a(this).css(b).removeClass(g)
      })
    },
    _attachBehavior: function (b) {
      var d = this,
        g = b.panels,
        f = g.$element,
        j = g.activeIndex,
        h = b.options.transitionDirection,
        i = b.options.widgetClassName === "AccordionWidget" ? a(f[0]).closest("*[data-rotate]") : null;
      if (i && i.length > 0) b.options.marginBottom = Muse.Utils.getCSSIntValue(i, "margin-bottom"), b.options.originalHeight = i[0].scrollHeight;
      b.options.rotatedAccordion = i;
      g.bind("wp-panel-show", function (a, f) {
        d._showPanel(b, f)
      });
      g.bind("wp-panel-hide", function (a, f) {
        d._hidePanel(b, f)
      });
      f.each(function (b) {
        var b = b === j,
          c = {};
        c.overflow = b ? "" : "hidden";
        if (h === "vertical" || h === "both") c.height = b ? "auto" : "0";
        if (h === "horizontal" || h === "both") c.width =
          b ? "auto" : "0";
        a(this).css(c)
      })
    },
    _updateMarginBottomForRotatedAccordion: function (a) {
      a.options.rotatedAccordion.css("margin-bottom", Math.round(a.options.marginBottom - (a.options.rotatedAccordion[0].scrollHeight - a.options.originalHeight)) + "px")
    },
    _transitionPanel: function (b, d, g) {
      a("body").trigger("wp-page-height-change", d - b);
      if ((b = g.options.rotatedAccordion) && b.length > 0) {
        if (g.options.originalHeight == 0 && "undefined" !== typeof d) g.options.marginBottom = Muse.Utils.getCSSIntValue(b, "margin-bottom"), g.options.originalHeight =
          b[0].scrollHeight;
        this._updateMarginBottomForRotatedAccordion(g)
      }
    },
    _showPanel: function (b, d) {
      if (!b.$bp || b.$bp.hasClass("active")) {
        var g = b.options,
          f = g.transitionDirection,
          j = a(d.panel),
          h = {},
          i = g.dispatchTransitionEvents,
          k = this,
          l = j.height(),
          m = function (a) {
            a = parseInt(a.elem.style.height);
            k._transitionPanel(l, a, b);
            l = a
          };
        if (f === "vertical" || f === "both") h.height = j[0].scrollHeight + "px";
        if (f === "horizontal" || f === "both") h.width = j[0].scrollWidth + "px";
        j.stop(!0, !0).queue("animationFrameFx", a.animationFrameFx).animate(h, {
          duration: g.transitionDuration,
          progress: i ? m : null,
          queue: "animationFrameFx",
          complete: function () {
            var a = {
              overflow: ""
            };
            if (f === "vertical" || f === "both") a.height = "auto";
            if (f === "horizontal" || f === "both") a.width = "auto";
            j.css(a);
            (a = b.options.rotatedAccordion) && a.length > 0 && k._updateMarginBottomForRotatedAccordion(b)
          }
        }).dequeue("animationFrameFx")
      }
    },
    _hidePanel: function (b, d) {
      if (!b.$bp || b.$bp.hasClass("active")) {
        var g = b.options,
          f = g.transitionDirection,
          j = a(d.panel),
          h = {},
          i = g.dispatchTransitionEvents,
          k = this,
          l = j.height(),
          m = function (a) {
            a = parseInt(a.elem.style.height);
            k._transitionPanel(l, a, b);
            l = a
          };
        if (f === "vertical" || f === "both") h.height = "0";
        if (f === "horizontal" || f === "both") h.width = "0";
        j.stop(!0, !0).queue("animationFrameFx", a.animationFrameFx).animate(h, {
          duration: g.transitionDuration,
          queue: "animationFrameFx",
          progress: i ? m : null,
          complete: function () {
            j.css("overflow", "hidden");
            var a = b.options.rotatedAccordion;
            a && a.length > 0 && k._updateMarginBottomForRotatedAccordion(b)
          }
        }).dequeue("animationFrameFx")
      }
    }
  }
})(jQuery, WebPro, window,
  document);
(function (a, b) {
  b.widget("Widget.SlideShowBase", b.Widget, {
    _widgetName: "slideshow-base",
    defaultOptions: {
      displayInterval: 6E3,
      autoPlay: !1,
      loop: !0,
      playOnce: !1
    },
    _setUp: function () {
      var a = this;
      this._ssTimer = 0;
      this._ssTimerTriggered = !1;
      this._ssTimerCallback = function () {
        a._ssTimerTriggered = !0;
        a.next();
        a._ssTimerTriggered = !1
      };
      return b.Widget.prototype._setUp.apply(this, arguments)
    },
    _ready: function () {
      this.options.autoPlay && this.play()
    },
    play: function (a) {
      e = this.trigger("wp-slideshow-before-play");
      e.isDefaultPrevented() || (this._startTimer(!1,
        a), this.trigger("wp-slideshow-play"))
    },
    stop: function () {
      e = this.trigger("wp-slideshow-before-stop");
      e.isDefaultPrevented() || (this._stopTimer(), this.trigger("wp-slideshow-stop"))
    },
    isPlaying: function () {
      return this._ssTimer !== 0
    },
    _startTimer: function (a, b) {
      this._stopTimer();
      var g = b ? 0 : this.options.displayInterval;
      a && (g += this.options.transitionDuration);
      this._ssTimer = setTimeout(this._ssTimerCallback, g)
    },
    _stopTimer: function () {
      this._ssTimer && clearTimeout(this._ssTimer);
      this._ssTimer = 0
    },
    _executeCall: function (a,
      b) {
      e = this.trigger("wp-slideshow-before-" + a);
      e.isDefaultPrevented() || (this["_" + a].apply(this, b) && this.stop(), this.isPlaying() && this._startTimer(!0), this.trigger("wp-slideshow-" + a))
    },
    first: function () {
      return this._executeCall("first", arguments)
    },
    last: function () {
      return this._executeCall("last", arguments)
    },
    previous: function () {
      return this._executeCall("previous", arguments)
    },
    next: function () {
      return this._executeCall("next", arguments)
    },
    goTo: function () {
      return this._executeCall("goTo", arguments)
    },
    close: function () {
      return this._executeCall("close",
        arguments)
    },
    _first: function () {},
    _last: function () {},
    _previous: function () {},
    _next: function () {},
    _goTo: function () {},
    _close: function () {}
  })
})(jQuery, WebPro, window, document);
(function (a, b) {
  b.widget("Widget.ContentSlideShow", b.Widget.SlideShowBase, {
    _widgetName: "content-slideshow",
    defaultOptions: {
      slideshowClassName: "wp-slideshow",
      clipClassName: "wp-slideshow-clip",
      viewClassName: "wp-slideshow-view",
      slideClassName: "wp-slideshow-slide",
      slideLinkClassName: "wp-slideshow-slide-link",
      firstBtnClassName: "wp-slideshow-first-btn",
      lastBtnClassName: "wp-slideshow-last-btn",
      prevBtnClassName: "wp-slideshow-prev-btn",
      nextBtnClassName: "wp-slideshow-next-btn",
      playBtnClassName: "wp-slideshow-play-btn",
      stopBtnClassName: "wp-slideshow-stop-btn",
      closeBtnClassName: "wp-slideshow-close-btn",
      playingClassName: "wp-slideshow-playing"
    },
    _findWidgetElements: function (a) {
      var d = this.$element[0];
      return b.scopedFind(d, a, this.options.slideshowClassName, d)
    },
    _attachBtnHandler: function (a, b) {
      var g = this;
      this["$" + b + "Btn"] = this._findWidgetElements("." + a).attr({
        tabindex: "0",
        role: "button",
        "aria-label": b
      }).unbind("keydown").bind("keydown", function (a) {
        var c = a.keyCode || a.which;
        if (c === 32 || c === 13) g[b](), a.preventDefault()
      }).unbind("click").bind("click",
        function (a) {
          g[b]();
          a.preventDefault()
        })
    },
    _getAjaxSrcForImage: function (a) {
      return a.data("src")
    },
    _reprioritizeImageLoadingIfRequired: function (b) {
      !this._isLoaded(b) && this._cssilLoader && !this._cssilLoader.isQueueEmpty() && (b = a(this.slides.$element[b]), this._cssilLoader.reprioritize(this._getAjaxSrcForImage(b.is("img") ? b : b.find("img")), this.isPlaying()))
    },
    _bpActivate: function () {
      this.slides.bind("wp-panel-show", this._panelShowCallback)
    },
    _bpDeactivate: function () {
      this.slides.unbind("wp-panel-show").unbind("wp-panel-before-show").unbind("wp-panel-hide").unbind("wp-panel-before-hide");
      this.unbind("wp-slideshow-play").unbind("wp-slideshow-stop");
      this.tabs && this.tabs.trigger("wp-panel-hide", {
        panelIndex: this.slides.activeIndex
      })
    },
    _attachBehavior: function () {
      var a = this,
        d = this.options;
      this._super.prototype._attachBehavior.call(this);
      this._panelShowCallback = function () {
        a._ssTimerTriggered || a.isPlaying() && a._startTimer(!1)
      };
      this.$element.addClass(d.slideshowClassName);
      var g = this.slides ? this.slides.$element : this._findWidgetElements("." + d.slideClassName),
        f = this.tabs ? this.tabs.$element : this._findWidgetElements("." +
          d.slideLinkClassName),
        j = d.event === "click" && d.deactivationEvent === "mouseout_click";
      if (!this.slides && (this.slides = new b.Widget.PanelGroup(g, {
          defaultIndex: this.slides && this.slides.activeIndex || d.defaultIndex || 0,
          toggleStateEnabled: j
        }), this.slides.bind("wp-panel-show", this._panelShowCallback), this.tabs = null, f.length)) this.tabs = new b.Widget.TabGroup(f, {
        defaultIndex: this.tabs && this.tabs.activeIndex || d.defaultIndex || 0,
        toggleStateEnabled: j,
        contentLayout_runtime: d.contentLayout_runtime
      }), this.slides.addTabGroup(this.tabs);
      this.slides.bind("wp-panel-before-show", function (b, f) {
        a._reprioritizeImageLoadingIfRequired(f.panelIndex)
      });
      this._attachBtnHandler(d.firstBtnClassName, "first");
      this._attachBtnHandler(d.lastBtnClassName, "last");
      this._attachBtnHandler(d.prevBtnClassName, "previous");
      this._attachBtnHandler(d.nextBtnClassName, "next");
      this._attachBtnHandler(d.playBtnClassName, "play");
      this._attachBtnHandler(d.stopBtnClassName, "stop");
      this._attachBtnHandler(d.closeBtnClassName, "close");
      this.bind("wp-slideshow-play", function () {
        this.$element.addClass(d.playingClassName)
      });
      this.bind("wp-slideshow-stop", function () {
        this.$element.removeClass(d.playingClassName)
      })
    },
    _first: function () {
      this.slides.showPanel(0)
    },
    _last: function () {
      var a = this.slides;
      a.showPanel(a.$element.length - 1)
    },
    _previous: function () {
      var a = this.slides,
        b = a.$element.length,
        g = a.activeIndex,
        b = (g < 1 ? b : g) - 1;
      !this.options.loop && 0 == g ? this.isPlaying() && this.stop() : a.showPanel(b)
    },
    _next: function () {
      var a = this.slides,
        b = a.activeIndex,
        g = (b + 1) % a.$element.length;
      !this.options.loop && 0 == g ? this.isPlaying() && this.stop() : this.options.playOnce &&
        0 == g && this.isPlaying() ? this.stop() : (!this.isPlaying() || this._isLoaded(b) && this._isLoaded(g)) && a.showPanel(g)
    },
    _goTo: function () {
      var a = this.slides;
      a.showPanel.apply(a, arguments)
    },
    _close: function () {
      var a = this.slides;
      a.hidePanel(a.activeElement)
    },
    _isLoaded: function (b) {
      if (this._csspIsImageSlideShow && (b = a(this.slides.$element[b]), b = b.is("img") ? b : b.find("img"), b.length > 0 && (b.hasClass(this.options.imageIncludeClassName) || !b[0].complete))) return !1;
      return !0
    }
  })
})(jQuery, WebPro, window, document);
(function (a, b, c, d, g) {
  b.Widget.ContentSlideShow.fadingTransitionPlugin = {
    defaultOptions: {
      transitionDuration: 500
    },
    initialize: function (b, c) {
      var d = this;
      a.extend(c, a.extend({}, d.defaultOptions, c));
      b.bind("attach-behavior", function () {
        d.attachBehavior(b)
      })
    },
    attachBehavior: function (f) {
      var j = this,
        h = f.slides,
        i = h.$element,
        k = h.activeIndex,
        l = f._findWidgetElements("." + f.options.viewClassName);
      0 == l.length && f._$sslbpOverlay && (l = a("." + f.options.viewClassName, f._$sslbpOverlay));
      h.bind("wp-panel-show", function (b, c) {
        j._showElement(f,
          a(c.panel));
        f.options.contentLayout_runtime === "stack" && j._showElement(f, f.$closeBtn)
      }).bind("wp-panel-hide", function (b, c) {
        j._hideElement(f, a(c.panel))
      });
      f.options.contentLayout_runtime === "stack" && f.bind("wp-slideshow-close", function () {
        j._hideElement(f, f.$closeBtn)
      });
      for (var m = 0; m < i.length; m++)
        if (m !== k) i[m].style.display = "none";
      if (f.options.elastic === "fullWidth") {
        var o = a(c),
          r = a(d.body),
          p = function (b) {
            b === g && (b = Math.max(o.width(), parseInt(r.css("min-width"))));
            f.options.contentLayout_runtime !== "lightbox" &&
              l.css("left", l.position().left - l.offset().left);
            l.width(b);
            j._showElement(f, a(h.activeElement))
          };
        p();
        for (m = 0; m < i.length; m++) {
          var n = a(i[m]);
          n.width("100%");
          n.addClass("borderbox")
        }
        if (f.options.contentLayout_runtime === "lightbox") f._fstpPositionSlides = p;
        else o.on("orientationchange resize", function () {
          p()
        })
      }
      k === -1 && f.options.contentLayout_runtime === "stack" && f.$closeBtn.hide();
      if (Muse.Browser.Features.Touch && f.options.enableSwipe === !0) {
        l.addClass("horizontalSlideShow");
        var t = f.options.transitionDuration;
        f._ftpSwipeNoInterrupt = !1;
        i.each(function () {
          var c = a(this);
          c.data("opacity", c.css("opacity"));
          var d = Muse.Utils.getCanvasDirection(c, "horizontal"),
            g = d.dir === "horizontal",
            h = d.reverse;
          if (d = c.swipe.defaults.excludedElements) {
            var d = d.split(/\s*,\s*/),
              k = d.indexOf("a");
            if (0 <= k) d.splice(k, 1), c.swipe.defaults.excludedElements = d.join(", ")
          }
          c.swipe({
            triggerOnTouchEnd: !0,
            allowPageScroll: g ? "vertical" : "horizontal",
            threshold: 75,
            swipeStatus: function (a, d, k, o) {
              if (d == "start") f.stop();
              else if (d == "move" && (g && (k == "left" ||
                  k == "right") || !g && (k == "up" || k == "down"))) !b.hasPointerCapture() && Math.abs(o) > 1 && b.setPointerCapture(c[0], a), j._scrollTo(f, -1, o * (!h && (k == "left" || k == "up") || h && (k == "right" || k == "down") ? 1 : -1), 0);
              else if (d == "cancel") j._scrollTo(f, f.slides.activeIndex, 0, t), b.releasePointerCapture(c[0], a), f.trigger("wp-swiped");
              else if (d == "end") {
                d = f.slides.activeIndex;
                o = -1;
                if (g && (k == "right" && !h || k == "left" && h) || !g && (k == "down" && !h || k == "up" && h)) o = d - 1 < 0 ? i.length - 1 : d - 1;
                else if (g && (k == "left" && !h || k == "right" && h) || !g && (k == "up" && !h ||
                    k == "down" && h)) o = d + 1 > i.length - 1 ? 0 : d + 1;
                o != -1 && j._scrollTo(f, o, 0, t);
                b.releasePointerCapture(c[0], a);
                f.trigger("wp-swiped")
              }
            }
          })
        })
      }
    },
    _showElement: function (a, b) {
      var c = !1,
        d = function () {
          c || (c = !0, b.show().css("opacity", ""))
        },
        g = setTimeout(d, a.options.transitionDuration + 10);
      b.stop(!1, !0).fadeIn(a.options.transitionDuration, function () {
        clearTimeout(g);
        d()
      })
    },
    _hideElement: function (a, b) {
      var c = !1,
        d = function () {
          c || (c = !0, b.hide().css("opacity", ""))
        },
        g = setTimeout(d, a.options.transitionDuration + 10);
      b.stop(!1, !0).fadeOut(a.options.transitionDuration,
        function () {
          clearTimeout(g);
          d()
        })
    },
    _scrollTo: function (b, c, d, g) {
      if (!b._ftpSwipeNoInterrupt) {
        var k = b.slides.$element,
          l = b.slides.activeIndex,
          m = c == -1;
        c == -1 && (c = d < 0 ? l - 1 < 0 ? k.length - 1 : l - 1 : l + 1 > k.length - 1 ? 0 : l + 1);
        var o = a(k[l]),
          r = a(k[c]);
        if (!m && d == 0 || l == c) {
          b._ftpSwipeNoInterrupt = !0;
          var p = 0,
            n = !1,
            t = function () {
              if (!n && (n = !0, r.show().css("opacity", ""), c != l && b.slides.showPanel(c), ++p == k.length)) b._ftpSwipeNoInterrupt = !1
            };
          if (r.css("opacity") != r.data("opacity")) {
            var q = setTimeout(t, g + 10);
            r.stop(!1, !0).animate({
                opacity: r.data("opacity")
              },
              g,
              function () {
                clearTimeout(q);
                t()
              })
          } else t();
          k.each(function (d) {
            var h = a(this),
              o = !1,
              l = function () {
                if (!o && (o = !0, h.hide().css("opacity", ""), ++p == k.length)) b._ftpSwipeNoInterrupt = !1
              },
              n;
            d != c && (h.css("display") != "none" && h.css("opacity") != 0 ? (n = setTimeout(l, g + 10), h.stop(!1, !0).animate({
              opacity: 0
            }, g, function () {
              clearTimeout(n);
              l()
            })) : l())
          })
        } else d = Math.abs(d), m = o.width(), d > m && (d = m), d = r.data("opacity") * (d / m), m = o.data("opacity") * (1 - d), o.stop(!1, !0).animate({
          opacity: m
        }, g), r.stop(!1, !0).show().animate({
            opacity: d
          },
          g)
      }
    }
  };
  b.Widget.ContentSlideShow.filmstripTransitionPlugin = {
    defaultOptions: {
      transitionDuration: 500,
      transitionStyle: "horizontal"
    },
    initialize: function (b, c) {
      var d = this;
      a.extend(c, a.extend({}, d.defaultOptions, c));
      b.bind("attach-behavior", function () {
        d.attachBehavior(b)
      }).bind("bp_activate", function () {
        d.bpActivate(b)
      }).bind("bp-deactivate", function () {
        d.bpDeactivate(b)
      })
    },
    bpActivate: function (a) {
      plugin._goToSlide(a, a.slides.activeElement, a.options.transitionDuration)
    },
    bpDeactivate: function (a) {
      a.slides.unbind("wp-panel-show").unbind("wp-panel-hide");
      a.unbind("wp-slideshow-before-previous").unbind("wp-slideshow-before-next").unbind("wp-slideshow-previous").unbind("wp-slideshow-next")
    },
    attachBehavior: function (f) {
      var j = this,
        h = a(c),
        i = a(d.body),
        k = f.options,
        l = function () {
          return k.elastic === "fullWidth" ? Math.max(h.width(), parseInt(i.css("min-width"))) : p.width()
        },
        m = k.transitionStyle === "horizontal",
        o = f.slides,
        r = o.$element,
        p = f._findWidgetElements("." + k.clipClassName),
        n = f._findWidgetElements("." + k.viewClassName),
        t = l(),
        q = p.height(),
        y = {
          left: 1,
          right: 1
        },
        C = {
          up: 1,
          down: 1
        },
        w = {
          top: "0",
          left: "0"
        },
        v = p.css("position");
      v !== "absolute" && v !== "fixed" && k.elastic !== "fullScreen" && p.css("position", "relative");
      n.css("position") !== "absolute" && (w.position = "relative");
      f._fstpOffsetSize = m ? l() : p.height();
      f._fstp$Clip = p;
      f._fstp$View = n;
      f._fstpStyleProp = m ? "left" : "top";
      f._fstpStylePropZero = m ? "top" : "left";
      o.bind("wp-panel-show", function (a, b) {
        j._goToSlide(f, b.panel, k.transitionDuration);
        f.options.contentLayout_runtime === "stack" && f.$closeBtn.stop(!0).fadeIn(k.transitionDuration)
      });
      f.options.contentLayout_runtime ===
        "stack" && f.bind("wp-slideshow-close", function () {
          p.css({
            opacity: 0.99
          }).stop(!0).animate({
            opacity: 0
          }, {
            queue: !1,
            duration: k.transitionDuration,
            complete: function () {
              w[f._fstpStyleProp] = (m ? p.width() : p.height()) + "px";
              w[f._fstpStylePropZero] = "0";
              n.css(w);
              p.css({
                opacity: ""
              })
            }
          });
          f.$closeBtn.stop(!0).fadeOut(k.transitionDuration)
        });
      f._fstpRequestType = null;
      f.bind("wp-slideshow-before-previous wp-slideshow-before-next", function (a) {
        f._fstpRequestType = a.type.replace(/.*-/, "");
        f._fstpOldActiveIndex = f.slides.activeIndex
      }).bind("wp-slideshow-previous wp-slideshow-next",
        function () {
          f._fstpRequestType = null;
          f._fstpOldActiveIndex = -1
        });
      var D = function (a, b) {
          if (a === g || b === g) a = l(), b = p.height();
          k.elastic === "fullWidth" && (b = p.height(), p.width(a), k.contentLayout_runtime !== "lightbox" && p.css("left", p.position().left - p.offset().left), n.width(a));
          for (var c = 0, d = m ? a : b, h = f._fstpStyleProp, i = f._fstpStylePropZero, q = 0; q < r.length; q++) {
            var v = r[q].style;
            v[i] = "0";
            v[h] = c + "px";
            v.margin = "0";
            v.position = "absolute";
            c += d
          }
          j._goToSlide(f, o.activeElement, 0);
          return c
        },
        v = D();
      if (k.elastic === "fullWidth")
        for (var z =
            0; z < r.length; z++) {
          var s = a(r[z]);
          s.width("100%");
          s.addClass("borderbox")
        }
      if (k.elastic !== "off")
        if (k.contentLayout_runtime === "lightbox") f._fstpPositionSlides = D;
        else h.on("orientationchange resize", function () {
          D()
        });
      else w[m ? "width" : "height"] = v + "px", w[m ? "height" : "width"] = (m ? q : t) + "px";
      o.activeElement || (w[f._fstpStyleProp] = (m ? t : q) + "px", w[f._fstpStylePropZero] = "0", f.options.contentLayout_runtime === "stack" && f.$closeBtn.hide());
      w.overflow = "visible";
      n.css(w);
      j._goToSlide(f, o.activeElement, k.transitionDuration);
      Muse.Browser.Features.Touch && f.options.enableSwipe === !0 && (a(this), m ? n.addClass("horizontalSlideShow") : n.addClass("verticalSlideShow"), n.swipe({
        triggerOnTouchEnd: !0,
        allowPageScroll: m ? "vertical" : "horizontal",
        threshold: 75,
        swipeStatus: function (a, c, d, g) {
          var h = Muse.Utils.getCanvasDirection(n, k.transitionStyle).reverse,
            h = !h && (d == "left" || d == "up") || h && (d == "right" || d == "down") ? 1 : -1;
          switch (c) {
          case "start":
            f.stop();
            break;
          case "move":
            if (m && d in y || !m && d in C) !b.hasPointerCapture() && Math.abs(g) > 1 && b.setPointerCapture(n[0],
              a), j._scrollBy(f, g * h);
            break;
          case "cancel":
            j._goToSlide(f, o.activeElement, 0);
            b.releasePointerCapture(n[0], a);
            f.trigger("wp-swiped");
            break;
          case "end":
            j._finalizeSwipe(f, f._fstpOffsetSize * f.slides.activeIndex + g * h, h, d), b.releasePointerCapture(n[0], a)
          }
        }
      }))
    },
    _scrollBy: function (a, b) {
      var c = a._fstp$View,
        d = a.slides.activeIndex * -a._fstpOffsetSize,
        g = a._fstpStyleProp,
        l = {};
      c.stop(!1, !0);
      l[g] = d - b + "px";
      c.css(l)
    },
    _finalizeSwipe: function (a, b, c) {
      var d = a.slides,
        g = a._fstp$View,
        l = b / a._fstpOffsetSize,
        b = a._fstpStyleProp,
        m = {},
        l = c === 1 ? Math.ceil(l) : Math.floor(l),
        l = Math.max(0, Math.min(l, d.$element.length - 1));
      m[b] = -(l * a._fstpOffsetSize) + "px";
      g.animate(m, a.options.transitionDuration, function () {
        d.showPanel(l);
        a.trigger("wp-swiped")
      })
    },
    _goToSlide: function (b, c, d) {
      if (b) {
        var g = a(c),
          k = b._fstp$View,
          l = b._fstpStyleProp,
          m = l === "left" ? "offsetLeft" : "offsetTop",
          o = l === "left" ? "offsetWidth" : "offsetHeight",
          r = c ? -c[m] : b._fstp$Clip[0][o],
          p = {};
        p[l] = r + "px";
        var n = b._fstpRequestType,
          t = b._fstpOldActiveIndex;
        if (n && t !== -1) {
          var q = b.slides.activeIndex,
            y = b.slides.$element.length - 1;
          if (q !== t) {
            var C = 0;
            n === "previous" && t === 0 && q === y ? C = -c[o] : n === "next" && t === y && q === 0 && (b = b.slides.$element[t], C = b[m] + b[o]);
            C && (p[l] = -C + "px", g.css(l, C + "px"))
          }
        }
        k.stop(!1, !0).animate(p, d, function () {
          C && (g.css(l, -r + "px"), k.css(l, r + "px"))
        })
      }
    }
  };
  b.Widget.ContentSlideShow.alignPartsToPagePlugin = {
    defaultOptions: {
      alignPartToPageClassName: "wp-slideshow-align-part-to-page"
    },
    initialize: function (b, c) {
      var d = this;
      a.extend(c, a.extend({}, d.defaultOptions, c));
      b.bind("attach-behavior", function () {
        d.attachBehavior(b)
      })
    },
    attachBehavior: function (b) {
      if (!("fullWidth" !== b.options.elastic || !b.$element.hasClass("align_parts_to_page") || "fixed" !== b.$element.css("position") || b.options.contentLayout_runtime === "lightbox")) {
        var d = a(c),
          g = a("#page"),
          i = b.options,
          k = function () {
            var c = g.offset().left + "px";
            a("." + i.alignPartToPageClassName, b.$element).each(function () {
              a(this).css("margin-left", c)
            })
          };
        b.$element.children().each(function () {
          var b = a(this);
          0 < a("." + i.viewClassName, b).length || b.addClass(i.alignPartToPageClassName)
        });
        k();
        d.on("orientationchange resize",
          function () {
            k()
          })
      }
    }
  };
  b.Widget.ContentSlideShow.slideImageIncludePlugin = {
    defaultOptions: {
      imageIncludeClassName: "wp-slideshow-slide-image-include",
      slideLoadingClassName: "wp-slideshow-slide-loading"
    },
    initialize: function (c, d) {
      var g = this;
      a.extend(d, a.extend({}, g.defaultOptions, d));
      c._cssilLoader = new b.ImageLoader;
      c.bind("attach-behavior", function () {
        g._attachBehavior(c)
      })
    },
    _attachBehavior: function (a) {
      for (var b = this, c = a._cssilLoader, d = a._findWidgetElements("." + a.options.slideClassName), g = d.length, l = "." + a.options.imageIncludeClassName,
          m = a.options.slideLoadingClassName, o = function (c, d, g, h) {
            b._handleImageLoad(a, c, d, g, h)
          }, r = 0; r < g; r++) {
        var p = d.eq(a._shuffleArray ? a._shuffleArray[r] : r),
          n = p.is("img") ? p : p.find(l),
          t = n[0];
        if (t) {
          var q = a._getAjaxSrcForImage(n) || t.href;
          if (q) n = {
            width: n.data("width"),
            height: n.data("height"),
            $ele: n,
            $slide: p
          }, t.style.visibility = "hidden", c.add(q, {
            callback: o,
            data: n
          }), p.addClass(m)
        }
      }
      a._cssilLoader.start()
    },
    _handleImageLoad: function (a, b, c, d, g) {
      var l = g.$ele,
        m = l[0];
      m.src = b;
      a.options.elastic !== "off" ? (l.data("imageWidth",
        c), l.data("imageHeight", d), a._csspPositionImage(m, a.options.heroFitting, a.options.elastic, c, d)) : (m.width = g.width || c, m.height = g.height || d);
      m.style.visibility = "";
      l.removeClass(a.options.imageIncludeClassName);
      g.$slide.removeClass(a.options.slideLoadingClassName);
      a.isPlaying() && a.slides.$element[a.slides.activeIndex] == g.$slide[0] && a._startTimer(!1)
    }
  };
  b.Widget.ContentSlideShow.shufflePlayPlugin = {
    defaultOptions: {
      randomDefaultIndex: !0
    },
    initialize: function (b, c) {
      var d = this;
      a.extend(c, a.extend({}, d.defaultOptions,
        c));
      b._shuffleArray = [];
      b._shuffleNextDict = {};
      b._realNext = b._next;
      b._next = function () {
        d._handleNext(b)
      };
      b._shufflePlayCount = 1;
      b.bind("before-attach-behavior", function () {
        d._reshuffle(b);
        if (c.randomDefaultIndex && typeof c.defaultIndex === "undefined") b.options.defaultIndex = b._shuffleArray[0]
      })
    },
    _fisherYatesArrayShuffle: function (a) {
      if (a && a.length)
        for (var b = a.length; --b;) {
          var c = Math.floor(Math.random() * (b + 1)),
            d = a[c];
          a[c] = a[b];
          a[b] = d
        }
    },
    _reshuffle: function (a) {
      var b = a._shuffleArray,
        c = {},
        d = a.slides ? a.slides.$element.length :
        a._findWidgetElements("." + a.options.slideClassName).length;
      if (b.length !== d)
        for (var g = b.length = 0; g < d; g++) b[g] = g;
      this._fisherYatesArrayShuffle(b);
      for (g = 0; g < d; g++) c[b[g]] = b[(g + 1) % d];
      a._shuffleNextDict = c;
      a._shufflePlayCount = 1
    },
    _handleNext: function (a) {
      if (a.isPlaying()) {
        var b = a.slides.activeIndex,
          c = a._shuffleNextDict[b] || 0;
        a._isLoaded(b) && a._isLoaded(c) && (a._goTo(c), ++a._shufflePlayCount >= a.slides.$element.length && (this._reshuffle(a), (!a.options.loop || a.options.playOnce) && a.stop()))
      } else a._realNext()
    }
  }
})(jQuery,
  WebPro, window, document);
(function (a, b, c) {
  b.widget("Widget.Form", b.Widget, {
    _widgetName: "form",
    defaultOptions: {
      validationEvent: "blur",
      errorStateSensitivity: "low",
      ajaxSubmit: !0,
      fieldWrapperClass: "field",
      formErrorClass: "form-error",
      formSubmittedClass: "form-submitted",
      formDeliveredClass: "form-delivered",
      focusClass: "focus",
      notEmptyClass: "not-empty",
      emptyClass: "empty",
      validClass: "valid",
      invalidClass: "invalid",
      requiredClass: "required"
    },
    validationTypes: {
      "always-valid": /.*/,
      email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      alpha: /^[A-z\s]+$/,
      numeric: /^[0-9]+$/,
      phone: /^([0-9])?(\s)?(\([0-9]{3}\)|[0-9]{3}(\-)?)(\s)?[0-9]{3}(\s|\-)?[0-9]{4}(\s|\sext|\sx)?(\s)?[0-9]*$/,
      captcha: function (a) {
        return a.data("captchaValid")
      },
      recaptcha: function () {
        if ("undefined" == typeof Recaptcha) return !1;
        var a = Recaptcha.get_response();
        return a && 0 < a.length
      },
      checkbox: function () {
        return !0
      },
      checkboxgroup: function () {
        return !0
      },
      radio: function () {
        return !0
      },
      radiogroup: function () {
        return !0
      },
      time: function (a) {
        var a = a.find("input, textarea"),
          b = a.val().replace(/[^0-9:APM]/g, "");
        if (b.indexOf(":") != -1 && b.match(/:/).length == 1) {
          var c = b.split(":"),
            j = parseInt(c[0]),
            c = parseInt(c[1]);
          if (j < 0 || j > 24) return !0;
          if (c < 0 || c > 59) return !0
        } else return !1;
        a.val(b);
        return !0
      }
    },
    _transformMarkup: function () {
      var b = this;
      b.hasCAPTCHA = !1;
      b.hasReCAPTCHA = !1;
      this.$element.find("." + this.options.fieldWrapperClass).each(function () {
        var c = a(this);
        switch (c.attr("data-type")) {
        case "captcha":
          b.hasCAPTCHA = !0;
          c.find('input[name="CaptchaV2"]').remove();
          c.find('input[name="muse_CaptchaV2"]').attr("name", "CaptchaV2");
          break;
        case "recaptcha":
          b.hasReCAPTCHA = !0
        }
      })
    },
    _extractData: function () {
      this.event = this.options.validationEvent;
      this.errorSensitivity = this.options.errorStateSensitivity;
      this.classNames = {
        focus: this.options.focusClass,
        blur: this.options.emptyClass,
        keydown: this.options.notEmptyClass
      }
    },
    _isEmpty: function (b) {
      var c = b.find("input, textarea");
      switch (b.data("type")) {
      case "checkboxgroup":
      case "radiogroup":
        return b = c.attr("name"), a('input[name="' + b + '"]:checked').length == 0;
      case "checkbox":
      case "radio":
        return typeof c.attr("checked") ===
          "undefined";
      default:
        return c.val() == ""
      }
    },
    _getGroupField: function (b) {
      switch (b.data("type")) {
      case "radio":
        return b.parent().closest("." + this.options.fieldWrapperClass).filter(function () {
          return "radiogroup" == a(this).data("type")
        });
      case "checkbox":
        return b.parent().closest("." + this.options.fieldWrapperClass).filter(function () {
          return "checkboxgroup" == a(this).data("type")
        })
      }
      return null
    },
    _updateReCaptchaChallenge: function () {
      var b = a("#recaptcha_response_field", this.$element);
      if (0 != b.length) {
        if (0 == a("#recaptcha_challenge_field_holder",
            b.parent()).length) {
          var c = a("#recaptcha_challenge_field_holder");
          b.before(c)
        }
        for (var b = a("#recaptcha_image", this.$element), c = ["#ReCaptchaV2", "#ReCaptchaAnswer", "#ReCaptchaChallenge"], f = 0; f < c.length; f++)
          if (0 == a(c[f], b).length) {
            var j = a(c[f]);
            b.after(j)
          }
      }
    },
    _attachBehavior: function () {
      var b = this;
      if (this._bpID = this.$element.closest(".breakpoint").attr("id")) a("body").on("muse_bp_activate", function (a, c, j) {
        b._bpID == j.attr("id") && b._updateReCaptchaChallenge()
      }), this._updateReCaptchaChallenge();
      this.$element.find("." +
        this.options.fieldWrapperClass).each(function () {
        var c = a(this);
        b._isEmpty(c) || c.find("input, textarea").each(function () {
          a(this).removeClass(b.options.emptyClass)
        });
        c.attr("data-type") == "captcha" && (c.data("captchaValid", !1), c.find('input[name="CaptchaV2"]').keyup(function () {
          var f = a(this).val(),
            j = c.find('input[name="CaptchaHV2"]').val();
          b._validateCaptcha(j, f, function (a) {
            c.data("captchaValid", a);
            c.data("error-state") && b.errorSensitivity == "high" && b._validate(c)
          })
        }));
        b._isEmpty(c) || c.addClass(b.classNames.keydown)
      });
      this.$element.find("input, textarea").bind("focus blur keydown change propertychange", function (c) {
        var f = b.classNames[c.type],
          j = b.classNames.focus,
          h = b.classNames.keydown,
          i = b.classNames.blur,
          k = a(this).closest("." + b.options.fieldWrapperClass),
          l = b._getGroupField(k);
        switch (c.type) {
        case "focus":
          k.addClass(f).removeClass(i);
          break;
        case "keydown":
          "checkbox" != k.data("type") && "radio" != k.data("type") && k.addClass(f).removeClass(i);
          break;
        case "blur":
          k.removeClass(j);
          b._isEmpty(k) && k.addClass(f).removeClass(h);
          l && b._isEmpty(l) && l.addClass(f).removeClass(h);
          break;
        case "change":
        case "propertychange":
          "radio" == k.data("type") && l.find("." + b.options.fieldWrapperClass).removeClass(h), b._isEmpty(k) ? k.addClass(i).removeClass(h) : k.addClass(h).removeClass(i), l && (b._isEmpty(l) ? l.addClass(i).removeClass(h) : l.addClass(h).removeClass(i))
        }
      });
      switch (this.event) {
      case "blur":
      case "keyup":
        this.$element.find("." + this.options.fieldWrapperClass + " input, ." + this.options.fieldWrapperClass + " textarea").bind(this.event, function () {
          b._validate(a(this).closest("." +
            b.options.fieldWrapperClass))
        });
      case "submit":
        this.$element.submit(function (c) {
          var f = !0,
            j = b.$element.find("." + b.options.fieldWrapperClass).length - 1;
          b.$element.find("." + b.options.fieldWrapperClass).each(function (h) {
            if ((f = b._validate(a(this)) ? f : !1) && h == j && b.options.ajaxSubmit) c.preventDefault(), b._submitForm();
            f || c.preventDefault()
          });
          a("." + b.options.fieldWrapperClass, b.$element).each(function () {
            var b = a(this);
            b.attr("data-type") == "email" && (b = b.find("input, textarea"), b.val() == "no.reply@example.com" &&
              b.val(""))
          })
        })
      }
    },
    _validateCaptcha: function (b, c, f) {
      c.length != 6 ? f(!1) : a.get("/ValidateCaptcha.ashx", {
        key: b,
        answer: c
      }, function (a) {
        f(a == "true")
      })
    },
    _validateReCaptcha: function (b, c) {
      a.get("/ValidateCaptcha.ashx", {
        key: Recaptcha.get_challenge(),
        answer: Recaptcha.get_response(),
        imageVerificationType: "recaptcha"
      }, function (a) {
        a == "true" ? b() : c()
      })
    },
    _submitForm: function () {
      var b = this,
        c = a("#ReCaptchaAnswer", b.$element),
        f = a("#ReCaptchaChallenge", b.$element);
      b.hasReCAPTCHA && 1 == c.length && 1 == f.length ? (c.val(Recaptcha.get_response()),
        f.val(Recaptcha.get_challenge()), b._validateReCaptcha(function () {
          b._submitFormInternal()
        }, function () {
          a("." + b.options.fieldWrapperClass, b.$element).each(function () {
            var c = a(this);
            c.attr("data-type") == "recaptcha" && b._switchState("invalid", c)
          });
          Recaptcha.reload()
        })) : b._submitFormInternal()
    },
    _submitFormInternal: function () {
      var b = this,
        g = this.options.formSubmittedClass,
        f = this.options.formDeliveredClass,
        j = this.options.formErrorClass,
        h = g + " " + f + " " + j,
        i = this.$element.find("input[type=submit], button");
      a.ajax({
        url: this.$element.attr("action"),
        type: "post",
        data: this.$element.serialize(),
        beforeSend: function () {
          b.$element.removeClass(h);
          b.$element.addClass(g);
          b.$element.find("." + b.options.fieldWrapperClass).removeClass(b.options.focusClass);
          i.attr("disabled", "disabled")
        },
        complete: function (h) {
          h && (h.status >= 400 || h.responseText && h.responseText.indexOf("<?php") >= 0) && alert("Form PHP script is missing from web server, or PHP is not configured correctly on your web hosting provider. Check if the form PHP script has been uploaded correctly, then contact your hosting provider about PHP configuration.");
          b.$element.removeClass(g);
          var l = null;
          if (h && h.responseText) try {
            l = jQuery.parseJSON(h.responseText), l = l.FormProcessV2Response || l.FormResponse || l.MusePHPFormResponse || l
          } catch (m) {}
          if (l && l.success) {
            b.$element.addClass(f);
            if (l.redirect) {
              c.location.href = l.redirect;
              return
            }
            b.$element[0].reset();
            b.hasCAPTCHA && b.$element.find("input:not([type=submit]), textarea").each(function () {
              a(this).attr("disabled", "disabled")
            });
            b.$element.find("." + b.options.notEmptyClass).each(function () {
              a(this).removeClass(b.options.notEmptyClass)
            })
          } else if (h =
            b._getFieldsWithError(l))
            for (l = 0; l < h.length; l++) b._switchState("invalid", h[l]);
          else b.$element.addClass(j);
          b.hasCAPTCHA || i.removeAttr("disabled");
          b.hasReCAPTCHA && Recaptcha.reload()
        }
      })
    },
    _getFieldsWithError: function (b) {
      if (!b || !b.error || !b.error.fields || !b.error.fields.length) return null;
      for (var c = [], f = 0; f < b.error.fields.length; f++) {
        var j = a('[name="' + b.error.fields[f].field + '"]', this.$element).parents("." + this.options.fieldWrapperClass);
        1 == j.length && c.push(j)
      }
      return c
    },
    _validate: function (a) {
      var b = a.attr("data-type") ||
        "always-valid",
        c = a.find("input, textarea"),
        j = this.validationTypes[b],
        h = a.attr("data-required") === "true",
        i = this._isEmpty(a),
        j = j instanceof RegExp ? Boolean(c.val().match(j)) : j(a);
      if (h && i) return this._switchState("required", a);
      b == "email" && i && c.val("no.reply@example.com");
      if (!j && (h || !i)) return this._switchState("invalid", a);
      return this._switchState("valid", a)
    },
    _switchState: function (a, b) {
      var c = b.attr("data-type"),
        j = this.options.validClass,
        h = this.options.invalidClass,
        i = this.options.requiredClass,
        k = this,
        l = function () {
          k._validate(b)
        };
      b.removeClass(j + " " + h + " " + i);
      if (a == "required" || a == "invalid") return a == "invalid" ? b.addClass(h) : b.addClass(i), "recaptcha" != c && this.errorSensitivity != "low" && (j = this.errorSensitivity == "high" ? "keyup" : "blur", b.data("error-state") || (b.data("error-state", !0), b.find("input, textarea").bind(j, l))), !1;
      b.data("error-state") && (this.errorSensitivity == "high" ? this.event != "keyup" && b.data("error-state", !1).find("input, textarea").unbind("keyup", l) : this.errorSensitivity == "medium" && this.event !=
        "blur" && b.data("error-state", !1).find("input, textarea").unbind("blur", l));
      if ("checkbox" == c || "radio" == c)
        if ((l = this._getGroupField(b)) && l.hasClass(i)) {
          b.addClass(i);
          return
        }
      b.addClass(j);
      return !0
    }
  });
  a.fn.wpForm = function (a) {
    new b.Widget.Form(this, a);
    return this
  }
})(jQuery, WebPro, window, document);;
(function () {
  if (!("undefined" == typeof Muse || "undefined" == typeof Muse.assets)) {
    var a = function (a, b) {
      for (var c = 0, d = a.length; c < d; c++)
        if (a[c] == b) return c;
      return -1
    }(Muse.assets.required, "webpro.js");
    if (-1 != a) {
      Muse.assets.required.splice(a, 1);
      for (var a = document.getElementsByTagName("meta"), b = 0, c = a.length; b < c; b++) {
        var d = a[b];
        if ("generator" == d.getAttribute("name")) {
          "2015.1.0.342" != d.getAttribute("content") && Muse.assets.outOfDate.push("webpro.js");
          break
        }
      }
    }
  }
})();