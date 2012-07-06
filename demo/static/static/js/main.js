// @codekit-prepend "jquery.history.js"
// @codekit-prepend "anime.js"
// @codekit-prepend "jquery.inview.js"
(function($) {
	var body = $(document.body),
		History = window.History;
	
	// Animate the background image in if we're on the home page
	if (body.hasClass('home-page')) {
		anime.showMural();
	}
	
	// Remove the initial class after 2 seconds
	setTimeout(function() { body.removeClass('initial'); }, 2000);
	
	// @TODO Why do I do this?
	//History.replaceState({home: true}, '', window.location);
	
	$(window).on('statechange', function() {
		var State = History.getState();
		
		// @TODO We need a loader for while content is coming in (only if it hasn't come in after a short delay)
		$.ajax({
			url: State.url,
			type: State.data.method || 'GET', // Defaults to GET
			data: State.data,
			success: function(response) {
				var title,
					scripts = $(response).filter('script'); // @TODO There are 3 scripts that will always show up here... we could optimize
				
				response = $(response).not('script'); // Prevent scripts from being executed early
				title = response.filter('title').text();
				
				document.title = title;
				anime.transitionPageTo(response.filter('#wrap'), response.filter('#toolbar'), response.filter('#footer'), scripts, State.data);
			}
		});
	});
	
	
	body.on('click', '.page-transition-button', function(e) {
		e.preventDefault();
		
		var that = $(this),
			data = {
				home: that.hasClass('home-link')
			};
		
		History.pushState(data, '', that.attr('href'));
	});
	
	
	body.on('submit', '.page-transition-form', function(e) {
		e.preventDefault();
		
		var that = $(this),
			method = that.attr('method').toLowerCase(),
			fields = that.find('input, textarea'),
			formData;
		
		// GET request
		if (method === 'get') {
			formData = '';
			
			fields.each(function(index, field) {
				field = $(field);
				
				if (field.attr('name') !== undefined) {
					formData += field.attr('name')+'='+encodeURIComponent(field.val());
				}
			});
			
			History.pushState(null, '', that.attr('action')+'?'+formData);
		// POST request
		} else if (method === 'post') {
			// @TODO This is totally broken
			formData = {method: 'POST'};
			
			fields.each(function(index, field) {
				field = $(field);
				
				if (field.attr('name') !== undefined) {
					if (field.attr('type') === 'checkbox') {
						// Checkboxes must have their value checked in this way
						if (field.is(':checked')) {
							formData[field.attr('name')] = true;
						}
					} else {
						formData[field.attr('name')] = field.val();
					}
				}
			});
			console.log(formData, that.attr('action'));
			History.pushState(formData, '', that.attr('action'));
		}
	});
}(jQuery));