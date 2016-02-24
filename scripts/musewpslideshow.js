/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function (a, b, c, d, g) {
  c.Plugins.SlideShowCaptions = {
    defaultOptions: {
      captionClassName: "SSSlideCaption"
    },
    initialize: function (b, c) {
      var d = this;
      a.extend(c, a.extend({}, d.defaultOptions, c));
      b.bind("attach-behavior", function () {
        d._attachBehavior(b)
      })
    },
    _attachBehavior: function (a) {
      var b = a._sscpCaptions ? a._sscpCaptions : a._findWidgetElements("." + a.options.captionClassName);
      if (b.length) a._sscpCaptions = b, b.css("display", "none"), a.slides.bind("wp-panel-show", function (a, c) {
          b.eq(c.panelIndex).css("display", "block")
        }),
        a.slides.bind("wp-panel-hide", function (a, c) {
          b.eq(c.panelIndex).css("display", "none")
        }), a.bind("ready", function () {
          -1 != a.slides.activeIndex && b.eq(a.slides.activeIndex).css("display", "block")
        })
    }
  };
  c.Plugins.SlideShowLabel = {
    defaultOptions: {
      labelClassName: "SlideShowLabel"
    },
    initialize: function (b, c) {
      var d = this;
      a.extend(c, a.extend({}, d.defaultOptions, c));
      b.bind("attach-behavior", function () {
        d._attachBehavior(b)
      })
    },
    _attachBehavior: function (a) {
      var b = this,
        c = a._$sslpLabels ? a._$sslpLabels : a._findWidgetElements("." +
          a.options.labelClassName);
      if (c.length) a._$sslpLabels = c, a.slides.bind("wp-panel-show", function () {
        b._updateLabels(a)
      }), a.bind("ready", function () {
        b._updateLabels(a)
      })
    },
    _findAllTextNodes: function (a, b) {
      b = b || [];
      switch (a.nodeType) {
      case 3:
        b.push(a);
        break;
      case 1:
        if (a.nodeName.toLowerCase() !== "script")
          for (var c = a.firstChild; c;) this._findAllTextNodes(c, b), c = c.nextSibling
      }
      a.nextSibling && this._findAllTextNodes(a.nextSibling, b);
      return b
    },
    _updateLabels: function (a) {
      var b = this,
        c = a.slides,
        d = c.activeIndex + 1,
        g = c.$element.length;
      a._$sslpLabels.each(function () {
        for (var a = b._findAllTextNodes(this), c = a.length, f = 0, h = function (a) {
            return ++f === 1 ? d : f === 2 ? g : a
          }, p = 0; p < c; p++) {
          var n = a[p],
            t = n.nodeValue,
            q = t.replace(/\d+/g, h);
          if (q !== t) n.nodeValue = q
        }
      })
    }
  };
  c.Plugins.Lightbox = {
    defaultOptions: {
      lightboxPartsSelector: ".PamphletLightboxPart",
      closeBtnClassName: "PamphletCloseButton"
    },
    initialize: function (b, c) {
      var d = this;
      a.extend(c, a.extend({}, d.defaultOptions, c));
      b._sslbpAutoPlay = c.autoPlay;
      c.autoPlay = !1;
      b.bind("before-transform-markup", function () {
        d._beforeTransformMarkup(b)
      });
      b.bind("attach-behavior", function () {
        d._attachBehavior(b)
      });
      c.autoActivate_runtime && b.bind("ready", function () {
        d._openLightbox(b)
      })
    },
    _beforeTransformMarkup: function (a) {
      a._sslbpShownInitially = !0;
      var b = a._findWidgetElements("." + a.options.slideClassName);
      if (b.filter(":hidden").length == 0) a._sslbpSlideOffset = b.offset();
      else {
        a._sslbpShownInitially = !1;
        var d = a._findWidgetElements("." + a.options.viewClassName);
        a._sslbpSlideOffset = {
          top: c.Utils.getCSSIntValue(d, "top") + c.Utils.getCSSIntValue(b, "top"),
          left: c.Utils.getCSSIntValue(d,
            "left") + c.Utils.getCSSIntValue(b, "left")
        }
      }
    },
    _attachBehavior: function (a) {
      var b = this,
        d = a.options;
      a.tabs.$element.unbind(d.event).bind(d.event, function () {
        b._openLightbox(a)
      });
      a.slides.unbind("wp-panel-before-show").bind("wp-panel-before-show", function () {
        b._openLightbox(a)
      });
      if (c.Browser.Features.Touch && d.elastic === "fullScreen") a.slides.$element.not("a[href]").off("click").on("click", function () {
        b._closeLightbox(a)
      });
      a._$sslbpCloseBtn = a._findWidgetElements("." + d.closeBtnClassName).unbind("click").bind("click",
        function () {
          b._closeLightbox(a)
        });
      b._initializeMarkup(a)
    },
    _initializeMarkup: function (b) {
      var d = b.options,
        g = d.elastic !== "off",
        i = b._findWidgetElements("." + d.viewClassName),
        k = b.slides.$element,
        l = i,
        m = b._sslbpSlideOffset,
        o = k.outerWidth(),
        r = k.outerHeight(),
        p = b._findWidgetElements(d.lightboxPartsSelector);
      if (0 == i.length) {
        if (!b._$sslbpOverlay) b._$sslbpOverlay = a(".LightboxContent"), b._$sslbpOverlay.museOverlay("reuseAcrossBPs")
      } else {
        l = a(i[0].parentNode).filter("." + d.clipClassName);
        l.length === 0 && (l = i);
        p.each(function (d,
          j) {
          var k = a(j);
          if (k.css("position") !== "fixed") {
            var l = b._sslbpShownInitially ? k.offset() : {
                top: c.Utils.getCSSIntValue(k, "top"),
                left: c.Utils.getCSSIntValue(k, "left")
              },
              n = {
                top: l.top - m.top
              };
            g ? n.top += c.Utils.getCSSIntValue(i, "padding-top") : n.left = l.left - m.left;
            k.css(n)
          }
        }).addClass("popup_element");
        var n = a("<div/>").attr("id", i.attr("id") || "").css({
            left: 0,
            top: 0,
            width: "auto",
            height: "auto",
            padding: 0,
            margin: 0,
            zIndex: "auto"
          }),
          t;
        g && (t = a("<div/>"), d.elastic === "fullScreen" ? t.addClass("fullscreen") : d.elastic === "fullWidth" &&
          t.addClass("fullwidth"), t.css({
            paddingLeft: i.css("padding-left"),
            paddingRight: i.css("padding-right"),
            paddingTop: i.css("padding-top"),
            paddingBottom: i.css("padding-bottom"),
            borderColor: i.css("border-left-color"),
            borderStyle: i.css("border-left-style"),
            borderLeftWidth: i.css("border-left-width"),
            borderRightWidth: i.css("border-right-width"),
            borderTopWidth: i.css("border-top-width"),
            borderBottomWidth: i.css("border-bottom-width")
          }), t.append(c.Utils.includeMEditableTags(l)), t.append(c.Utils.includeMEditableTags(p)),
          n.css({
            border: "none"
          }));
        i.removeAttr("id");
        var q = a("<div/>").addClass("overlayWedge").insertBefore(c.Utils.includeMEditableTags(k)[0]);
        n.append(c.Utils.includeMEditableTags(i.children().not("." + d.slideClassName)));
        i.append(c.Utils.includeMEditableTags(k));
        n.css({
          visibility: "hidden"
        }).appendTo(document.body);
        n.detach().css({
          visibility: ""
        });
        l.css({
          position: d.elastic === "fullScreen" ? "relative" : "absolute",
          padding: 0,
          left: d.elastic === "fullWidth" ? "" : 0,
          top: 0,
          borderWidth: 0,
          background: "none"
        });
        d.elastic !== "fullScreen" &&
          l.css({
            width: o,
            height: r
          });
        d.transitionStyle === "fading" && k.css({
          position: "absolute",
          left: 0,
          top: 0
        });
        var y;
        if (b._fstpPositionSlides || b._csspResizeFullScreenImages) y = function (a, c) {
          b._fstpPositionSlides && b._fstpPositionSlides(a, c);
          b._csspResizeFullScreenImages && b._csspResizeFullScreenImages(b, b.slides.$element, d.heroFitting)
        };
        l = a("<div/>").addClass("LightboxContent").css({
          position: "absolute"
        }).append(g ? t : l);
        g || l.append(c.Utils.includeMEditableTags(p));
        l.museOverlay({
          autoOpen: !1,
          $slides: k,
          $overlaySlice: n,
          $overlayWedge: q,
          slideshow: b,
          onNext: function () {
            b.next()
          },
          onPrevious: function () {
            b.previous()
          },
          onClose: function () {
            b.stop();
            b.slides.hidePanel(b.slides.activeElement);
            b.tabs.activeElement.focus()
          },
          $elasticContent: t,
          resizeSlidesFn: y
        });
        if (a.browser.msie && a.browser.version < 9) {
          c.Assert.assert(!c.Utils.isIBE(), "IBE doesn't support <IE10, so how did we get here?");
          var C = n[0];
          c.Utils.needPIE(function () {
            PIE.detach(C);
            PIE.attach(C)
          })
        }
        b._$sslbpOverlay = l
      }
    },
    _openLightbox: function (a) {
      var b = a._$sslbpOverlay;
      b.data("museOverlay").isOpen ||
        (b.museOverlay("open"), a._sslbpAutoPlay && a.play())
    },
    _closeLightbox: function (a) {
      a = a._$sslbpOverlay;
      a.data("museOverlay").isOpen && a.museOverlay("close")
    }
  };
  c.Plugins.ContentSlideShow = {
    defaultOptions: {
      displayInterval: 3E3,
      transitionDuration: 500,
      transitionStyle: "fading",
      contentLayout_runtime: "stack",
      event: "click",
      deactivationEvent: "none",
      hideAllContentsFirst: !1,
      shuffle: !1,
      resumeAutoplay: !1,
      resumeAutoplayInterval: 3E3,
      elastic: "off",
      autoActivate_runtime: !1
    },
    slideShowOverrides: {
      slideshowClassName: "SlideShowWidget",
      viewClassName: "SlideShowContentPanel",
      slideClassName: "SSSlide",
      slideLinksClassName: "SSSlideLinks",
      slideLinkClassName: "SSSlideLink",
      slideLinkActiveClassName: "SSSlideLinkSelected",
      slideCountClassName: "SSSlideCount",
      firstBtnClassName: "SSFirstButton",
      lastBtnClassName: "SSLastButton",
      prevBtnClassName: "SSPreviousButton",
      nextBtnClassName: "SSNextButton",
      playBtnClassName: "SSPlayButton",
      stopBtnClassName: "SSStopButton",
      closeBtnClassName: "SSCloseButton",
      heroFitting: "fitContentProportionally",
      thumbFitting: "fillFrameProportionally",
      lightboxPartsSelector: ".SlideShowCaptionPanel, .SSFirstButton, .SSPreviousButton, .SSNextButton, .SSLastButton, .SlideShowLabel, .SSCloseButton",
      lightboxEnabled_runtime: !1
    },
    compositionOverrides: {
      slideshowClassName: "PamphletWidget",
      viewClassName: "ContainerGroup",
      slideClassName: "Container",
      slideLinkClassName: "Thumb",
      slideLinkActiveClassName: "PamphletThumbSelected",
      prevBtnClassName: "PamphletPrevButton",
      nextBtnClassName: "PamphletNextButton",
      closeBtnClassName: "PamphletCloseButton",
      lightboxPartsSelector: ".PamphletLightboxPart"
    },
    initialize: function (d, g) {
      var h = this,
        i = d.$element.hasClass("SlideShowWidget"),
        k = i ? h.slideShowOverrides : h.compositionOverrides;
      d._csspIsImageSlideShow = i;
      this._restartTimer = 0;
      a.extend(g, a.extend({}, h.defaultOptions, k, g));
      if (d.$element.hasClass("HeroFillFrame")) g.heroFitting = "fillFrameProportionally";
      if (g.lightboxEnabled_runtime) g.contentLayout_runtime = "lightbox";
      if (g.contentLayout_runtime == "lightbox" && !g.autoActivate_runtime) g.hideAllContentsFirst = !0;
      if (g.hideAllContentsFirst) g.defaultIndex = -1;
      if (g.elastic !==
        "off") d._csspPositionImage = h._positionImage;
      i && (b.Widget.ContentSlideShow.slideImageIncludePlugin.initialize(d, g), c.Plugins.SlideShowLabel.initialize(d, g), c.Plugins.SlideShowCaptions.initialize(d, g));
      g.transitionStyle == "fading" ? b.Widget.ContentSlideShow.fadingTransitionPlugin.initialize(d, g) : b.Widget.ContentSlideShow.filmstripTransitionPlugin.initialize(d, g);
      b.Widget.ContentSlideShow.alignPartsToPagePlugin.initialize(d, g);
      if (g.contentLayout_runtime === "lightbox") {
        if (g.elastic !== "off") d._csspResizeFullScreenImages =
          h._resizeFullScreenImages;
        if (0 < a(".LightboxContent").length) g.autoActivate_runtime = !1;
        c.Plugins.Lightbox.initialize(d, g)
      }
      g.shuffle === !0 && b.Widget.ContentSlideShow.shufflePlayPlugin.initialize(d, g);
      d.bind("transform-markup", function () {
        h._transformMarkup(d)
      });
      a("body").on("muse_bp_activate", function (a, b, c) {
        c.is(d.$bp) && h._onBPActivate(h, d, g)
      }).on("muse_bp_deactivate", function (a, b, c) {
        c.is(d.$bp) && h._onBPDeactivate(h, d, g)
      });
      d.bind("attach-behavior", function () {
        h._attachBehavior(d)
      })
    },
    _onBPActivate: function (a,
      b, c) {
      this._updateClipElement(b);
      b._attachBehavior();
      b.trigger("attach-behavior");
      "lightbox" !== c.contentLayout_runtime && (c = b.slides.$element.eq(b.slides.activeIndex)[0], c = {
        panel: c,
        panelIndex: b.slides._getElementIndex(c)
      }, b.options.hideAllContentsFirst || b.slides.trigger("wp-panel-show", c), (b.options.autoPlay || b._sslbpAutoPlay) && b.options.resumeAutoplay && 0 < b.options.resumeAutoplayInterval ? a._startRestartTimer(b) : b._wasPlaying && b.play(!0))
    },
    _onBPDeactivate: function (a, b) {
      b._wasPlaying = b.isPlaying();
      b._wasPlaying &&
        b.stop();
      a._stopRestartTimer()
    },
    _updateClipElement: function (b) {
      var d = b.options,
        g = b._findWidgetElements("." + d.viewClassName),
        i = b._findWidgetElements("." + d.clipClassName),
        i = i.length ? i : a("<div/>").addClass(d.clipClassName),
        k = b._findWidgetElements("." + d.slideClassName),
        b = k.outerWidth(),
        k = k.outerHeight();
      if (d.elastic === "fullScreen") i.addClass("fullscreen");
      else {
        var l = {
            position: "relative",
            width: b + "px",
            height: k + "px",
            overflow: "hidden"
          },
          m = g.css("position");
        if (m === "absolute") l.position = m, l.left = g.css("left"),
          l.top = g.css("top");
        else if (m === "fixed") {
          var o = c.Utils.getStyleSheetRulesById(c.Utils.getPageStyleSheets(), g.get(0).id);
          l.position = m;
          l.left = c.Utils.getRuleProperty(o, "left");
          l.top = c.Utils.getRuleProperty(o, "top");
          l.bottom = c.Utils.getRuleProperty(o, "bottom");
          l.right = c.Utils.getRuleProperty(o, "right")
        }
        i.css(l)
      }
      d.elastic !== "fullScreen" && g.css({
        width: b + "px",
        height: k + "px"
      });
      return i
    },
    _transformMarkup: function (a) {
      var b = a.options,
        c = a._findWidgetElements("." + b.viewClassName);
      b.transitionStyle !== "fading" ? (b =
        this._updateClipElement(a), c.css({
          position: "relative",
          top: "0",
          left: "0",
          margin: "0",
          overflow: "hidden"
        }).wrap(b)) : (a = c.css("position"), b.elastic !== "fullScreen" && a !== "fixed" && c.css({
        width: "0",
        height: "0"
      }))
    },
    _attachBehavior: function (b) {
      var g = this,
        h = b.options,
        i = b.tabs,
        k = b.slides.$element,
        l = h.slideLinkActiveClassName,
        m = h.contentLayout_runtime === "lightbox";
      if (h.elastic !== "off" && (g._resizeFullScreenImages(b, b.slides.$element, h.heroFitting), !m)) a(d).on("orientationchange resize", function () {
        g._resizeFullScreenImages(b,
          b.slides.$element, h.heroFitting)
      });
      if (m && !h.autoActivate_runtime) h.hideAllContentsFirst = !0;
      if (i) {
        var o = i.$element;
        h.event === "mouseover" && o.bind("mouseenter", function () {
          var b = a(this);
          b.data("enter", !0);
          i.selectTab(o.index(b))
        });
        h.deactivationEvent === "mouseout_trigger" ? o.bind("mouseleave", function () {
          var c = a(this);
          c.data("enter", !1);
          b.slides.hidePanel(o.index(c))
        }) : h.deactivationEvent === "mouseout_both" && (o.bind("mouseleave", function () {
          var c = a(this),
            d = o.index(c),
            g = k.eq(d);
          c.data("enter", !1);
          c.data("setTimeout") ||
            (c.data("setTimeout", !0), setTimeout(function () {
              !g.data("enter") && !c.data("enter") && b.slides.hidePanel(d);
              c.data("setTimeout", !1)
            }, 300))
        }), k.bind("mouseenter", function () {
          a(this).data("enter", !0)
        }), k.bind("mouseleave", function () {
          var c = a(this),
            d = k.index(c),
            g = o.eq(d);
          c.data("enter", !1);
          g.data("setTimeout") || (g.data("setTimeout", !0), setTimeout(function () {
            !c.data("enter") && !g.data("enter") && b.slides.hidePanel(d);
            g.data("setTimeout", !1)
          }, 300))
        }))
      }
      i && l && (h.hideAllContentsFirst || i.$element.each(function (c) {
        c ==
          b.slides.activeIndex ? a(this).addClass(l) : a(this).removeClass(l)
      }), b._findWidgetElements("a." + l).each(function () {
        a(this).data("default-active", !0)
      }), b.slides.bind("wp-panel-show", function (a, b) {
        i.$element.eq(b.panelIndex).addClass(l)
      }).bind("wp-panel-hide", function (a, b) {
        var c = i.$element.eq(b.panelIndex);
        c.data("default-active") || c.removeClass(l)
      }));
      g._attachStopOnClickHandler(b, b.$firstBtn);
      g._attachStopOnClickHandler(b, b.$lastBtn);
      g._attachStopOnClickHandler(b, b.$previousBtn);
      g._attachStopOnClickHandler(b,
        b.$nextBtn);
      g._attachStopOnClickHandler(b, b.$playBtn);
      g._attachStopOnClickHandler(b, b.$stopBtn);
      g._attachStopOnClickHandler(b, b.$closeBtn);
      i && !m && g._attachStopOnClickHandler(b, i.$element);
      b._csspIsImageSlideShow || (b.slides.bind("wp-panel-hide", function (b, d) {
        c.Utils.detachIframesAndObjectsToPauseMedia(a(d.panel))
      }).bind("wp-panel-show", function (d, g) {
        setTimeout(function () {
          c.Utils.attachIframesAndObjectsToResumeMedia(a(g.panel))
        }, b.options.transitionDuration)
      }), k.each(function () {
        this != b.slides.activeElement ||
          h.hideAllContentsFirst ? c.Utils.detachIframesAndObjectsToPauseMedia(a(this)) : c.Utils.attachIframesAndObjectsToResumeMedia(a(this))
      }));
      b.bind("wp-swiped", function () {
        (b.options.autoPlay || b._sslbpAutoPlay) && b.options.resumeAutoplay && 0 < b.options.resumeAutoplayInterval && g._startRestartTimer(b)
      })
    },
    _startRestartTimer: function (a) {
      this._stopRestartTimer();
      this._restartTimer = setTimeout(function () {
        a.play(!0)
      }, a.options.resumeAutoplayInterval + a.options.transitionDuration)
    },
    _stopRestartTimer: function () {
      this._restartTimer &&
        clearTimeout(this._restartTimer);
      this._restartTimer = 0
    },
    _attachStopOnClickHandler: function (a, b) {
      var c = this;
      b.bind(a.options.event === "click" ? "click" : "mouseover", function () {
        a.stop();
        (a.options.autoPlay || a._sslbpAutoPlay) && a.options.resumeAutoplay && 0 < a.options.resumeAutoplayInterval && c._startRestartTimer(a)
      })
    },
    _hitTest: function (a, b) {
      b.outerWidth() === 0 && (b = b.children(".popup_anchor").children(".popup_element").eq(0));
      var c = b.offset(),
        c = {
          x: c.left,
          y: c.top,
          width: b.outerWidth(),
          height: b.outerHeight()
        };
      return a.pageX >=
        c.x && a.pageX <= c.x + c.width && a.pageY >= c.y && a.pageY <= c.y + c.height
    },
    _layoutThumbs: function (b) {
      var d = b.options,
        g = c.Utils.getStyleValue;
      b._findWidgetElements("." + d.slideLinksClassName).each(function () {
        var b = a(this).find("." + d.slideLinkClassName);
        firstThumb = b[0];
        tWidth = g(firstThumb, "width");
        tHeight = g(firstThumb, "height");
        gapH = g(firstThumb, "margin-right");
        gapV = g(firstThumb, "margin-bottom");
        borderL = g(firstThumb, "border-left-width");
        borderR = g(firstThumb, "border-right-width");
        borderT = g(firstThumb, "border-top-width");
        borderB = g(firstThumb, "border-bottom-width");
        gWidth = g(this, "width");
        paddingL = g(this, "padding-left");
        paddingT = g(this, "padding-top");
        maxNumThumb = Math.floor((gWidth + gapH) / (tWidth + borderL + borderR + gapH));
        gStyle = this.runtimeStyle ? this.runtimeStyle : this.style;
        numRow = Math.ceil(b.length / maxNumThumb);
        firstRowNum = b.length < maxNumThumb ? b.length : maxNumThumb;
        leftPos = leftMostPos = c.Utils.pixelRound((gWidth - (tWidth + borderL + borderR) * firstRowNum - gapH * (firstRowNum - 1)) / 2) + paddingL;
        topPos = paddingT;
        numInRow = 1;
        gStyle.height =
          (tHeight + borderT + borderB) * numRow + gapV * (numRow - 1) + "px";
        b.each(function () {
          numInRow > firstRowNum && (numInRow = 1, leftPos = leftMostPos, topPos += tHeight + borderT + borderB + gapV);
          numInRow++ > 1 && (leftPos += tWidth + borderL + borderR + gapH);
          var a = this.runtimeStyle ? this.runtimeStyle : this.style;
          a.marginRight = "0px";
          a.marginBottom = "0px";
          a.left = leftPos + "px";
          a.top = topPos + "px"
        })
      })
    },
    _resizeFullScreenImages: function (b, c, d) {
      c.each(function () {
        a(this).find("img").each(function () {
          this.complete && !a(this).hasClass(b.options.imageIncludeClassName) &&
            b._csspPositionImage(this, d, b.options.elastic)
        })
      })
    },
    _setupImagePositioning: function (b, c, d, g) {
      var k = this;
      c.each(function () {
        a(this).find("img").each(function () {
          var b = this;
          b.complete ? k._positionImage(b, d, g) : a(b).load(function () {
            k._positionImage(b, d, g)
          })
        })
      })
    },
    _positionImage: function (b, j, h, i, k) {
      var l = a(d),
        m = b.runtimeStyle ? b.runtimeStyle : b.style,
        o = h === "fullWidth" || h === "fullScreen",
        r = h === "fullHeight" || h === "fullScreen",
        p = j == "fitContentProportionally";
      $img = a(b);
      o = o ? d.innerWidth ? d.innerWidth : l.width() : p ? $img.data("width") :
        $img.parent().width();
      l = r ? d.innerHeight ? d.innerHeight : l.height() : p ? $img.data("height") : $img.parent().height();
      i = i !== g ? i : c.Utils.getNaturalWidth(b);
      b = k !== g ? k : c.Utils.getNaturalHeight(b);
      h !== "off" && (i === 0 && (i = $img.data("imageWidth")), b === 0 && (b = $img.data("imageHeight")));
      if (o == i && l == b) m.marginTop = "0px", m.marginLeft = "0px";
      else {
        r = i;
        k = b;
        if (j == "fillFrameProportionally") {
          if (h !== "off" || i > o && b > l) j = i / o, h = b / l, j < h ? (k = b / j, r = o) : (k = l, r = i / h)
        } else if (j == "fitContentProportionally" && (h !== "off" || i > o || b > l)) j = i / o, h = b / l,
          j > h ? (k = b / j, r = i / j) : (k = b / h, r = i / h);
        m.width = c.Utils.pixelRound(r) + "px";
        m.height = c.Utils.pixelRound(k) + "px";
        m.marginTop = c.Utils.pixelRound((l - k) / 2) + "px";
        m.marginLeft = c.Utils.pixelRound((o - r) / 2) + "px"
      }
    }
  };
  a.extend(b.Widget.ContentSlideShow.slideImageIncludePlugin.defaultOptions, {
    imageIncludeClassName: "ImageInclude",
    slideLoadingClassName: "SSSlideLoading"
  });
  b.Widget.ContentSlideShow.prototype.defaultPlugins = [c.Plugins.ContentSlideShow];
  b.Widget.ContentSlideShow.prototype._getAjaxSrcForImage = function (b) {
    for (var c =
        a(d).data("ResolutionManager").getDataSrcAttrName(), g = c.length, i, k = 0; k < g; k++)
      if ((i = b.data(c[k])) && i.length) return i;
    return b.data("src")
  }
})(jQuery, WebPro, Muse, window);;
(function () {
  if (!("undefined" == typeof Muse || "undefined" == typeof Muse.assets)) {
    var a = function (a, b) {
      for (var c = 0, d = a.length; c < d; c++)
        if (a[c] == b) return c;
      return -1
    }(Muse.assets.required, "musewpslideshow.js");
    if (-1 != a) {
      Muse.assets.required.splice(a, 1);
      for (var a = document.getElementsByTagName("meta"), b = 0, c = a.length; b < c; b++) {
        var d = a[b];
        if ("generator" == d.getAttribute("name")) {
          "2015.1.0.342" != d.getAttribute("content") && Muse.assets.outOfDate.push("musewpslideshow.js");
          break
        }
      }
    }
  }
})();