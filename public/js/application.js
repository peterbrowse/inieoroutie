var options = {
		useEasing : true, 
		useGrouping : true, 
		separator : ',', 
		decimal : '.', 
		prefix : '', 
		suffix : '' 
	};

$(document).ready(function(){
	
	var stay_count = new CountUp("count-stay", 0, data.stay, 0, 2, options);
	var leave_count = new CountUp("count-leave", 0, data.leave, 0, 2, options);
	stay_count.start();
	leave_count.start();
	
	//dude_align();
});

function dude_align() {
	var dude_height = $('.the_dude').height();
	var wh = $(window).height();
}