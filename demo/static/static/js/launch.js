(function($) {
	var body = $(document.body),
		isLaunchPage = body.hasClass('launch');
	
	if (isLaunchPage) {
		var hooks = {
				jsStudyOptions:     $('#js-study-options'),
				staticStudyOptions: $('#static-study-options')
			},
			
			jsHookClone = hooks.jsStudyOptions.clone(),
			
			fields = {
				offset:         $('<input type="hidden" name="offset" />'),
				randomizeSeed:  $('<input type="hidden" name="randomize-seed" />'),
				cardCount:      hooks.staticStudyOptions.find('input[name=cards-per-session]'),
				recordProgress: undefined,
				cardForecast:   $('<p class="pad option-text" />').appendTo(jsHookClone)
			},
			
			
			deckID      = parseInt($('.deck-id').attr('id').replace('deck-', ''), 10),
			cardCount   = parseInt($('.card-count').text(), 10),
			reviewCount = 0,
			progress,
			
			
			updateCardForecast = function(cardCount, reviewCount) {
				// If the user is at the end of the deck, this will make the number of new cards to study equal to the number of new cards actually in the deck
				if (progress !== undefined) {
					cardCount = Math.min(cardCount, progress.cards.count - progress.cards.studyCount);
				}
				
				cardCount += reviewCount;
				
				if (progress && progress.deck.lastStudied === 'today') {
					fields.cardForecast.text(
						interpolate(
							ngettext(
								"You've already studied this deck for today. If you want to review early, you will have %s card to study.",
								"You've already studied this deck for today. If you want to review early, you will have %s cards to study.",
								cardCount
							),
							[cardCount]
						)
					);
				} else {
					fields.cardForecast.text(
						interpolate(
							ngettext('You have %s card to study today.', 'You have %s cards to study today.', cardCount),
							[cardCount]
						)
					);
				}
			};
		
		
		
		// Only show the progress recording consent box if storage has not been set
		if (!Sleepless.storageSet) {
			// Create the checkbox box
			fields.recordProgress = new Box({
				'class':    'attention-box',
				checkbox:   'record',
				subheading: gettext('%(checkbox)s Record your progress?'),
				body:       gettext('Sleepless can record your progress in this deck for next time. As a guest, your progress will not be available on other devices.')
			}).prependTo(
				jsHookClone
			);
			
			// When the checkbox is checked, we'll remove this element and begin storing data
			fields.recordProgress.find('input[type=checkbox]').on('click', function() {
				var checkbox = $(this);
				
				// Only fire if the checkbox has been checked
				if (checkbox.is(':checked')) {
					// Remove the checkbox
					fields.recordProgress.remove();
					
					// Save progress in this deck
					Sleepless.saveProgress(Sleepless.initializeProgress(deckID, cardCount));
				}
			});
		} else {
			progress = Sleepless.loadProgress(deckID, {loadCardForecast: true});
			
			// Update the number of cards to review today
			reviewCount = progress.cards.forecast.review.length;
			
			// Set the offset to the number of cards that have been studied
			fields.offset.val(progress.cards.studyCount).appendTo(jsHookClone);
			
			// Set the randomize seed to the user's for this deck
			fields.randomizeSeed.val(progress.deck.randomizeSeed).appendTo(jsHookClone);
			
			// Change the values in the form fields according to the stored data
			hooks.staticStudyOptions.find('input[name=cards-per-session]').val(progress.deck.cardsPerSession);
			hooks.staticStudyOptions.find('input[name=time-limit]').val(progress.deck.timeLimit);
			if (progress.deck.useTime) {
				hooks.staticStudyOptions.find('input[name=use-time]').prop('checked', true);
			}
			if (progress.deck.randomize) {
				hooks.staticStudyOptions.find('input[name=randomize]').prop('checked', true);
			}
			if (progress.deck.reversed) {
				hooks.staticStudyOptions.find('input[name=use-reverse]').prop('checked', true);
			}
			
			// Remove new card options if there are no new cards
			if (progress.cards.allStudied) {
				hooks.staticStudyOptions.find('input[name=cards-per-session]').parent().remove();
			}
		}
		
		
		
		
		
		
		// @TODO We need to handle cases where the user exits part way through the session and comes back the same day or another day
		// @TODO Only call this whenever fields.cardCount is updated if this deck hasn't been studied today
		// Display the card forecast for this deck and update it whenever the number of new cards to study is changed
		updateCardForecast(parseInt(fields.cardCount.val(), 10), reviewCount);
		fields.cardCount.on('keyup change', function() {
			updateCardForecast(parseInt(fields.cardCount.val(), 10), reviewCount);
		});
		
		hooks.jsStudyOptions.replaceWith(jsHookClone);
	}
}(jQuery));