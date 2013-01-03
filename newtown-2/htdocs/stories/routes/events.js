
var fs = require('fs')
  , event = require('../models/events');

exports.readme = function (req, res) {
	var readme = fs.readFileSync('README.md');
	res.set('Content-Type', 'text/html');
	res.send(200, readme);
};

exports.people = function (req, res) {
	var meta = new event().meta(req.params.id)
	  , people = new event().things(req.params.id, 'Person', req.query.quantity, function(t) {
		res.render('people', {  "people": t, "events": meta.expanded, "meta": meta.info, "quantity": req.query.quantity });
	});
}

exports.orgs = function (req, res){
	var meta = new event().meta(req.params.id)
	  , orgs = new event().things(req.params.id, 'Organisation', req.query.quantity, function(t) {
		res.render('people', {  "people": t, "events": meta.expanded, "meta": meta.info, "quantity": req.query.quantity });
	});
}

exports.locations = function (req, res){
	var meta = new event().meta(req.params.id)
	  , location = new event().things(req.params.id, 'Location', req.query.quantity, function(t) {
		res.render('people', {  "people": t, "events": meta.expanded, "meta": meta.info, "quantity": req.query.quantity });
	});
}

exports.reaction = function (req, res) {
	var meta = new event().meta(req.params.id)
	  , reaction = new event().expand(meta.info.reaction);
	res.render('reaction', { "events": meta.expanded, "meta": meta.info, "documents": reaction })
}

exports.latest = function (req, res) {
	var meta = new event().meta(req.params.id)
	  , latest = new event().expand(meta.info.documents);
	res.render('latest', { "events": meta.expanded, "meta": meta.info, "documents": latest })
}

exports.background = function (req, res) {
	var meta = new event().meta(req.params.id);
	res.render('background', { "events": meta.expanded, "meta": meta.info });
}

exports.pictures = function(req, res){
	var meta = new event().meta(req.params.id)
	  , pics = new event().pictures(req.params.id, function(p) {
		res.render('pictures', { "results": p, "events": meta.expanded, "meta": meta.info });
	});
};

exports.analysis = function (req, res) {
	var meta = new event().meta(req.params.id)
	  , analysis = new event().analysis(meta.info.analysis)
	res.render('analysis', { "events": meta.expanded, "meta": meta.info, "documents": analysis })
}


