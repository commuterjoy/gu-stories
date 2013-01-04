
var fs = require('fs');

// ...
function expand_meta_events (meta) {
	return meta.events.map(function(event_id){
		return JSON.parse(fs.readFileSync('db/meta/' + event_id + '.json'));
	})
}

// ... 
function Event () {

        // Expand the meta event configuration
	this.meta = function (id) {
		var info = JSON.parse(fs.readFileSync('db/meta/' + id + '.json'))
          	  , expanded = expand_meta_events(info);
		return { "info": info, "expanded": expanded  }
	}

	// Expands an array document id's - LATER: could replace with tag search
	this.expand = function (docs) {
		return docs.map(function(path){
			return JSON.parse(fs.readFileSync('db/world/newtown-shooting/' + path));
		})
	}

	// Extracts a list of given things (AKA. Entities extracted by the Stanford NER)
	this.things = function(id, thing, quantity, callback) {

		  var finder = require('findit').find("db/world")
		    , results = []
		    , quantity = quantity || 10;	

		  finder.on('file', function (file, stat) {
			var article = JSON.parse(fs.readFileSync(file))
			  , people = article.entities.map(function(item) {
				return item;
			}).filter(function (item) {
				if (thing === 'Person')
					return (item.entity === 'Person' && (item.text.indexOf(' ') >= 0)) // HACK: Avoid single word names
				else
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
			var by_frequency = sortable.sort(function(a, b) {return b[1] - a[1]})
		
			callback(by_frequency)
	
		  });
	}

	// Expands groups of analysis 
	this.analysis = function (docs) {
		return docs = docs.map(function(collection) {
			var d = {};
			d[collection.title] = collection.documents.map(function(path) { 
				return JSON.parse(fs.readFileSync('db/world/newtown-shooting/' + path));
			});
			return d;
		})
	}

	// Extract photo's from an array of document id's
	this.pictures = function(id, callback){
	 	var finder = require('findit').find("db/")
	    	  , results = []
	          , meta = JSON.parse(fs.readFileSync('db/meta/' + id + '.json'))
	          , meta_events = expand_meta_events(meta);	

	  	finder.on('file', function (file, stat) {
			var article = JSON.parse(fs.readFileSync(file))
			var isPicture = article.contentApi.tags.some(function(tag) {
				return (tag.id === 'type/gallery') // LATER eyewitness is 'type/picture'
			});
			if (isPicture) results.push(article)
		  });
  
	  	finder.on('end', function () {
			var by_webPublicationDate = results.sort(function(a, b){
				return new Date(a.contentApi.webPublicationDate) < new Date(b.contentApi.webPublicationDate) ? 1 : -1;   
			})
			callback(by_webPublicationDate)
	  	});

	};
}

module.exports = Event;


