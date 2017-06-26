
/**
 * Get the current menu channel selected
 * @returns {Number} channelNumber
 */
function getActiveChannelNumber() {
  var channel = $(".nav-content").attr("data-channel-seleted");
  if ($.isNumeric( channel )) {
    return parseInt(channel);
  } else {
    return 0;
  }
}


/**
 * Applies the slick menu
 */
function displaySlickMenu() {
  $(document).ready(function(){

    // to make sure this function is executed after angular loads.
    setTimeout(function(){

      $(".nav-content").slick({
        infinite: false,
        initialSlide: getActiveChannelNumber(),
        slidesToShow: 3
      })

      $(".slick-arrow").hide();
      $(".nav-content").mouseover(function() {
        $(".slick-arrow").show();
      });

      $(".nav-content").mouseout(function() {
        $(".slick-arrow").hide();
      });

    }, 0);

  });

}
