import Router from "@koa/router";
import * as systemCtrl from "./system.ctrl";

/**
 * api/system
 */
const system = new Router();

system.post("/column", systemCtrl.addColumn);

export default system;
