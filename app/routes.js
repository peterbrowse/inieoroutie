// app/routes.js

//Requires
var request = require('request')
,	cheerio = require('cheerio');

//Variables
var URL 			= process.env.SOURCE_URL
,	ONE_HOUR 		= 600000
,	last_check 		= ''
,	leave_figure	= 0
,	stay_figure		= 0
,	decision		= "";

module.exports = function(app, passport) {
	app.get('/', function (req, res) {
		data_check(function() {
			
			var button_url = "";
			var right_now = new Date();
			var future_date = new Date("2016-06-10T00:00:00");
			var polling_starts = new Date("2016-06-23T07:00:00");
			var voting_closes = new Date("2016-06-23T22:00:00");
			
			if(right_now < future_date) {
				var the_message = "Till registration closes";
				var countdown_date = "2016/06/10 00:00:00";
				button_url = "https://www.eureferendum.gov.uk/register-to-vote/";
			} else if(right_now > future_date && right_now < polling_starts) {
				var the_message = "Voting opens"
				var countdown_date = "2016/06/23 07:00:00";
			} else if(right_now > polling_starts && right_now < voting_closes) {
				var the_message = "Voting closes"
				var countdown_date = "2016/06/23 22:00:00";
			} else {
				var the_message = "Voting closed"
				var countdown_date = "2016/06/23 22:00:00";
			}
			
			var data = {
				leave: leave_figure,
				stay: stay_figure,
				decision: decision,
				countdown_date: countdown_date,
				timer_message: the_message,
				button_url: button_url
			}
			
			res.render('index', {
				title: 'Innie or Outie?',
				data: data,
				timer_message: the_message,
				button_url: button_url
			});
		});
	});
}

function time_check(callback) {
	if(((new Date) - last_check) > ONE_HOUR) {
		last_check = new Date().getTime();
		
		if(callback){
			callback(true);	
		}
	} else {
		if(callback){
			callback(false);
		
		}
	}
}

function data_check(callback) {
	time_check(function(data) {
		if(data){
			request(URL, function(error, response, body) {
				if (!error) {
					var $ = cheerio.load(body);
					
					stay_figure 	= parseInt(($('g.latest text').first().text()).slice(0,-1));
					leave_figure	= parseInt(($('g.latest text').last().text()).slice(0,-1));
					
					if(stay_figure > leave_figure) {
						decision = "in";
					} else if(stay_figure < leave_figure) {
						decision = "out";
					} else {
						decision = "undecided";
					}
					
				} else {
					console.log("We’ve encountered an error: " + error);
				}
				
				callback();
			});
		} else {
			callback();
		}
	});
}