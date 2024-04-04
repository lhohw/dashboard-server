import Router from "@koa/router";
import * as postsCtrl from "./posts.ctrl";

/**
 * /api/posts
 */
const posts = new Router();

posts.get("/", postsCtrl.list);
posts.post("/", postsCtrl.write);

/**
 * /api/posts/:id
 */
const post = new Router();
post.get("/", postsCtrl.read);
post.patch("/", postsCtrl.update);
post.delete("/", postsCtrl.remove);

posts.use("/:id", postsCtrl.getPostById, post.routes());

export default posts;
