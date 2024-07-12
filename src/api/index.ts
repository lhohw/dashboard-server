import Router from "@koa/router";
import posts from "./posts";
import system from "./system";
import renew from "./renew";

const api = new Router();

api.use("/posts", posts.routes());
api.use("/system", system.routes());
api.use("/renew", renew.routes());

export default api;
