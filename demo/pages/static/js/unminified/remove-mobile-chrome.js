(function($) {
	// @TODO Use that read-only iOS boolean to determine if we're already in fullscreen mode
	// @TODO Use said boolean to recommend iOS users to add Sleepless to their homescreen
	// Hide the address bar on mobile browsers
	(function(win) {
		var doc = win.document;
		
		// If there's a hash, or addEventListener is undefined, stop here
		if(!location.hash && win.addEventListener) {
			var scrollTop = 1,
				getScrollTop = function(){
					return win.pageYOffset || doc.compatMode === 'CSS1Compat' && doc.documentElement.scrollTop || doc.body.scrollTop || 0;
				},
				bodycheck = setInterval(function() {
					// Do nothing if the page has already been scrolled down
					if (getScrollTop() !== 0) { return; }
					
					// scroll to 1
					window.scrollTo(0, 1);
					
					// reset to 0 on bodyready, if needed
					if(doc.body) {
						clearInterval(bodycheck);
						scrollTop = getScrollTop();
						win.scrollTo(0, scrollTop === 1 ? 0 : 1);
					}
				}, 15);
			
			win.addEventListener('load', function() {
				setTimeout(function() {
					// at load, if user hasn't scrolled more than 20 or so...
					if( getScrollTop() < 20 ) {
						// reset to hide address bar at onload
						win.scrollTo(0, scrollTop === 1 ? 0 : 1);
					}
				}, 0);
			});
		}
	})(this);
}(jQuery));