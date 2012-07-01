// @codekit-prepend "jquery.history.js"
// @codekit-prepend "anime.js"
// @codekit-prepend "jquery.inview.js"
(function($) {
	var body = $(document.body),
		transitionButtons = body.find('.page-transition-button'),
		transitionForms = body.find('.page-transition-form'),
		History = window.History;
	
	// @TODO Animate the background image in if we're on the home page
	if (body.hasClass('home-page')) {
		anime.showMural();
	}
	
	// Remove the initial class after 2 seconds
	setTimeout(function() { body.removeClass('initial'); }, 2000);
	
	History.replaceState({home: true}, '', window.location);
	
	$(window).on('statechange', function() {
		var State = History.getState();
		
		// @TODO Prevent menubar from sliding in on homepage when going back
		// @TODO We need a loader for while content is coming in (only if it hasn't come in after a short delay)
		$.ajax({
			url: State.url,
			type: 'GET',
			data: State.data,
			success: function(response) {
				var title;
				
				response = $('<html />').html(response);
				title = response.find('title').text();
				
				document.title = title;
				
				anime.transitionPageTo(response.find('#wrap'), State.data);
			}
		});
	});
	
	
	
	transitionButtons.each(function(index, button) {
		button = $(button);
		
		button.on('click', function(e) {
			e.preventDefault();
			
			var that = $(this),
				data = {
					home: that.hasClass('home-link')
				};
			
			History.pushState(data, '', that.attr('href'));
		});
	});
	
	transitionForms.each(function(index, form) {
		form = $(form);
		
		form.on('submit', function(e) {
			e.preventDefault();
			
			var that = $(this),
				fields = that.find('input, textarea'),
				formData = '';
			
			fields.each(function(index, field) {
				field = $(field);
				
				if (field.attr('name') !== undefined) {
					formData += field.attr('name')+'='+encodeURIComponent(field.val());
				}
			});
			
			History.pushState(null, '', that.attr('action')+'?'+formData);
		});
	});
}(jQuery));