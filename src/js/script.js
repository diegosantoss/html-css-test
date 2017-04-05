 function scroll() {
  $('a[href^="#"]').on('click',function(e) {
      e.preventDefault();

      var target = this.hash,
          $target = $(target);

      $('html, body').stop().animate({
          'scrollTop': $target.offset().top
      }, 900, 'swing');
  });
};


function hgScreen(){
  var hgHeight = window.innerHeight - $('.nav-bar').innerHeight();
  hgCenter = ( hgHeight - $('.content-center-home > div > h1').height() ) / 2;
  
  $('.content-center-home').css('height', hgHeight);
  $('.content-center-home > div > h1').css({'margin-top': hgCenter + 'px'});

}


$(function(){
  scroll();
  hgScreen();

  $(window).resize(function() {
    hgScreen();
  });

});
