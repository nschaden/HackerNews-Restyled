/* Instapaper Restyled - comments
 *
 * Simple keyboard navigation on Hacker News list, reformulation of a few key elements on page load
 *
 * Applicable patterns:
 * Comments pages on Hacker News
 */

jQuery.noConflict();

(function($) 
{
  // set core classes
  var trs = $('table').children('tbody').children('tr');
  var header = trs.first();
  var headerdiv = trs.eq(1);
  var content = trs.eq(2);
  var footer = trs.eq(3);
  header.addClass('header');
  headerdiv.addClass('header-divider');
  content.addClass('content');
  footer.addClass('footer');
})(jQuery);