var leave_count = '';
var stay_count = '';	
var button_animation;
var loaded = false;
var audio_count = 1;
var options = {
	useEasing : true, 
	useGrouping : true, 
	separator : ',', 
	decimal : '.', 
	prefix : '', 
	suffix : '' 
};

var static_images = [
		'/img/belly_buttons.png',
		'/img/dude_short.png',
		'/img/dude.png',
		'/img/facebook.png',
		'/img/twitter.png'
	];

if(Modernizr.audio.mp3) {
	var audio = [
		'../audio/burp_1.mp3',
		'../audio/burp_2.mp3'
	];
} else {
	var audio = [
		'../audio/burp_1.ogg',
		'../audio/burp_2.ogg'
	];
}

soundManager.setup({
	url: "/js/swf/",
	useHTML5Audio: true,
	preferFlash: false,
	flashVersion: 9,
	useHighPerformance: true,
	debugMode: false,
	debugFlash: false,
	flashLoadTimeout: 1000
});

$(document).ready(function(){
	$('.preload_text').blink();
	
	$('.social_icons_trigger').on("click", function(e){
		e.preventDefault();
		
		$('.social_icons').fadeToggle(200);
	});
	
	$(".timer_numbers").countdown(data.countdown_date, function(event) {
		$(this).text(
			event.strftime('%D:%H:%M:%S')
		);
	});
	
	if(data.decision == "in") {
		button_animation = [0,1,2,4,5,6,8,9,10,3,7,11];
	} else {
		button_animation = [0,1,2,4,5,6,8,9,10,3,7,11];
	}
	
	stay_count = new CountUp("count-stay", 0, data.stay, 0, 2, options);
	leave_count = new CountUp("count-leave", 0, data.leave, 0, 2, options);
	
	$(".belly_button").animateSprite({
		columns: 13,
	    fps: 24,
	    animations: {
	        intro: button_animation
	    },
	    loop: false,
	    autoplay: false,
	    complete: function(){
	        // use complete only when you set animations with 'loop: false'
	        
	    }
	});
	
	soundInit(function(ready){
		if(ready) {
			preload();
		}
	});
});

//FACEBOOK
window.fbAsyncInit = function() {
    FB.init({
      appId      : '194800020920404',
      xfbml      : true,
      version    : 'v2.6'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
   
//TWITTER
!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');

//SOUND & PRELOAD
function soundInit(callback) {
	soundManager.ontimeout(function(status) {
		soundManager.flashLoadTimeout = 0;
  		soundManager.onerror = {};
    	soundManager.reboot(); 
	});

	soundManager.onready(function() {
		callback(1);
	});
}

function preload() {
	var loader = new PxLoader();
	
	//Audio
	audio.forEach(function(item){
		loader.add(new PxLoaderSound('burp_'+audio_count,item));
		audio_count = audio_count + 1;
	});
	
	//Static Images	
	static_images.forEach(function(item) {
		loader.add(new PxLoaderImage(item));
	});
	
	loader.addProgressListener(function(e) { 
	    //console.log(e.resource.getName()); 
	}); 
	
	loader.addCompletionListener(function(e) {
		loaded = true;
		
		init_scene();
	});
	
	loader.start();
}

function start_sounds() {
	setTimeout(function(){
		var track_num = randomIntFromInterval(1,2);
		play_sound(track_num);
		
		setInterval(function(){
			var track_num = randomIntFromInterval(1,2);
			play_sound(track_num);
		}, 30000)
	}, 5000);
}

function play_sound(track_num) {
	var track = soundManager.getSoundById('burp_'+track_num);
	track.play();
}

//SCENE CONTROL
function init_scene() {
	$('.preload').fadeOut(800);
	
	$('.content').delay(600).fadeIn(800, function(){
		setTimeout(function(){
			
			//Start Animations
			start_sounds();
			stay_count.start();
			leave_count.start();
			$(".belly_button").animateSprite('play', 'intro');
			
		}, 300);
	});
}

//BLINK
(function ($) {
	$.fn.blink = function (options) {
		var defaults = { delay: 500 };
		var options = $.extend(defaults, options);
		return $(this).each(function (idx, itm) {
			setInterval(function () {
				if ($(itm).css("display") === "table-cell") {
					$(itm).fadeOut(200);//.css('visibility', 'hidden');
				}
				else {
					$(itm).fadeIn(300);//.css('visibility', 'visible');
				}
			}, options.delay);
		});
	}
} (jQuery))

//Random Number
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}