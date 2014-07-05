(function($) {
	var content = $('#wrap'),
		isCompletionPage = content.hasClass('completion-page');
	
	if (isCompletionPage && Sleepless.storageSet) {
		var sidebar = $('.sidebar'),
			
			deckID = parseInt($('.deck-id').attr('id').replace('deck-', ''), 10),
			
			upcomingCallback = function(progress) {
				sidebar.append(new Origami({
					element: 'li',
					id:      'completion-cards-tomorrow',
					'class': 'upcoming',
					numeral: progress.cards.forecast.upcoming.length,
					caption: gettext('Tomorrow')
				}));
			},
			
			progress = Sleepless.loadProgress(deckID, {
				loadCardForecast:       true,
				upcomingLoadedCallback: upcomingCallback
			});
	}
}(jQuery));