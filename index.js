var fs = require("fs")
var childProcess = require("child_process")

// var dir = "/Users/adrian.lynch/Music/Sepultura - 1996 - Roots/"
//var dir = "./"

var endsWith = function(str, end, caseInsensitive) {
	if (caseInsensitive) {
		str = str.toLowerCase()
		end = end.toLowerCase()
	}
	return str.split("").slice(-5).join("") === end
}

exports.convertDir = function(dir, onData) {

	fs.readdir(dir, function(err, fileNames) {

		fileNames = fileNames.filter(function(fileName) {
			return endsWith(fileName, ".flac", true)
		})

		fileNames.forEach(function(fileName) {

			args = [
				"-i", dir + fileName,
				"-ab", "320k",
				"-map_metadata", "0",
				"-id3v2_version", "3",
				"-y",
				dir + fileName.replace(/.flac$/i, ".mp3")
			]

			var ffmpeg = childProcess.spawn("ffmpeg", args)

			// NOTE: ffmpeg outputs to standard error - Always has, always will no doubt

			ffmpeg.stdout.on("data", onData)
			ffmpeg.stderr.on("data", onData)

		})

	})

}
