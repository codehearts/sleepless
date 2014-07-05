/**
* Returns a box-styled element for injection into the DOM
*
* @param string class Any additonal classes to apply to the box.
* @param string checkbox The name attribute for the box's checkbox (the box will not be a checkbox box if this is not specified). The heading or subheading must contain the string "%(checkbox)s" for the checkbox to be rendered
* @param string heading The box's heading.
* @param string subheading The box's subheading.
* @param string body The box's contents.
*/
var Box = function(args) {
	var defaults = {
			'class':    '',
			checkbox:   undefined,
			heading:    undefined,
			subheading: undefined,
			body:       undefined
		},
		args = $.extend(defaults, args),
		box  = $('<div class="box" />').addClass(args.class),
		checkboxHTML;
	
	// Create the checkbox element, if needed
	if (args.checkbox !== undefined) {
		box.addClass('check-box');
		
		checkboxHTML = '<input type="checkbox" name="'+args.checkbox+'" />';
	}
	
	// Add the heading, if specified
	if (args.heading !== undefined) {
		// Add the checkbox to the heading, if it exists
		if (args.checkbox !== undefined) {
			args.heading = interpolate(args.heading, {checkbox: checkboxHTML}, true);
		// Otherwise just create the heading
		} else {
			box.append($('<p class="box-hd" />').html(args.heading));
		}
	}
	
	// Add the subheading, if specified
	if (args.subheading !== undefined) {
		// Add the checkbox to the subheading, if it exists and no heading was specified
		if (args.checkbox !== undefined && args.heading === undefined) {
			args.subheading = interpolate(args.subheading, {checkbox: checkboxHTML}, true);
			box.append($('<label class="box-shd" />').html(args.subheading));
		// Otherwise just create the subheading
		} else {
			box.append($('<p class="box-shd" />').html(args.subheading));
		}
	}
	
	// Add the body, if specified
	if (args.body !== undefined) {
		box.append($('<p class="box-bd" />').html(args.body));
	}
	
	return box;
},










/**
* Returns an origami-style element for injection into the DOM.
*/
Origami = function(args) {
	var defaults = {
			id:      '',
			'class': '',
			element: 'div',
			content: '',
			numeral: undefined,
			caption: ''
		},
		args = $.extend(defaults, args),
		
		origami = $('<'+args.element+' class="origami" />').addClass(args.class).attr('id', args.id),
		heading = $('<header class="origami-header" />').appendTo(origami),
		footer  = $('<footer class="origami-footer" />').appendTo(origami),
		
		content = $('<div class="origami-content" />').text(args.content).appendTo(heading),
		caption = $('<p class="origami-caption" />').text(args.caption).appendTo(footer);
	
	// Add the numeral, if specified
	if (args.numeral !== undefined) {
		content.prepend($('<p class="origami-num" />').text(args.numeral));
	}
	
	return origami;
};