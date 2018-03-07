'use strict';

const childProcess = require('child_process');
const fs = require('fs');
// const path = require('path');

class FlacConverter {
  constructor() {
    // this.options = options;
    this.options = {};

    this.options.nameFile = originalFileName => originalFileName.replace(/.flac$/i, '.mp3');
  }

  convertFile(filePath) {
    return new Promise((resolve, reject) => {
      const fileConverted = this.options.nameFile(filePath);
      const ffmpeg = childProcess.spawn(
        'ffmpeg',
        [
          '-i',
          filePath,
          '-loglevel', 'error',
          '-ab', '320k',
          '-map_metadata', '0',
          '-id3v2_version',
          '3',
          '-y',
          fileConverted,
        ],
      );

      // Not interesting for now
      // ffmpeg.stdout.on('data', (data) => { });
      // ffmpeg.stderr.on('data', (data) => { });

      ffmpeg.on('exit', (code, signal) => {
        if (code === 0) {
          resolve({ fileConverted, code, signal });
        } else {
          reject(new Error(`code ${code}; signal ${signal}`));
        }
      });

      ffmpeg.on('error', (code, signal) => reject(new Error(`code ${code}; signal ${signal}`)));
    });
  }

  convertDirectory(directory) {
    return new Promise((resolve, reject) => {
      fs.readdir(directory, (err, files) => {
        if (err) {
          reject(err);
          return;
        }

        // FIXME use path.join(directory, file)
        Promise.all(files
          .filter(file => /.*[.](flac)$/gim.test(file))
          .map(file => this.convertFile(`${directory}${file}`)))
          .then(filesResult => resolve(filesResult))
          .catch(errFile => reject(errFile));
      });
    });
  }
}

module.exports = FlacConverter;
