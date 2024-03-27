import type { Next } from "koa";
import type { RouterContext } from "@koa/router";
import compressMarkdown from "compressMarkdown";
import { insertPost, selectPost, selectPosts } from "lib/posts";
import { decompress } from "utils/compress";
import { Post } from "const/definitions";

export const getPosts = async (ctx: RouterContext, next: Next) => {
  try {
    const posts = await selectPosts();
    ctx.response.body = posts;
    next();
  } catch (e: any) {
    ctx.throw(500, e);
  }
};

export const getPost = async (ctx: RouterContext, next: Next) => {
  let id: string;
  try {
    id = Post.pick({ id: true }).parse(ctx.params).id;
  } catch (e: any) {
    ctx.status = 400;
    ctx.message = e.message;
    return;
  }
  try {
    const post = await selectPost(id);
    const body = decompress(post.body);
    ctx.response.body = { ...post, body };
    next();
  } catch (e: any) {
    ctx.throw(500, e);
  }
};

export const addPost = async (ctx: RouterContext, next: Next) => {
  let body: Pick<Post, "title" | "slug" | "category">;
  try {
    body = Post.pick({
      title: true,
      slug: true,
      category: true,
    }).parse(ctx.request.body);
  } catch (e: any) {
    ctx.status = 400;
    ctx.message = e.message;
    return;
  }

  try {
    const { title, slug, category } = body;
    const compressed = await compressMarkdown(slug);
    const res = await insertPost(title, slug, compressed, category);
    ctx.response.body = res;
    next();
  } catch (e: any) {
    ctx.throw(500, e);
  }
};
