
var fs = require('fs');

exports.meta = function(id) {
	return JSON.parse(fs.readFileSync('db/meta/' + id + '.json');
}

exports.reactions = function(id) {
	return meta(id).reaction.map(function(path){
		return JSON.parse(fs.readFileSync('db/world/newtown-shooting/' + path));
	})
}

exports.documents = function(id) {
	return meta(id).documents.map(function(path){
		return JSON.parse(fs.readFileSync('db/world/newtown-shooting/' + path));
	})
}

exports.latest = function(id) {
	return meta(id).documents.map(function(path){
		return JSON.parse(fs.readFileSync('db/world/newtown-shooting/' + path + '.json'));
	})
}

exports.pictures = function(id, callback){
  
  var finder = require('findit').find("db/")
    , results = []
    , meta = JSON.parse(fs.readFileSync('db/meta/' + id + '.json'));

  finder.on('file', function (file, stat) {
	var article = JSON.parse(fs.readFileSync(file))
	var isPicture = article.contentApi.tags.some(function(tag) {
		return (tag.id === 'type/gallery') // eyewitness is 'type/picture' but media model is broken
	});
	if (isPicture) results.push(article)
  });
  
  finder.on('end', function () {

	// sort by latest
	var sorted = results.sort(function(a, b){
		return new Date(a.contentApi.webPublicationDate) < new Date(b.contentApi.webPublicationDate) ? 1 : -1;   
	})
	
	callback();
  });

};
