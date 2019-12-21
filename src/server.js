const Router = require("koa-router");
const App = require("koa");
const bodyParser = require("koa-bodyparser");
const axios = require("axios");
const { config } = require("dotenv");

config();

const { TS_API_KEY } = process.env;

const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TS_API_KEY}`;

const router = new Router();

router.post("/api/speak/", bodyParser(), async ctx => {
  const { text } = ctx.request.body;
  const request = {
    input: { text },
    voice: {
      languageCode: "pl-PL",
      name: "pl-PL-Wavenet-B"
    },
    audioConfig: {
      audioEncoding: "LINEAR16",
      pitch: 0,
      speakingRate: 1
    }
  };
  const response = await axios.post(endpoint, request);
  const { audioContent } = response.data;
  const decodedAudio = Buffer.from(audioContent, "base64");

  ctx.response.headers["Content-Type"] = "audio/mpeg";

  ctx.body = decodedAudio;
});

const app = new App();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 8080);
