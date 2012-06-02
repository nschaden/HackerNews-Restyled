/* Instapaper Restyled - main
 *
 * Simple keyboard navigation on Hacker News list, reformulation of a few key elements on page load
 *
 * Applicable patterns:
 * all of news.ycombinator.com
 */

jQuery.noConflict();

HackerNews = 
{
  processRow: function(row)
  {
    var currsub = row.next().find('.subtext');
    var currsubtext = currsub.text();
    var points = currsubtext.match(/(\d)+\s+points/g);
    if (points && points.length)
      points = parseInt(points[0].replace(' points',''),10);
    var time = currsubtext.match(/(\d)+\s+[minute|hour|day]+/g);
    var originaltime;
    if (time && time.length)
    {
      time = time[0];
      
      if (time.indexOf('minute') > -1)
      {
        time = parseInt(time.match(/\d+/g),10);
        originaltime = time + ' m';
      }
      else
      {
        if (time.indexOf('hour') > -1)
        {
          time = parseInt(time.match(/\d+/g),10) * 60;
          originaltime = time/60 + ' h';
        }
        else
        {
          time = parseInt(time.match(/\d+/g),10) * 1440;
          originaltime = time/1440 + ' d';
        }
      }
    }
    var comments = currsubtext.match(/(\d)+\s+comment/g);
    if (comments && comments.length)
      comments = parseInt(comments[0].replace(/comment(s)?/,''),10);
    // set subtext as appropriate
    var commentslink = currsub.find('a').last().attr('href');
    if (points === null)
      points = 0;
    if (comments === null)
      comments = 0;
    row.append('<td class="graphs"><div class="points"><span>' + points + ' p</span></div><div class="comments"><a href="' + commentslink + '"></a><span>' + comments + ' c</span></div><div class="time"><span>' + originaltime + '</span></div>');
    row.find('.points').css('width',Math.min(Math.round(points/400*100),100) + 'px');
    row.find('.comments').css('width',Math.min(Math.round(comments/200*100),100) + 'px');
    row.find('.time').css('width',Math.min(Math.round(time/1440*100),100) + 'px');
    row.prepend('<a class="selector" href="' + row.find('.title').children('a').attr('href') + '"></a>');
  },
  // capture core keyboard input
  keyCheck: function(e)
  {
    var hovereditem = jQuery('.detail:hover');
    // for c, open currently hovered comments link in new window
    if (e.keyCode == 99)
    {
      if (hovereditem.length === 1)
        HackerNews.openCommentLink(hovereditem);
    }
    // for s, toggle stats to be always visible or not
    if (e.keyCode == 115)
    {
      var content = jQuery('.content');
      if (content.hasClass('show-stats'))
      {
        localStorage.setItem('showStats','no');
        content.removeClass('show-stats');
      }
      else
      {
        localStorage.setItem('showStats','yes');
        content.addClass('show-stats');
      }
    }
    // for v, open currently hovered link in new window
    if (e.keyCode == 118)
    {
      if (hovereditem.length === 1)
        HackerNews.openLink(hovereditem);
    }
    // for -, switch to compact visual mode
    if (e.keyCode == 45)
    {
      jQuery('.content').addClass('small');
      localStorage.setItem('viewSize','compact');
    }
    // for +, switch to larger visual mode
    if (e.keyCode == 61)
    {
      jQuery('.content').removeClass('small');
      localStorage.setItem('viewSize','normal');
    }
  },
  openLink: function(item)
  {
    window.open(item.children('.selector').attr('href')); 
  },
  openCommentLink: function(item)
  {
    var commentslink = item.find('.comments').children('a');
    if (commentslink.length)
      window.open(commentslink.attr('href')); 
  }
};

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

  // set up next link
  var nextlink = content.find('tr').last();
  nextlink.addClass('next-link');
  nextlink.prepend('<a class="selector" href="' + nextlink.find('.title').children('a').attr('href') + '"></a>');


  // cycle through content rows
  var detailrows = content.find('table > tbody > tr:nth-child(3n+1)').not(':last');
  detailrows.addClass('detail');
  for (var i = 0; i < detailrows.length; i++)
    HackerNews.processRow(detailrows.eq(i));

  // check local storage settings
  if (typeof localStorage == 'object')
  {
    var viewsize = localStorage.getItem('viewSize');
    var showstats = localStorage.getItem('showStats');
    if (viewsize === null)
      localStorage.setItem('viewSize','normal');
    else
    {
      if (viewsize === 'compact')
        $('.content').addClass('small');
    }
    if (showstats === null)
      localStorage.setItem('showStats','no');
    else
    {
      if (showstats === 'yes')
        $('.content').toggleClass('show-stats');
    }
  }


  // reveal content
  $('center > table').show();

  // add keychecking
  $(window).keypress(function(e) 
  {
    HackerNews.keyCheck(e);
  });

  // infinite scroll
  // console.log('loading inf scroll');
  // console.log(typeof $.fn.infinitescroll);
  // $('.content').infinitescroll(
  // {
  //   animate: false,
  //   appendCallback: false,
  //   debug: true,
  //   navSelector: '.next-link',
  //   nextSelector: '.next-link .selector',
  //   itemSelector: 'center > table > tbody > tr:nth-child(3) > td > table > tbody > tr'
  // },function(newelems)
  // {
  //   console.log('got infinite scroll new items',$(this),newelems);
  //   var newrows = $(newelems);
  //   var insertionpoint = $(this).find('tbody');

  //   var nextlink = newrows.last();
  //   nextlink.addClass('next-link');
  //   nextlink.prepend('<a class="selector" href="' + nextlink.find('.title').children('a').attr('href') + '"></a>');
  //   for (var i = 0; i < newrows.length - 1; i++)
  //   {
  //     insertionpoint.append(newrows.eq(i));
  //     if (i % 3 === 0)
  //     {
  //       console.log('processing',newrows.eq(i));
  //       HackerNews.processRow(newrows.eq(i).addClass('detail'));
  //     }
  //   }
  // });
})(jQuery);