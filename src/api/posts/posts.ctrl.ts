import type { Next } from "koa";
import type { RouterContext } from "@koa/router";
import { z } from "zod";
import {
  insertPost,
  deletePost,
  selectPost,
  selectPosts,
  updatePost,
} from "lib/posts";
import { Post } from "const/definitions";
import { serialize } from "utils/markdown";
import { decompress } from "utils/compress";

type PostState = {
  post?: Post;
};
type PostContext = RouterContext<PostState>;

/**
 * 포스트 목록 조회
 * GET /api/posts
 */
export const list = async (ctx: PostContext) => {
  try {
    const posts = await selectPosts();
    ctx.response.body = posts;
  } catch (e: any) {
    ctx.throw(500, e);
  }
};

/**
 * 포스트 작성
 * POST /api/posts
 */
export const write = async (ctx: PostContext) => {
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
    const { compressed, headings } = await serialize(category, slug);
    const res = await insertPost({
      title,
      slug,
      body: compressed,
      category,
      headings,
    });
    ctx.response.body = res;
  } catch (e: any) {
    ctx.throw(500, e);
  }
};

export const getPostById = async (ctx: PostContext, next: Next) => {
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
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e: any) {
    ctx.throw(500, e);
  }
};

/**
 * 특정 포스트 조회
 * GET api/posts/:id
 */
export const read = async (ctx: PostContext) => {
  ctx.body = {
    ...ctx.state.post,
    body: decompress(ctx.state.post!.body),
  };
};

/**
 * 특정 포스트 제거
 * DELETE api/posts/:id
 */
export const remove = async (ctx: PostContext) => {
  const { id } = ctx.params;
  try {
    await deletePost(id);
    ctx.status = 204; // No Content;
  } catch (e: any) {
    ctx.throw(500, e);
  }
};

/**
 * 특정 포스트 수정
 * PATCH api/posts/:id
 */
export const update = async (ctx: PostContext) => {
  let requestBody: Partial<Post> & { recordUpdate?: boolean };
  try {
    requestBody = Post.partial()
      .merge(
        z.object({
          recordUpdate: z.boolean().optional(),
        })
      )
      .parse(ctx.request.body);
  } catch (e: any) {
    ctx.status = 400;
    ctx.message = e.message;
    return;
  }

  try {
    const post = ctx.state.post!;
    const {
      title = post.title,
      slug = post.slug,
      category = post.category,
      recordUpdate = false,
    } = requestBody;

    const { compressed, headings } = await serialize(category, slug);
    const res = await updatePost(
      {
        ...post,
        title,
        slug,
        body: compressed,
        category,
        headings,
      },
      recordUpdate
    );
    ctx.response.body = res;
  } catch (e: any) {
    ctx.throw(500, e);
  }
};
