// TODO: Make this a proper test suite

var f2m = require("../")

f2m.convertDir(
	"./flacs",
	function(data) {
		console.log(data.err.toString())
	},
	function(){
		console.log("done")
	},
	192
)
