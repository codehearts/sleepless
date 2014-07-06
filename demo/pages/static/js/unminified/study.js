(function($) {
	var content = $('#wrap'),
		isStudyPage = content.hasClass('study-page');
	
	if (isStudyPage) {
		var cardFront = content.find('.card-front');
		
		// Allow the front of the card to be centered vertically
		if (cardFront.length !== 0) {
			cardFront.parent().css('line-height', cardFront.parent().height()+'px');
		}
		
		
		
		// If progress is being saved, we can provide a better studying experience
		if (Sleepless.storageSet) {
			var form  = $('#study-form'),
				front = $('#front'),
				back  = $('#back'),
				
				
				elements = {
					// Card elements
					card: {
						front: front,
						back:  back.find('.card'),
						fields: {
							front: $('.front-field'),
							back:  $('.back-field'),
							extra: $('.extra-field')
						}
					},
					
					// Form elements
					currentItem: form.find('input[name=current-item]'),
					lastItem:    form.find('input[name=last-item]'),
					
					// Status elements
					status: {
						container:   $('.study-status'),
						currentItem: $('.study-progress .current-item'),
						lastItem:    $('.study-progress .last-item'),
						repeatCount: $('.study-repeats')
					}
				},
				
				
				/**
				* Updates the card fields in the DOM with the given card data.
				* @param hash cardData A hash with the front, back, and extra card data to insert into the DOM.
				*/
				updateCardFields = function(cardData) {
					// @TODO 3 reflows, this could be better
					elements.card.fields.front.text(cardData.front);
					elements.card.fields.back.text(cardData.back);
					elements.card.fields.extra.text(cardData.extra);
				},
				
				
				/**
				* Updates the repeated card counter in the DOM.
				*/
				updateRepeatCounter = function() {
					// If the repeated card counter is not currently in the DOM, we'll have to create it.
					if (!elements.status.repeatCount.length) {
						elements.status.repeatCount = $('<span class="study-status-item study-repeats" />').appendTo(elements.status.container);
					}
					
					// Update the repeated card counter if there are cards in the repeat queue
					if (repeatQueue.length) {
						elements.status.repeatCount.text(repeatQueue.length);
					// Otherwise, remove it
					} else {
						elements.status.repeatCount.remove();
						elements.status.repeatCount = $();
					}
				},
				
				
				/**
				* Returns an array of the number of days each option should delay the card's review by.
				* @param number numberOfOptions The number of delay options that are available to the user.
				* @param number delayFactor The delay factor for this card.
				* @return array An array of the number of days each option should delay by
				*/
				getDelayTimes = function(numberOfOptions, delayFactor) {
					times = [];
					
					for (var i = 0; i < numberOfOptions; i++) {
						times.push(Math.ceil(Math.pow(delayFactor + 2, i + 1 - (i*0.5))));
					}
					
					return times;
				},
				
				
				/**
				* Returns the delay time as a human-readable HTML string.
				* @param number days The number of days that delay would be delayed by.
				* @return string A human readable HTML string.
				*/
				getDelayTimeString = function(days) {
					var numeral = '<span class="button-numeral">NUMERAL</span>',
						time;
					
					// Display the time in terms of days
					if (days < 31) {
						numeral = numeral.replace('NUMERAL', days);
						return interpolate(ngettext('%s day', '%s days', days), [numeral]);
						
					// Display the time in terms of months
					} else if (days < 365) {
						time = Math.round( days / 31 * 10 ) / 10; // Round to 0 or 1 decimal places
						
						numeral = numeral.replace('NUMERAL', time);
						return interpolate(ngettext('%s month', '%s months', time), [numeral]);
						
					// Display the time in terms of years
					} else {
						time = Math.round( days / 365 * 10 ) / 10; // Round to 0 or 1 decimal places
						
						numeral = numeral.replace('NUMERAL', time);
						return interpolate(ngettext('%s year', '%s years', time), [numeral]);
					}
				},
				
				
				startTime   = new Date().getTime() / 1000,
				currentItem = 0,
				lastItem    = 20,
				repeatQueue = [],
				currentCardID,
				currentCard,
				cards,
				
				
				deckID    = content.find('.deck-id').val(),
				cardCount = content.find('.card-count').val(),
				
				
				// Load our progress in this deck
				progress = Sleepless.loadProgress(deckID, {loadCardForecast: true, forceReview: true});
			
			
			
			// If progress hasn't been saved yet, initialize it
			if (progress === undefined) {
				Sleepless.saveProgress(Sleepless.initializeProgress(deckID, cardCount));
				progress = Sleepless.loadProgress(deckID, {loadCardForecast: true, forceReview: true});
			}
			
			// Update the options for this deck
			progress.deck.useTime    = !!form.find('input[name=use-time]').val();
			progress.deck.timeLimit  = parseInt(form.find('input[name=time-limit]').val(), 10) / 60;
			progress.deck.randomize  = !!form.find('input[name=randomize]').val();
			progress.deck.useReverse = !!form.find('input[name=use-reverse]').val();
			progress.deck.cardsPerSession = parseInt(form.find('input[name=cards-per-session]').val(), 10);
			progress.deck.timesStudiedToday++;
			progress.deck.lastStudyDate = new Date(); // Set the last study date to today
			
			Sleepless.saveProgress(progress); // Save changes to the user's progress
			
			
			
			// Add review delay form elements to the DOM
			$('<button type="submit" class="btn bad-btn large-btn" name="repeat" value="1" id="repeat">'+gettext('Repeat')+'</button>').hide().appendTo(form);
			
			$('<div class="good-review-delay-options" />').append(
				$('<p class="review-delay-caption">'+gettext('Review in')+'</p>')
			).append(
				$('<button type="submit" class="btn good-btn large-btn" name="short-review-delay" value="1" />')
			).append(
				$('<button type="submit" class="btn good-btn large-btn" name="medium-review-delay" value="1" />')
			).append(
				$('<button type="submit" class="btn good-btn large-btn" name="long-review-delay" value="1" />')
			).hide().appendTo(form);
			
			elements.showAnswer = form.find('#show-answer');
			// @TODO This is kind of bad
			elements.reviewOptions = {
				container:   form.find('#repeat, .good-review-delay-options'),
				buttons:     $('#repeat, .good-review-delay-options button'),
				goodButtons: $('.good-review-delay-options').find('button')
			};
			
			
			
			// Hide pertinent UI elements until our card data loads in
			elements.status.container.hide();
			elements.card.front.hide();
			elements.showAnswer.hide();
			
			
			// Fetch the card data we'll need for this session
			$.getJSON('/decks/'+deckID+'/cards/', {
				total:   progress.deck.cardsPerSession,
				studied: Sleepless.encodeNumericArray(progress.cards.forecast.studied),
				include: Sleepless.encodeNumericArray(progress.cards.forecast.review),
				randomize:     progress.deck.randomize,
				randomizeSeed: progress.deck.randomizeSeed
			}, function(data) {
				cards = data
				
				
				// Set up our session variables
				lastItem = data.length;
				elements.status.lastItem.text(lastItem);
				elements.lastItem.val(lastItem);
				
				
				// @TODO Write a method for this
				currentCardDataIndex = 0; // Current index in our card data array
				currentCardID = cards[0][0]; // First item is the card's order in the deck
				currentCard = cards[0][1]; // Second item is a hash of card data
				updateCardFields(currentCard);
				
				elements.status.container.show();
				elements.card.front.show(); // Show the front of the current card
				elements.showAnswer.show(); // Show the "show answer" button
				
				
				// Show the other side of the card
				elements.showAnswer.on('click', function(e) {
					var times;
					
					e.preventDefault();
					// @TODO Keyboard shortcuts
					// Swap the form controls
					elements.showAnswer.hide();
					elements.reviewOptions.container.show();
					
					// Show the back of the card
					elements.card.back.show();
					
					
					// Present the user with delay options for when to next review this card
					times = getDelayTimes(elements.reviewOptions.goodButtons.length, progress.cards[currentCardID].delayFactor);
					elements.reviewOptions.goodButtons.each(function(i) {
						$(this).val(times[i]).html(getDelayTimeString(times[i]));
					});
					
					
					// Update our current item if it's not also our last item
					if (currentItem !== lastItem) {
						currentItem++;
						elements.currentItem.val(currentItem);
						elements.status.currentItem.text(currentItem);
					// If we have cards in the repeat queue, we should remove the first item now
					} else if (repeatQueue.length) {
						repeatQueue.shift(); // We have to remove the item here to prevent the session from ending prematurely
						
						// Update the repeated card counter in the DOM
						updateRepeatCounter();
					}
				});
				
				// Show the next card
				elements.reviewOptions.buttons.on('click', function(e) {
					var button = $(e.currentTarget);
					
					e.preventDefault();
					
					// @TODO Keyboard shortcuts
					// Swap the form controls
					elements.showAnswer.show();
					elements.reviewOptions.container.hide();
					
					// Hide the back of the card
					elements.card.back.hide();
					
					
					progress.cards[currentCardID].studied = true;
					
					// If the repeat button was clicked
					if (button.attr('name') === 'repeat') {
						// Reset the delay factor for this card
						progress.cards[currentCardID].delayFactor = 0;
						
						// Add this card's index in our card data array to the repeat queue
						repeatQueue.push(currentCardDataIndex);
						
						// Update the repeated card counter in the DOM
						updateRepeatCounter();
					// If a review delay button was clicked
					} else {
						// Set the card's next review date
						progress.cards[currentCardID].reviewDate.setDate(new Date().getDate() + parseInt(button.val(), 10));
						
						// Increment the card's delayFactor
						progress.cards[currentCardID].delayFactor += 1;
					}
					
					
					// Save our progress
					Sleepless.saveProgress(progress);
					
					
					// If the time limit is up, submit the form
					if (progress.deck.useTime && (new Date().getTime() / 1000 - startTime) / 60 >= progress.deck.timeLimit) {
						form.submit();
						return;
					}
					
					// If this is the last item and we don't have a repeat queue, submit the form
					if (currentItem === lastItem && !repeatQueue.length) {
						form.submit();
						return;
					}
					
					
					
					// If the current item is not the last item, our next card should come from the regular queue
					if (currentItem !== lastItem) {
						currentCardDataIndex = currentItem; // Current index in our card data array
						currentCardID = cards[currentItem][0]; // First item is the card's order in the deck
						currentCard = cards[currentItem][1]; // Second item is a hash of card data
					// Otherwise, the next card should come from the repeat queue
					} else {
						// Get the value of the next card's order from the repeat queue, but don't remove it from the queue
						// This prevents the session from ending prematurely after the user chooses "show answer" on the last repeated card
						currentCardDataIndex = repeatQueue[0]; // Current index in our card data array
						currentCardID = cards[repeatQueue[0]][0]; // First item is the card's order in the deck
						currentCard = cards[repeatQueue[0]][1]; // Second item is a hash of card data
					}
					
					// Inject the new card into the DOM
					updateCardFields(currentCard);
				});
			});
		}
	}
}(jQuery));