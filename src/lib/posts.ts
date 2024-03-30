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
  const client = new Client();
  await client.connect();

  const createTable = await client.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
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

  const photos = await client.query<Photo>(`
    SELECT * FROM photos
      WHERE photo_id
      NOT IN (SELECT photo_id FROM posts)
      LIMIT 1;
  `);
  const photo = photos.rows[0];
  const { photo_id, photo_url, alt, blur_hash, user_name, user_link } = photo;

  const res = await client.query({
    text: `INSERT INTO posts(
      id, created_at, updated_at, title, slug, body, category,
      photo_id, photo_url, alt, blur_hash, user_name, user_link
    ) VALUES (
      DEFAULT, DEFAULT, $1, $2, $3, $4,
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

  await client.end();
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

export const updatePost = async ({
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
  const client = new Client();
  await client.connect();

  const res = await client.query({
    text: `UPDATE posts 
      SET updated_at = DEFAULT, title = $1, slug = $2, body = $3, category = $4
      WHERE slug = $2`,
    values: [title, slug, body, category],
  });

  const updated = (
    await client.query<Post>({
      text: `SELECT * FROM posts WHERE slug = $1`,
      values: [slug],
    })
  ).rows[0];

  await client.end();
  return {
    ...updated,
    body: decompress(updated.body),
  };
};
