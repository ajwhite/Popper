(function ($) {

  function Popper (element) {
    this.element = $(element);
    this.primary = this.element.find('[data-primary]');
    this.poppers = this.element.find(':not([data-primary])');

    this.primary.on('click', this.primaryClicked.bind(this));
    this.element.addClass('popper-container');
    this.poppers.addClass('secondary');
    this.primary.addClass('primary');
    this.hidePoppers();
  }

  Popper.prototype.getPoppersStartingPosition = function () {
    return {
      left: Math.abs(this.primary.position().left + (this.primary.width()/2)),
      top: Math.abs(this.primary.position().top + (this.primary.height()/2))
    };
  };

  Popper.prototype.hidePoppers = function () {
    var position = this.getPoppersStartingPosition();
    this.poppers.each(function () {
      $(this).css({
        left: position.left - ($(this).width() / 2),
        top: position.top - ($(this).width()/2)
      });
    });
    this.element.removeClass('popped');
  };

  Popper.prototype.showPoppers = function () {
    this.element.addClass('popped');
    this.poppers.show();
    this.positionPoppers();
  };

  Popper.prototype.positionPoppers = function () {
    var radius = 100,
        angle = 0,
        step = (2 * Math.PI) / this.poppers.length;

    this.poppers.each(function (item, index) {
      var x = Math.round(32 + radius * Math.cos(angle) - ($(this).width()/2)),
          y = Math.round(32 + radius * Math.sin(angle) - ($(this).height()/2));
      $(this).css({left: x + 'px', top: y + 'px'});
      angle += step;
    });
  };

  Popper.prototype.primaryClicked = function () {
    if (this.element.hasClass('popped')) {
      this.hidePoppers();
    } else {
      this.showPoppers();
    }
  };


  $.fn.popper = function (options) {
    return this.each(function () {
      var popper = new Popper(this);
      $(this).attr('popper', popper);
    });
  };
})(jQuery);
