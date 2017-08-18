$(function() {

	'use strict';

	var topoffset = 50; //variable for menu height

	//Use smooth scrolling when clicking on navigation
	$('.navbar a[href*=#]:not([href=#])').click(function() {
		if (location.pathname.replace(/^\//, '') ===
			this.pathname.replace(/^\//, '') &&
			location.hostname === this.hostname) {
			var target = $(this.hash);
			target     = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html,body').animate({
					scrollTop : target.offset().top - topoffset + 2,
				}, 500);
				return false;
			}
		}
	});

	// Scroll Top
	$(window).scroll(function() {
		if ($(this).scrollTop() > 100) {
			$('#scrollup').fadeIn();
		} else {
			$('#scrollup').fadeOut();
		}
	});

	$('#scrollup').click(function() {
		$("html, body").animate({scrollTop : 0}, 1000);
		return false;
	});
});

