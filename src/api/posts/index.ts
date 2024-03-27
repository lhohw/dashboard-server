import Router from "@koa/router";
import * as postsCtrl from "./posts.ctrl";

const posts = new Router();

posts.get("/", postsCtrl.getPosts);
posts.get("/:id", postsCtrl.getPost);
posts.post("/", postsCtrl.addPost);

export default posts;
