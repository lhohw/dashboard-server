import Router from "@koa/router";
import posts from "./posts";
import system from "./system";

const api = new Router();

api.use("/posts", posts.routes());
api.use("/system", system.routes());

export default api;
