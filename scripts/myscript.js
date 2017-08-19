$(function() {

	'use strict';

	$('a[href*="#"]').not('[href="#"]').not('[href="#0"]').click(function(event) {
		if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
			var target = $(this.hash);
			target     = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				event.preventDefault();
				$('html, body').animate({
					scrollTop : target.offset().top,
				}, 1000, function() {
					var $target = $(target);
					$target.focus();
					if ($target.is(":focus")) {
						return false;
					} else {
						$target.attr('tabindex', '-1');
						$target.focus();
					}
				});
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

	var coded = "lXnA@qz77zXzmlCl.jAC";
	var key   = "PxDlMAf7vUcugGYdVEpmNZOQKwnbhrj314Sk6LJCIa0eTiXoqsFHR9B8t25yWz";
	var shift = coded.length;
	var link  = '';

	for (var i = 0; i < coded.length; i++) {
		if (key.indexOf(coded.charAt(i)) === -1) {
			var ltr = coded.charAt(i);
			link += (ltr);
		}
		else {
			ltr = (key.indexOf(coded.charAt(i)) - shift + key.length) % key.length;
			link += (key.charAt(ltr));
		}
	}

	$('#email').attr('href', 'mailto:' + link);

	$('#current-year').html(new Date().getFullYear().toString());
});

