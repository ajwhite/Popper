(function ($) {

  function Popper (element) {
    this.element = $(element);
    this.primary = this.element.find('[data-primary]');
    this.poppers = this.element.find(':not([data-primary])');

    this.primary.on('click', this.primaryClicked.bind(this));
    this.hidePoppers();
  }

  Popper.prototype.hidePoppers = function () {
    this.poppers.hide();
  };

  Popper.prototype.showPoppers = function () {
    this.poppers.show();
  };

  Popper.prototype.primaryClicked = function () {
    this.showPoppers();
  };


  $.fn.popper = function (options) {
    return this.each(function () {
      var popper = new Popper(this);
      $(this).attr('popper', popper);
    });
  };
})(jQuery);
