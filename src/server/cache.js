const sha1 = require("sha1");
const path = require("path");
const fs = require("fs");
const fsPromises = fs.promises;

const { AUDIO_FILES_PATH } = process.env;

function getTextCacheKey(text) {
  return sha1(text);
}

function getAudioFilePath(key) {
  return path.join(AUDIO_FILES_PATH, key[0], `${key}.mp3`);
}

function getTitleFilePath(key) {
  return path.join(AUDIO_FILES_PATH, key[0], `${key}.txt`);
}

async function createCacheDirectory(key) {
  await fsPromises.mkdir(path.join(AUDIO_FILES_PATH, key[0]), {
    recursive: true
  });
}

async function isCacheExists(key) {
  try {
    await fsPromises.access(
      getAudioFilePath(key),
      fs.constants.F_OK | fs.constants.R_OK
    );
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  getTextCacheKey,
  getAudioFilePath,
  getTitleFilePath,
  createCacheDirectory,
  isCacheExists
};
