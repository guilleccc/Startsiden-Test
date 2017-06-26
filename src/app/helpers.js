/**
 * @author Guillermo Constantino <guilleconstantino@gmail.com>
 */


 /**
  * Set a style dictionary with properly backgroundImage
  * @param {Object} element
  */
 function setChannelStyle(element) {
   element.style = {backgroundImage: 'url(' + element.cover_image + ')'};
 }

 /**
  * Save parsed date with human readable format
  * @param {Object} element
  */
 function setArticleExtraAttributes(element) {
   element.date = new Date(element.meta.created);
   element.timeFrom = getTimeFromDate(element.meta.created);
 }

/**
 * Get the individual unit (time) or plural (timer).
 * @param {integer} value - The amount of specific unit
 * @param {string} unit - Time unit: minutt, time, dag, ...
 * @returns {Number} properlyUnit
 */
function getProperlyDateUnit(value, unit) {
  if (value > 1) {
    var _plural = (unit.substr(-1, 1) == "e") ? "r" : "er";
    return unit + _plural;
  } else {
    return unit;
  }

}

/**
 * Get the period of time between this date and now.
 * @param {string} date - The date
 * @returns {Object} difference - Example : { time: 2, unit: "dager", daysFrom: 2 };
 */
function getTimeFromDate(date) {
  var date1 = new Date();
  var date2 = Date.parse(date);
  var diff = (date1 - date2);
  var floor = Math.floor;

  var MS_PER_MIN = 1000 * 60;
  var MS_PER_HOUR = MS_PER_MIN * 60;
  var MS_PER_DAY = MS_PER_HOUR * 24;

  var diffInDays = floor(diff / MS_PER_DAY);
  if (diffInDays>0) {
    return { time: diffInDays, unit: getProperlyDateUnit(diffInDays, "dag"), daysFrom: diffInDays };
  } else if (floor(diff / MS_PER_HOUR) > 0)  {
    var diffInHours = floor(diff / MS_PER_HOUR);
    return { time: diffInHours, unit: getProperlyDateUnit(diffInHours, "time"), daysFrom: diffInDays };
  } else {
    var diffInMinutes = floor(diff / MS_PER_MIN);
    return { time: diffInMinutes, unit: getProperlyDateUnit(diffInMinutes, "minutt"), daysFrom: diffInDays };
  }
}

var timestamp = new Date();

/**
 * Check if the time elapsed from last timestamp is higher than DEFAULT_TIMEFRAME_BETWEEN_AUTOLOAD.
 * otherwise it set a new timestamp (and it returns true)
 * @returns {bool}
 */
function isTimeForAutoload() {
  var date1 = new Date();
  var diff = (date1 - timestamp);
  var result = (diff > DEFAULT_TIMEFRAME_BETWEEN_AUTOLOAD);
  if (result) {
    timestamp = new Date();
  }
  return result;
}
