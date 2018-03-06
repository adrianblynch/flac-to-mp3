'use strict';

const http = require('http');
const fs = require('fs');

const FlacConverter = require('../lib/index');

const testFiles = [
  'http://www.eclassical.com/custom/eclassical/files/BIS1536-001-flac_16.flac',
  // 'http://www.eclassical.com/custom/eclassical/files/BIS1536-001-flac_24.flac',
  // 'http://www.eclassical.com/custom/eclassical/files/BIS1447-002-flac_16.flac',
  // 'http://www.eclassical.com/custom/eclassical/files/BIS1447-002-flac_24.flac',
];

const downloadDir = './test/resources/test-dir/';

describe('FlacConverter TEST', () => {
  const converter = new FlacConverter();

  beforeAll(async () => {
    const download = (url, dest) => new Promise((resolve, reject) => {
      const file = fs.createWriteStream(dest);
      http.get(url, response =>
        response.pipe(file)
          .on('finish', () => {
            file.close(resolve);
          })
          .on('error', (err) => {
            fs.unlink(dest);
            reject(err);
          }));
    });

    // TODO don't download the file if already present

    await Promise.all(testFiles.map(urlFlacFile =>
      download(urlFlacFile, `${downloadDir}${new Date().getTime()}.flac`)));
  }, 500000);

  test('Convert a FLAC file', () =>
    converter.convertFile('./test/resources/to-convert.flac')
      .then((file) => {
        expect(file.code).toBe(0);
        expect(file.fileConverted).toMatch(/resources\/to-convert.mp3$/);
        // TODO check the file system
      }));

  test('Convert a directory with only FLAC files', () =>
    converter.convertDirectory(downloadDir)
      .then((files) => {
        expect(files).toHaveLength(testFiles.length);
      }), 240000);

  afterAll(() => {
    // TODO remove all the mp3 files created
  });
});
