const axios = require("axios");

const { TS_API_KEY } = process.env;
const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TS_API_KEY}`;

async function synthesizeText(text) {
  const request = {
    input: { text },
    voice: {
      languageCode: "pl-PL",
      name: "pl-PL-Wavenet-B"
    },
    audioConfig: {
      audioEncoding: "LINEAR16",
      pitch: 0,
      speakingRate: 0.9
    }
  };
  const response = await axios.post(endpoint, request);
  const { audioContent } = response.data;
  return Buffer.from(audioContent, "base64");
}

module.exports = { synthesizeText };
