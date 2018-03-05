var fs = require("fs")
var childProcess = require("child_process")

//convert single file
//bitrate is in thousands
function convert(file, onData, onDone, bitrate) {
	if (bitrate === undefined){bitrate=320}			//makes bitrate an optional argument, default is 320
	if (typeof bitrate!=="number"){throw new Error("(flac-to-mp3) Bitrate argument must be an integer")}
	var args = [
		"-i", file,
		"-ab", bitrate.toString()+"k",
		"-map_metadata", "0",
		"-id3v2_version", "3",
		"-y",
		file.replace(/.flac$/i, ".mp3")
	]

	var ffmpeg = childProcess.spawn("ffmpeg", args)

	// NOTE: ffmpeg outputs to standard error - Always has, always will no doubt

	ffmpeg.stdout.on("data", function(data) {
		onData({out: data})
	})
	ffmpeg.stderr.on("data", function(data) {
		onData({err: data})
	})
	ffmpeg.stderr.on("close", function(){
		onDone()
	})
};

exports.convert = convert

//The directory convert function. Does not go into subfolders.
exports.convertDir = function(dir, onData, onDone, bitrate) {
	var i=0;
	var list=fs.readdirSync(dir)//get directory listing
	function loop(){			//recursive function
		if(i<list.length){										
			if(list[i].toLowerCase().split(".")[1]==="flac"){					//without this check it overwrites existing mp3 files with 0 bytes
				convert(dir+"/"+list[i], onData,loop, bitrate)	//call the convert function
			}else{
				i++;	//increase the count to avoid infinite loop B)
				loop()	//call the function again
			}
		}else{
			onDone()	//Only called when entire directory is done
		}
		i++
	}
	loop()
}
