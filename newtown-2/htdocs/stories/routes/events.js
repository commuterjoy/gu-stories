var fs = require('fs')
  , marked = require('marked');

exports.list = function(req, res){
  res.render('events', {})
};

exports.readme = function(req, res){
  marked.setOptions({
	gfm: true,
	pedantic: false
	});
  var readme = fs.readFileSync('README.md');
  res.set('Content-Type', 'text/html');
  res.send(200, readme);
};

exports.get = function(req, res){
  res.render('event', {})
};

function expand_meta_events(meta) {
	return meta.events.map(function(event_id){
		return JSON.parse(fs.readFileSync('db/meta/' + event_id + '.json'));
	})
}

function things(req, res, thing) {
  var finder = require('findit').find("db/world")
    , results = []
    , meta = JSON.parse(fs.readFileSync('db/meta/' + req.params.id + '.json'))
    , meta_events = expand_meta_events(meta)
    , quantity = req.query.quantity || 10;	

  finder.on('file', function (file, stat) {
	
	var article = JSON.parse(fs.readFileSync(file))
	  , people = article.entities.map(function(item) {
		return item;
	}).filter(function (item) {
		//return (item.entity === 'Person' && (item.text.indexOf(' ') >= 0))
		//return (item.entity === 'Location')
		//return (item.entity === 'Organisation')
		return (item.entity === thing)
	});

	results.push(people)
  });
  
  finder.on('end', function () {

	var frequency = {};

	results.forEach(function (result) {
		result.forEach(function(entity) {
			if (frequency[entity.text])
				frequency[entity.text] = frequency[entity.text] + entity.frequency;
			else
				frequency[entity.text] = entity.frequency;
		})
	});

	var sortable = [];
	for (var f in frequency)
		sortable.push([f, frequency[f]])
	var sorted = sortable.sort(function(a, b) {return b[1] - a[1]})
		
	res.render('people', { "title": "People", "people": sorted, "meta": meta, "events": meta_events, "quantity": quantity });
  });
}

exports.people = function(req, res){
	things(req, res, 'Person')
}

exports.orgs = function(req, res){
	things(req, res, 'Organisation')
}

exports.locations = function(req, res){
	things(req, res, 'Location')
}

exports.timeline = function(req, res){
	var meta = JSON.parse(fs.readFileSync('db/meta/' + req.params.id + '.json'));
	res.render('timeline', { "title": "Timeline", "meta": meta });
}

exports.analysis = function(req, res){
	var meta = JSON.parse(fs.readFileSync('db/meta/' + req.params.id + '.json'));
  	var meta_events = expand_meta_events(meta);	
	var docs = meta.analysis.map(function(collection) {
		var docs = {};
		docs[collection.title] = collection.documents.map(function(path) { 
			return JSON.parse(fs.readFileSync('db/world/newtown-shooting/' + path));
		});
		return docs;
	})
	res.render('analysis', { "title": "Analysis", "meta": meta, "documents": docs, "events": meta_events });
}

exports.reaction = function(req, res){
	var meta = JSON.parse(fs.readFileSync('db/meta/' + req.params.id + '.json'));
  	var meta_events = expand_meta_events(meta);	
	var docs = meta.reaction.map(function(path){
		return JSON.parse(fs.readFileSync('db/world/newtown-shooting/' + path));
	})
	res.render('reaction', { "title": "Reaction", "meta": meta, "documents": docs, "events": meta_events });
}

exports.latest = function(req, res){
	var meta = JSON.parse(fs.readFileSync('db/meta/' + req.params.id + '.json'));
  	var meta_events = expand_meta_events(meta);	
	var docs = meta.documents.map(function(path){
		return JSON.parse(fs.readFileSync('db/world/newtown-shooting/' + path + '.json'));
	})
	res.render('latest', { "title": "Latest", "meta": meta, "documents": docs, "events": meta_events });
}

exports.background = function(req, res){
	var meta = JSON.parse(fs.readFileSync('db/meta/' + req.params.id + '.json'));
  	var meta_events = expand_meta_events(meta);	
	res.render('background', { "title": "Background", "meta": meta, "events": meta_events });
}

exports.pictures = function(req, res){
  
  var finder = require('findit').find("db/")
    , results = []
    , meta = JSON.parse(fs.readFileSync('db/meta/' + req.params.id + '.json'))
    , meta_events = expand_meta_events(meta);	

  finder.on('file', function (file, stat) {
	var article = JSON.parse(fs.readFileSync(file))
	var isPicture = article.contentApi.tags.some(function(tag) {
		return (tag.id === 'type/gallery') // eyewitness is 'type/picture'
	});
	if (isPicture) results.push(article)
  });
  
  finder.on('end', function () {

	// sort by latest
	var sorted = results.sort(function(a, b){
		return new Date(a.contentApi.webPublicationDate) < new Date(b.contentApi.webPublicationDate) ? 1 : -1;   
	})

	res.render('pictures', { "title": "Pictures", "results": sorted, "meta": meta, "events": meta_events });
  });

};
