(function ($) {
  var CONTAINER_CLASS = 'popper-container',
      SECONDARY_CLASS = 'secondary-popper',
      PRIMARY_CLASS = 'primary-popper',
      ACTIVE_CLASS = 'popped',
      DIRECTION_RADIAL = 'radial',
      DIRECTION_RIGHT = 'right',
      DIRECTION_LEFT = 'left',
      DIRECTIONS = [DIRECTION_RADIAL, DIRECTION_RIGHT, DIRECTION_LEFT],
      DEFAULT_OPTIONS = {
        transitionOutDuration: 450,
        transitionInDuration: 450,
        transitionOutDelay: 50,
        transitionInDelay: 50,
        transitionOutEasing: 'easeOutBack',
        transitionInEasing: 'easeInBack',
        animation: null,
        direction: DIRECTION_RADIAL,
        radius: 100
      },
      ANIMATION_PRESETS = {
        spiral: {
          transitionOutDuration: 450,
          transitionInDuration: 450,
          transitionOutDelay: 50,
          transitionInDelay: 50,
          transitionOutEasing: 'easeOutBack',
          transitionInEasing: 'easeInBack',
          direction: DIRECTION_RADIAL
        },
        pop: {
          transitionOutDuration: 450,
          transitionInDuration: 450,
          transitionOutDelay: 0,
          transitionInDelay: 0,
          transitionOutEasing: 'easeOutBack',
          transitionInEasing: 'easeInBack',
          direction: DIRECTION_RADIAL
        }
      };

  function Popper (element, options) {
    this.element = $(element);
    this.primary = this.element.find('[data-primary]');
    this.poppers = this.element.find(':not([data-primary])');
    this.options = $.extend({}, DEFAULT_OPTIONS, options || {});

    this.primary.on('click', this.primaryClicked.bind(this));
    this.element.addClass(CONTAINER_CLASS);
    this.poppers.addClass(SECONDARY_CLASS);
    this.primary.addClass(PRIMARY_CLASS);
    this.hidePoppers(false);
  }

  /**
   * Finds the center point of the primary element relative to the containing element
   * @return {Object} Coordinates of the primary element's center position
   */
  Popper.prototype.getPoppersStartingPosition = function () {
    return {
      x: Math.abs(this.primary.position().left + (this.primary.width()/2)),
      y: Math.abs(this.primary.position().top + (this.primary.height()/2))
    };
  };

  /**
   * Gets the transition rules based on a preset animation or a custom defined ruleset
   * @return {Object} The animation rules
   */
  Popper.prototype.getTransitionRules = function () {
    if (this.options.animation && this.options.animation in ANIMATION_PRESETS) {
      return ANIMATION_PRESETS[this.options.animation];
    } else {
      return this.options;
    }
  };

  /**
   * Hide the popout children by transitioning the nodes to the center of the primary element
   * @param  {Boolean} noAnimation Prevent the transition and immediately hide
   */
  Popper.prototype.hidePoppers = function (animate) {
    var position = this.getPoppersStartingPosition(),
        transition = this.getTransitionRules();

    if (animate === false) {
      // if no animation is requested,
      this.poppers.each(function () {
        $(this).css({
          left: position.x - ($(this).width() / 2),
          top: position.y - ($(this).height()/2)
        });
      });
    } else {
      // cycle through each popper child and transition the node inwards to the center
      // of the primary element
      this.poppers.each(function (index, item) {
        $(item).stop().delay(index * transition.transitionInDelay).animate({
          left: position.x - ($(item).width() / 2),
          top: position.y - ($(item).width()/2)
        }, {
          duration: transition.transitionInDuration,
          easing: transition.transitionInEasing,
        });
      }.bind(this));
    }
    this.element.removeClass(ACTIVE_CLASS);
  };

  /**
   * Show the popout children by transitioning them from the center of the primary element in an outward radial
   */
  Popper.prototype.showPoppers = function () {
    var radius = 100,
        angle = 0,
        step = (2 * Math.PI) / this.poppers.length,
        transitionRule = this.getTransitionRules(),
        elementW = this.element.width(),
        elementH = this.element.height(),
        transitionFunction;

    this.element.addClass(ACTIVE_CLASS);
    this.poppers.show();

    if (this.options.direction === DIRECTION_RADIAL) {
      transitionFunction = this.radialTransition.bind(this, transitionRule, elementW, elementH)
    } else if ([DIRECTION_RIGHT, DIRECTION_LEFT].indexOf(this.options.direction) > -1) {
      transitionFunction = this.horizontalTransition.bind(this, transitionRule);
    }
    this.poppers.each(transitionFunction);
  };

  /**
   * Performs a radial transition of the child elements
   */
  Popper.prototype.radialTransition = function (transitionRule, elementWidth, elementHeight, index, item) {
    var width = $(item).width(),
        height = $(item).height(),
        deltaWidth = (elementWidth / 2) - ($(item).width() / 2),
        deltaHeight = (elementHeight / 2) - ($(item).height() / 2),
        angle = index * ((2 * Math.PI) / this.poppers.length),
        x = Math.round(width + this.options.radius + Math.cos(angle) - deltaWidth / 2),
        y = Math.round(height + this.options.radius + Math.sin(angle) - deltaHeight / 2);

    console.log('angle', index, angle, x, y);

    $(item).delay(index * transitionRule.transitionOutDelay).animate({
      left: x + 'px',
      top: y + 'px'
    }, {
      duration: transitionRule.transitionOutDuration,
      easing: transitionRule.transitionOutEasing
    });
  };

  /**
   * Performs a horizontal transition of the elements
   */
  Popper.prototype.horizontalTransition = function () {

  };

  /**
   * Handle the click event of the primary element by either hiding the children or showing them
   * based on the current state
   */
  Popper.prototype.primaryClicked = function () {
    if (this.element.hasClass('popped')) {
      this.hidePoppers();
    } else {
      this.showPoppers();
    }
    return false;
  };

  $.fn.popper = function (options) {
    return this.each(function () {
      var popper = new Popper(this, options);
      $(this).data('popper', popper);
    });
  };
})(jQuery);
