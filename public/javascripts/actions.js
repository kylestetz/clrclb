$(document).ready(function() {

	var socket = io.connect('clrclb.nodejitsu.com');
	socket.on('color event', function (data) {
		// console.log("got a color event on the client side: " + data.id + "  " + data.color);
		$('#'+data.id).css({ 'background-color': data.color });
	});

	var colorboxes = $('.colorbox');

	var last_msg = $.now();

	colorboxes.each( function(){
		var this_colorbox = $(this);
		var this_id = $(this).attr('id');
		$(this).spectrum({
			clickoutFiresChange: true,
			showAlpha: true,
			change: function(color){
				// this_colorbox.css({'background-color':color.toHexString()});
				socket.emit('changed color', { 'id':this_id, 'color':color.toHexString() });
			},
			move: function(color){
				this_colorbox.css({'background-color':color.toHexString()});
				if( $.now() - last_msg > 33 ){
					socket.emit('changed color', { 'id':this_id, 'color':color.toHexString() });
					last_msg = $.now();
				}
			}
		});
	});



});