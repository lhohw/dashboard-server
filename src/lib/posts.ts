import { Photo, Post } from "const/definitions";
import { decompress } from "utils/compress";
import DBPool, { type Client } from "class/DBClient";

export const selectPosts = async (): Promise<Post[]> => {
  const client = await DBPool.getInstance();
  const res = await client.query<Post>(`SELECT * FROM posts`);
  return res.rows;
};

export const selectPost = async (id: string): Promise<Post> => {
  const client = await DBPool.getInstance();
  const res = await client.query<Post>({
    text: `SELECT * FROM posts WHERE id = $1`,
    values: [id],
  });
  return res.rows[0] || null;
};

export const insertPost = async ({
  title,
  slug,
  body,
  category,
}: {
  title: string;
  slug: string;
  body: Uint8Array;
  category: string;
}) => {
  const client = await DBPool.getInstance();

  const photo = await getUnusedPhoto(client);
  const { photo_id, photo_url, alt, blur_hash, user_name, user_link } = photo;

  const res = await client.query({
    text: `INSERT INTO posts(
      id, created_at, updated_at, title, slug, body, category,
      photo_id, photo_url, alt, blur_hash, user_name, user_link
    ) VALUES (
      DEFAULT, DEFAULT, DEFAULT, $1, $2, $3, $4,
      $5, $6, $7, $8, $9, $10
    )`,
    values: [
      title,
      slug,
      body,
      category,
      photo_id,
      photo_url,
      alt,
      blur_hash,
      user_name,
      user_link,
    ],
  });

  return {
    title,
    slug,
    body: decompress(body),
    category,
    photo_id,
    photo_url,
    alt,
    blur_hash,
    user_name,
    user_link,
  };
};

const getUnusedPhoto = async (client: Client) => {
  const photos = await client.query<Photo>(`
  SELECT * FROM photos
    WHERE photo_id
    NOT IN (SELECT photo_id FROM posts)
    LIMIT 1;
`);
  const photo = photos.rows[0];
  return photo;
};

export const updatePost = async (post: Post) => {
  const client = await DBPool.getInstance();

  const {
    id,
    created_at,
    title,
    slug,
    body,
    category,
    photo_id,
    photo_url,
    alt,
    blur_hash,
    user_name,
    user_link,
  } = post;

  const res = await client.query({
    text: `UPDATE posts 
      SET id = $1, created_at = $2, updated_at = DEFAULT,
        title = $3, slug = $4, body = $5, category = $6,
        photo_id = $7, photo_url = $8, alt = $9, blur_hash = $10,
        user_name = $11, user_link = $12
      WHERE id = $1`,
    values: [
      id,
      created_at,
      title,
      slug,
      body,
      category,
      photo_id,
      photo_url,
      alt,
      blur_hash,
      user_name,
      user_link,
    ],
  });

  const updated = (
    await client.query<Post>({
      text: `SELECT * FROM posts WHERE id = $1`,
      values: [id],
    })
  ).rows[0];

  return {
    ...updated,
    body: decompress(updated.body),
  };
};

export const deletePost = async (id: string) => {
  const client = await DBPool.getInstance();

  const res = await client.query({
    text: "DELETE post WHERE id = $1",
    values: [id],
  });

  return null;
};
