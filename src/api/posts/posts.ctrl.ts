import type { Next } from "koa";
import type { RouterContext } from "@koa/router";
import {
  insertPost,
  selectPost,
  selectPosts,
  updatePost as _updatePost,
} from "lib/posts";
import { decompress } from "utils/compress";
import { Post } from "const/definitions";
import { serializeMarkdown } from "utils/markdown";

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

export const createPost = async (ctx: RouterContext, next: Next) => {
  let requestBody: Pick<Post, "title" | "slug" | "category">;
  try {
    requestBody = Post.pick({
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
    const { title, slug, category } = requestBody;
    const compressed = await serializeMarkdown(category, slug);
    const res = await insertPost({ title, slug, body: compressed, category });
    ctx.response.body = res;
    next();
  } catch (e: any) {
    ctx.throw(500, e);
  }
};

export const updatePost = async (ctx: RouterContext, next: Next) => {
  let requestBody: Pick<Post, "title" | "slug" | "category">;
  try {
    requestBody = Post.pick({
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
    const { title, slug, category } = requestBody;
    const serialized = await serializeMarkdown(category, slug);
    const res = await _updatePost({ title, slug, body: serialized, category });
    ctx.response.body = res;
    next();
  } catch (e: any) {
    ctx.throw(500, e);
  }
};
