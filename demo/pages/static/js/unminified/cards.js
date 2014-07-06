// @codekit-prepend "jquery.fittext.js"
(function($) {
	var cards = $('#wrap').find('.card'),
		
		/**
		* Adjusts the size of the text on the card face depending on the size of its contents.
		*/
		exponentiallyAdjustCardText = function(side) {
			var children = side.children(),
				childCount = children.length,
				
				// Account for children with small font sizes
				smallChildren = side.find('> .small-field'),
				smallChildCount = smallChildren.length,
				
				// The containing card element
				parent = side.parent(),
				
				cardWidth = side.width(),
				parentHeight = parent.height(),
				
				// Whether this card is marked as being one-sided
				oneSided = parent.hasClass('one-sided-card'),
				
				// Enlarge the font based on its parent's height if the card is one-sided
				heightRatio = oneSided ? (Math.pow((parentHeight/cardWidth/childCount), 3.5)) : 0,
				
				// Base font compression
				baseCompression = 1 + (0.2 * (((childCount - smallChildCount) - 1) + (smallChildCount * 0.5))) - heightRatio,
				
				// Font sizes
				maxFont,
				minFont;
			
			// Adjust each field on the card
			children.each(function(i, child) {
				child =  $(child);
				
				var textLength = child.text().length,
					textRatio =  Math.ceil(textLength / 10),
					fontCompression = baseCompression,
					smallField = child.hasClass('small-field'); // Account for small font sizes
				console.log(heightRatio);
				if (textLength === 1) {
					fontCompression /= 2.15 + heightRatio;
				} else {
					fontCompression /= 1.15 - (Math.pow((textRatio-1), 1.5) / cardWidth * 125) + heightRatio;
				}
				
				maxFont = (0.2 - (((childCount - smallChildCount) - 1) * 0.0125 - (smallChildCount * 0.00625))) * cardWidth;
				minFont = smallField ? 14 : 18;
				
				if (heightRatio !== 0) {
					maxFont *= 1 / Math.pow((textRatio - 0.5), 0.75);
					
					if (textLength === 1) {
						maxFont *= 1.15;
					}
				}
				
				if (smallField) {
					fontCompression *= 2 + heightRatio;
					maxFont *= 0.5;
				}
				
				child.fitText(fontCompression, {minFontSize: minFont+'px', maxFontSize: maxFont+'px'});
			});
		},
		
		
		/**
		* Adjusts the size of the text on the card face depending on the size of its container.
		*/
		adjustCardText = function(side) {
			var children = side.children(),
				parent = side.parent(),
				ratio = parent.width() / 500;
			
			// Adjust each field on the card
			children.each(function(i, child) {
				child = $(child),
				fontSize = parseInt(child.css('font-size'), 10);
				
				child.css('font-size', fontSize+(fontSize*ratio));
			});
		};
	
	
	
	if (cards.length !== 0) {
		cards.each(function(i, card) {
			card = $(card);
			
			var front = card.find('> .card-front'),
				back = card.find('> .card-back');
			
			adjustCardText(front);
			
			// We may not have a back, so check for it
			if (back.length !== 0) {
				adjustCardText(back);
			}
		});
	}
}(jQuery));