import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import api from "api";
import Argv from "class/Argv";
import { mode, type Mode } from "const/mode";

const app = new Koa();
const router = new Router();
const argv = Argv.init();

router.use("/api", api.routes());

app
  .use(bodyParser())
  .use(router.allowedMethods())
  .use(router.routes())
  .listen(Bun.env.PORT, listeningListener);

function listeningListener() {
  console.log(`app listening to port: ${Bun.env.PORT}`);
  console.log(`Environment: ${Bun.env.NODE_ENV}`);
  const currentMode = argv.get("mode") as Mode;
  if (currentMode) {
    if (!mode.includes(currentMode)) {
      throw new Error(
        `${currentMode} is not valid.\n[ ${mode.join(", ")} ] are valid`
      );
    }
    console.log(`Mode: ${currentMode}`);
  }
}
