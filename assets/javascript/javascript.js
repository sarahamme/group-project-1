
   // hides nav bar until you start to scroll
    var $nav = $('.navbar');
    $nav.hide();
//fade in .navbar
$(function () {
    $(window).scroll(function () {
        // set distance user needs to scroll before we start fadeIn
        if ($(this).scrollTop() > 100) { //For dynamic effect use $nav.height() instead of '100'
            $nav.fadeIn();
        } else {
            $nav.fadeOut();
        }
    });
});
 
