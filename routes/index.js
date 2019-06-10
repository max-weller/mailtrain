'use strict';

let express = require('express');
let router = new express.Router();
let _ = require('../lib/translate')._;

/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', {
        indexPage: true,
        title: _('Self Hosted Newsletter App')
    });
});

let lists = require('../lib/models/lists');
var startupTime=+new Date();
/* GET metrics */
router.get('/_metrics', (req, res) => {
	lists.list(0, 100, (err, rows, total) => {
		var _metrics = {};
		_metrics['uptime'] = (+new Date()) - startupTime;
		rows.forEach(item => {
			_metrics['list_subscribers{list_id="' + item.id + '",name="' + item.name + '"}'] = item.subscribers;
		});
		var body="";
		for(var k in _metrics) body += "mailtrain_" + k+" "+_metrics[k]+"\n";
		res.set('Content-Type', 'text/plain; version=0.0.4');
		res.send(body);
		
	});
});

module.exports = router;
