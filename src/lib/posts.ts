import { Client } from "pg";
import { Post } from "const/definitions";
import { unsplashPerPage } from "const/defaults";
import { serializeUnsplashPhoto } from "utils/serialize";
import { searchPhotos } from "./third-party/unsplash";

export const selectPosts = async (): Promise<Post[]> => {
  const client = new Client();
  await client.connect();
  const res = await client.query<Post>(`SELECT * FROM posts`);
  await client.end();
  return res.rows;
};

export const selectPost = async (id: string) => {
  const client = new Client();
  await client.connect();
  const query = {
    text: `SELECT * FROM posts WHERE id = $1`,
    values: [id],
  };
  const res = await client.query(query);
  await client.end();
  return res.rows[0] || null;
};

export const insertPost = async (
  title: string,
  slug: string,
  body: Uint8Array,
  category: string
) => {
  const client = new Client();
  await client.connect();
  const postCount = parseInt(
    (await client.query(`SELECT COUNT(*) FROM posts`)).rows[0].count
  );
  const page = Math.floor(postCount / unsplashPerPage);
  const postIdx = postCount % unsplashPerPage;
  const { data } = await searchPhotos({ page });
  const photo = serializeUnsplashPhoto(data)[postIdx];

  const { image_id, url, alt, blur_hash, user_name, user_link } = photo;

  const query = {
    text: `INSERT INTO posts(
      id, created_at, title, slug, body, category,
      image_id, url, alt, blur_hash, user_name, user_link
    ) VALUES (
      DEFAULT, DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    )`,
    values: [
      title,
      slug,
      body,
      category,
      image_id,
      url,
      alt,
      blur_hash,
      user_name,
      user_link,
    ],
  };
  const res = await client.query(query);
  await client.end();
  return res.rows[0];
};
