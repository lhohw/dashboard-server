import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import api from "api";

const app = new Koa();
const router = new Router();

router.use("/api", api.routes());

app
  .use(bodyParser())
  .use(router.allowedMethods())
  .use(router.routes())
  .listen(Bun.env.PORT, listeningListener);

function listeningListener() {
  console.log(`app listening to port: ${Bun.env.PORT}`);
  console.log(`Environment: ${Bun.env.NODE_ENV}`);
}
