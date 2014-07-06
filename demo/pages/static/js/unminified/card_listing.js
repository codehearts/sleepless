(function($) {
	var body = $(document.body),
		isCardPage = body.hasClass('card-listing');
	
	// If we're on the card listing page and we have storage set, we can mark cards as studied or upcoming
	if (isCardPage && Sleepless.storageSet) {
		var cards = body.find('.card'),
			
			upcomingCallback = function(progress) {
				// Mark each studied card as such
				$.each(progress.cards.forecast.studied, function(i, cardOrder) {
					cards.filter('#card-'+cardOrder).addClass('completed-card');
				});
				
				// Mark each upcoming card as such
				$.each(progress.cards.forecast.upcoming, function(i, cardOrder) {
					cards.filter('#card-'+cardOrder).addClass('upcoming-card');
				});
			},
			
			deckID   = parseInt($('.deck-id').attr('id').replace('deck-', ''), 10),
			progress = Sleepless.loadProgress(deckID, {
				loadCardForecast:       true,
				upcomingLoadedCallback: upcomingCallback
			});
	}
}(jQuery));