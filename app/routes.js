// app/routes.js

//Requires
var request = require('request')
,	cheerio = require('cheerio');

//Variables
var URL 			= process.env.SOURCE_URL
,	ONE_HOUR 		= 60 * 60 * 1000
,	last_check 		= ''
,	leave_figure	= 0
,	stay_figure		= 0
,	decision		= "";

module.exports = function(app, passport) {
	app.get('*', function (req, res) {
		data_check(function() {
			var data = {
				leave: leave_figure,
				stay: stay_figure,
				decision: decision
			}
			
			res.render('index', {
				title: 'In or Out?',
				data: data
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