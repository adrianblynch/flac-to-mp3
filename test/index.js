// TODO: Make this a proper test suite

var f2m = require("../")

f2m.convert(
	"path/to/file.flac",
	function(data) {
		console.log(data.err.toString());
	}
)
