// TODO: Make this a proper test suite

var f2m = require("../")

// Full dir for now - Should be relative to this file
f2m.convertDir("/Users/adrian.lynch/Play/Node/flac-to-mp3/test/files/", function(data) {
	console.log("Line:" + data)
})