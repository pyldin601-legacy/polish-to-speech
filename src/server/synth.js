const axios = require("axios");

const { TS_API_KEY } = process.env;
const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TS_API_KEY}`;

async function synthesizeText(text, language) {
  const request = {
    input: { text },
    voice: language === "pl" ? {
      languageCode: "pl-PL",
      name: "pl-PL-Wavenet-B"
    } : {
      languageCode: "pt-PT",
      name: "pt-PT-Wavenet-B"
    },
    audioConfig: {
      audioEncoding: "LINEAR16",
      pitch: 0,
      speakingRate: 0.5
    }
  };

  try {
    const response = await axios.post(endpoint, request);
    const { audioContent } = response.data;
    return Buffer.from(audioContent, "base64");
  } catch (e) {
    if (e.response) {
      throw new Error(`Could not synthesize: ${JSON.stringify(e.response.data)}`);
    }
    throw e;
  }
}

module.exports = { synthesizeText };
