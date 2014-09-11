var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/:username', function(req, res) {
  	request({
    		url: "http://ws.audioscrobbler.com/2.0/?method=user.getinfo&user="+req.param("username")+"&api_key=55a3efd55018c6023197280946f578a2&format=json",
    		json: true
	}, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			timeStart = body.user.registered.unixtime;
			timeEnd = (new Date()).getTime()/1000;
			days = Math.floor((timeEnd-timeStart)/(60*60*24));
			avgPlaysDaily = Math.floor(body.user.playcount/days);
			res.render('stats-daily',{avgPlaysDaily: avgPlaysDaily, avatar : body.user.image[3]['#text'] , data: body});
		}
	})
});


module.exports = router;
