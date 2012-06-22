// @codekit-prepend "remove-mobile-chrome.js"
(function($) {
	var cardFront = $('#wrap').find('.card-front');
	
	if (cardFront.length !== 0) {
		cardFront.parent().css('line-height', cardFront.parent().height()+'px');
	}
}(jQuery));