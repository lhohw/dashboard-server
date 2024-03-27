import { z } from "zod";

export const UnsplashPhoto = z.object({
  id: z.string(),
  urls: z.object({
    raw: z.string().url({ message: "Invalid url" }),
  }),
  alt_description: z.string(),
  blur_hash: z.string(),
  user: z.object({
    name: z.string(),
    links: z.object({
      html: z.string().url({ message: "Invalid url" }),
    }),
  }),
});
export type UnsplashPhoto = z.infer<typeof UnsplashPhoto>;

export const Photo = z.object({
  image_id: UnsplashPhoto.shape.id,
  user_name: UnsplashPhoto.shape.user.shape.name,
  user_link: UnsplashPhoto.shape.user.shape.links.shape.html,
  url: UnsplashPhoto.shape.urls.shape.raw,
  alt: UnsplashPhoto.shape.alt_description,
  blur_hash: UnsplashPhoto.shape.blur_hash,
});
export type Photo = z.infer<typeof Photo>;

export const Post = z
  .object({
    id: z.string().uuid(),
    created_at: z.coerce.date(),
    slug: z.string(),
    title: z.string(),
    body: z.array(z.number()),
    category: z.string(),
  })
  .merge(Photo);
export type Post = z.infer<typeof Post>;
