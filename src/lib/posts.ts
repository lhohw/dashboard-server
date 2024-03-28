import { Client } from "pg";
import { Photo, Post } from "const/definitions";
import { decompress } from "utils/compress";

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
  const res = await client.query({
    text: `SELECT * FROM posts WHERE id = $1`,
    values: [id],
  });
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

  const createTable = await client.query(`
    DROP TABLE posts;
    CREATE TABLE IF NOT EXISTS posts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      body BYTEA NOT NULL,
      category VARCHAR(255) NOT NULL,
      photo_id VARCHAR(11),
      photo_url VARCHAR(255),
      blur_hash VARCHAR(255) DEFAULT 'LcE{wnIVRixt~WR+NGjbxukCWBWB',
      alt VARCHAR(255) DEFAULT 'image',
      user_name VARCHAR(255),
      user_link VARCHAR(255)
    );
  `);

  const postCount = parseInt(
    (await client.query(`SELECT COUNT(*) FROM posts`)).rows[0].count
  );
  const photos = await client.query<Photo>(
    `SELECT * from photos where idx = ${postCount + 1}`
  );
  const photo = photos.rows[0];
  const { photo_id, photo_url, alt, blur_hash, user_name, user_link } = photo;

  const res = await client.query({
    text: `INSERT INTO posts(
      id, created_at, title, slug, body, category,
      photo_id, photo_url, alt, blur_hash, user_name, user_link
    ) VALUES (
      DEFAULT, DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
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

  await client.end();
  return {
    nextCount: postCount + 1,
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
