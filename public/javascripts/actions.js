$(document).ready(function() {

	var socket = io.connect('clrclb.nodejitsu.com');
	// var socket = io.connect('http://localhost');

	socket.on('color event', function (data) {
		$('#'+data.id).css({ 'background-color': data.color });
	});

	socket.on('set active', function(data) {
		$('#'+data.id).toggleClass('in-use', true);
	});

	socket.on('set inactive', function(data) {
		$('#'+data.id).toggleClass('in-use', false);
	});

	var colorboxes = $('.colorbox');

	var last_msg = $.now();

	colorboxes.each( function(){
		var this_colorbox = $(this);
		var this_id = $(this).attr('id');
		$(this).spectrum({
			clickoutFiresChange: true,
			showAlpha: false,
			change: function(color){
				// this_colorbox.css({'background-color':color.toHexString()});
				socket.emit('changed color', { 'id':this_id, 'color':color.toHexString() });
			},
			move: function(color){
				// this_colorbox.css({'background-color':color.toHexString()});
				if( $.now() - last_msg > 100 ){
					socket.emit('changed color', { 'id':this_id, 'color':color.toHexString() });
					last_msg = $.now();
				}
			},
			show: function(color){
				socket.emit('make active', { 'id': this_id });
			},
			hide: function(color){
				socket.emit('make inactive', { 'id': this_id });
			}
		});
	});



});