'use strict';

const FlacConverter = require('../lib/index');

describe('FlacConverter TEST', () => {
  const converter = new FlacConverter();

  test('Convert a FLAC file', () =>
    converter.convertFile('./test/resources/to-convert.flac')
      .then((file) => {
        expect(file.code).toBe(0);
        expect(file.fileConverted).toMatch(/resources\/to-convert.mp3$/);
        // TODO check the file system
      }));

  test('Convert a directory with only FLAC files', () =>
    converter.convertDirectory('./test/resources/test-dir/')
      .then((files) => {
        expect(files).toHaveLength(2);
      }));

  afterAll(() => {
    // TODO remove all the mp3 files
  });
});
