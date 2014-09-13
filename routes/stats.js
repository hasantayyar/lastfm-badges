var express = require('express');
var router = express.Router();
var request = require('request');
var cloudinary = require('cloudinary');
var fs = require('fs');

router.get('/:username', function(req, res) {
  	request({
    		url: "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user="+req.param("username")+"&api_key=55a3efd55018c6023197280946f578a2&format=json",
    		json: true
	}, function (error, response, body) {
		var path = "/home/tayyar/Dropbox/Scripts/node-projects/lastfm-badges/public/images/";
		if (!error && response.statusCode === 200) {
			timeStart = body.user.registered.unixtime;
			timeEnd = (new Date()).getTime()/1000;
			days = Math.floor((timeEnd-timeStart)/(60*60*24));
			avgPlaysDaily = Math.floor(body.user.playcount/days);

			cloudinary.config({ 
			  cloud_name: 'hasantayyar', 
			  api_key: '234667151491746', 
			  api_secret: 'GI8cY1kmNm8sJkscX17M9FREfRI' 
			});
			/*
			cloudinary.uploader.text("Dark style 10", function(result){},
                          {
                            public_id: "ds10",
                            font_family: "Yellowtail", font_size: 120,
                            font_color: "#343434", opacity: 90
                          });
			cloudinary.uploader.text("Dark style 3", function(result){},
                          {
                            public_id: "ds3",
                            font_family: "Yellowtail", font_size: 40,
                            font_color: "#343434", opacity: 90
                          });
			*/


			var badge = cloudinary.image("badge.png", { 
				transformation:[
				{
					overlay: "text:ds10:"+avgPlaysDaily, 
					gravity: 'south_east', x: 120, y: 150
				},
				{overlay: "text:ds3:Daily",gravity: 'north_east', x: 140, y: 60},
				{overlay: "text:ds3:Listens",gravity: 'south_east', x: 140, y: 70}
				]});
			res.render('stats-daily',{ badge: badge, avgPlaysDaily: avgPlaysDaily, avatar : body.user.image[3]['#text'] , data: body});
		}
	})
});


module.exports = router;
