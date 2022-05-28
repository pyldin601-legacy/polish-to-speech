const Router = require("koa-router");
const App = require("koa");
const bodyParser = require("koa-bodyparser");
const serve = require("koa-better-static2");
const {
  getTextCacheKey,
  getAudioFilePath,
  getTitleFilePath,
  createCacheDirectory,
  isCacheExists
} = require("./cache");
const { synthesizeText } = require("./synth");
const fsPromises = require("fs").promises;

function createWebApp() {
  const router = new Router();

  router.post("/synthesize", bodyParser(), async ctx => {
    const { text, language } = ctx.request.body;

    if (typeof text !== 'string') {
      ctx.throw(400);
    }

    const cacheKey = getTextCacheKey(text, language);

    if (!(await isCacheExists(cacheKey))) {
      await createCacheDirectory(cacheKey);

      const audioBuffer = await synthesizeText(text, language);

      await Promise.all([
        fsPromises.writeFile(getAudioFilePath(cacheKey), audioBuffer),
        fsPromises.writeFile(getTitleFilePath(cacheKey), text)
      ]);
    }

    ctx.body = { key: cacheKey };
  });

  router.get("/audio/:key", async ctx => {
    const { key } = ctx.params;

    const cachedAudioFilePath = getAudioFilePath(key);
    const cachedTitleFilePath = getTitleFilePath(key);

    if (!(await isCacheExists(key))) {
      return;
    }

    const [audioBuffer, titleBuffer] = await Promise.all([
      fsPromises.readFile(cachedAudioFilePath),
      fsPromises.readFile(cachedTitleFilePath)
    ]);

    const filename = `${encodeURIComponent(titleBuffer.toString("utf-8"))}.mp3`;

    ctx.set("Content-Type", "audio/mpeg");
    ctx.set("Content-Disposition", `attachment; filename=${filename}`);
    ctx.set("Content-Transfer-Encoding", "binary");

    ctx.body = audioBuffer;
  });

  const app = new App();

  app.use(serve("build/client", { index: "index.html" }));

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}

module.exports = { createWebApp };
