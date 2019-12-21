const Router = require("koa-router");
const App = require("koa");
const bodyParser = require("koa-bodyparser");
const axios = require("axios");
const { config } = require("dotenv");
const serve = require("koa-better-static2");

config();

const { TS_API_KEY } = process.env;
const serverPort = process.env.PORT || 8080;
const endpoint = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${TS_API_KEY}`;

const router = new Router();

router.get("/synthesize/:text", bodyParser(), async ctx => {
  const { text } = ctx.params;
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
  const decodedAudio = Buffer.from(audioContent, "base64");

  ctx.set("Content-Type", "audio/mpeg");
  ctx.set("Content-Disposition", `filename=${encodeURIComponent(text)}.mp3`);
  ctx.set("Content-Transfer-Encoding", "binary");

  ctx.body = decodedAudio;
});

const app = new App();

app.use(serve("build/client", { index: "index.html" }));

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(serverPort, () => {
  console.log(`Server is listening on port ${serverPort}`);
});
