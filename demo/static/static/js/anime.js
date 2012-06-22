// @codekit-append "jquery.inview.js"
(function($) {
	var animeQueue = $('#wrap').find('.animate'),
		canTransition = Modernizr.csstransitions,
		threshold = 26, // Maximum number of elements to animate
		win = $(window),
		
		/**
		* Ensures that the duration will be an object with a css and jquery property.
		*/
		normalizeDuration = function(duration) {
			if (typeof duration !== 'object') {
				duration = {
					css: duration,
					jquery: duration
				}
			}
			
			return duration;
		},
		
		/**
		* Restores the original CSS positioning of the elements.
		*/
		restorePositioning = function(elements) {
			var elementsClone = elements.clone();
			
			// Restore positioning
			elementsClone.css({
				position: $(elements[0]).data('position'),
				zIndex: 'auto'
			});
			
			// Replace the elements in the DOM with our new element (single reflow)
			elements.replaceWith(elementsClone);
		}
		
		/**
		* Offsets all children to a specific position relative to their parent, and stores their origin positions in the element.
		* @param parent The parent element.
		* @param position Either an object specifying the top and bottom, or a function that returns such an object.
		*/
		offsetChildren = function(parent, position) {
			var children = parent.children(), // We're animating its children
				
				// Create a clone for working with in memory
				parentClone = parent.clone(),
				childrenClone = parentClone.children();
			
			// Store this to restore it later
			$(childrenClone[0]).data('position', $(children[0]).css('position'));
			
			// Set the intial animation position on each element in memory
			$.each(childrenClone, function(i, childClone) {
				// Respect the animation threshold
				if (i === threshold) { return; }
				
				childClone = $(childClone);
				
				var childOffset = $(children[i]).position(),
					temp,
					left,
					top;
				
				// Store the element's original position for later
				childClone.data('top', childOffset.top);
				childClone.data('left', childOffset.left);
				
				// Get the position to set it at
				if (typeof position === 'function') {
					temp = position({
						index: i,
						element: childClone,
						offset: childOffset
					});
					
					top  = temp.top;
					left = temp.left;
				} else {
					top  = position.top;
					left = position.left;
				}
				
				childClone.css({
					position: 'absolute', // position: absolute; must be set here, or else .position() will not work a few lines up from this one
					top: top,
					left: left,
					zIndex: 10001,
					visibility: 'visible'
				});
			});
			
			// Replace the element in the DOM with our new element (single reflow)
			parent.replaceWith(parentClone);
			
			// Return the updated DOM element
			return parentClone;
		},
		
		/**
		* Runs the animation using CSS transitions if possible, ora jQuery .animate fallback
		* @param element The parent element.
		* @param duration Either an integer or an object with css and jquery keys.
		* @param callback A function to call after the animation finishes. The child element passed to it will either be an element or a collection of elements depending on whether we fell back on jQuery's animation.
		*/
		runAnimationOnChildren = function(element, duration, callback) {
			var children = element.children();
			
			// If the animation should wait until it scrolls into view...
			if (element.hasClass('animate-defer')) {
				element.removeClass('animate-defer'); // Remove the wait class
				
				// ...wait until the element scrolls into view to animate it
				element.one('inview', function (event, visible) {
					if (visible === true) {
						runAnimationOnChildren(element, duration, callback);
					}
				});
				
				// And do nothing from this point on
				return;
			}
			
			duration = normalizeDuration(duration);
			
			if (canTransition) {
				// A slight delay is necessary for the CSS transition to trigger
				setTimeout(function() {
					$.each(children, function(i, child) {
						// Respect the animation threshold
						if (i === threshold) { return; }
						
						child = $(child);
						
						// Set the element back to its original position
						child.css({
							top:  child.data('top'),
							left: child.data('left')
						});
					});
				}, 10);
				
				// Clean up after ourselves once the animation has finished
				setTimeout(function() {
					if (typeof callback !== 'undefined') {
						callback(element, children);
					}
					
					restorePositioning(children);
				}, duration.css+10);
			} else {
				// jQuery .animate fallback for browsers that don't support CSS transitions
				$.each(children, function(i, child) {
					// Respect the animation threshold
					if (i === threshold) { return; }
					
					child = $(child);
					
					// Set the element back to its original position
					child.animate({
						top: child.data('top'),
						left: child.data('left')
					}, {
						queue: false,
						duration: duration.jquery,
						complete: function() {
							// Clean up after ourselves once the animation has finished
							if (typeof callback !== 'undefined') {
								callback(element, $(this));
							}
						}
					});
					
					setTimeout(function() {
						restorePositioning(children);
					}, duration.jquery);
				});
			}
		},
		
		
		
		
		
		/**
		* Slides in each child element alternatively between left and right.
		*/
		altSlide = function(parent, duration) {
			// Store dimensions we'll need for calculations
			var parentWidth = parent.width(),
				parentPadding = parseInt(parent.css('padding-left'), 10) * 2,
				oddOffset = -parentWidth-parentPadding,
				evenOffset = parentWidth+parentPadding,
				children = parent.children();
			
			// Prevent scrollbars and get the height to prevent the parent from collapsing
			parent.css('overflow', 'hidden').css('height', parent.height());
			children.css('max-width', $(children[0]).width());
			
			// Offset the children and get the updated DOM element
			parent = offsetChildren(parent, function(child) {
				// Position the element off to the left or right
				var pos = {
					top:  child.offset.top,
					left: oddOffset
				};
				
				if (child.index%2 !== 0) { // even children
					pos.left = evenOffset;
				}
				
				return pos;
			});
			
			duration = normalizeDuration(duration);
			
			// Animate the elements
			runAnimationOnChildren(parent, duration, function(element, child) {
				element.css('overflow', 'auto');
				element.css('height', 'auto');
				
				child.css({
					maxWidth: 'none'
				});
			});
		},
		
		
		
		/**
		* Slides the left column in from the bottom left, and the right column from the bottom right.
		*/
		twoColSlide = function(parent, duration) {
			// Store dimensions we'll need for calculations
			var leftParentOffset = parent.position().left,
				topOffset = $(window).height() + $(document).scrollTop();
			
			// Get the height to prevent the parent from collapsing
			parent.css('height', parent.height());
			
			// Offset the children and get the updated DOM element
			parent = offsetChildren(parent, function(child) {
				// Position the element at the bottom left or right of the window
				var pos = {
					top:  topOffset,
					left: -leftParentOffset
				};
				
				if (child.index%2 !== 0) { // event children
					pos.left = child.offset.left + leftParentOffset;
				}
				
				return pos;
			});
			
			duration = normalizeDuration(duration);
			
			// Animate the elements
			runAnimationOnChildren(parent, duration, function(element, child) {
				element.css('height', 'auto');
			});
		};
	
	
	
	// For each element in the animation queue
	$.each(animeQueue, function(i, animeElement) {
		animeElement = $(animeElement);
		
		// Two column grid animation
		if (animeElement.hasClass('two-col')) {
			if (win.width()> 959) {
				twoColSlide(animeElement, {
					css: 1000,
					jquery: 850
				});
			} else {
				altSlide(animeElement, {
					css: 500,
					jquery: 350
				});
			}
		}
	});
}(jQuery));