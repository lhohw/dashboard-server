import type { Client } from "class/DBClient";
import type { Heading, Photo } from "const/definitions";

import { type MarkdownMetadata } from "utils/markdown/extract";
import { decompress } from "utils/compress";
import { serialize } from "utils/markdown";

export const resetPosts = async (client: Client) => {
  return await client.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS posts;
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
};

export const insertAllPosts = async (
  client: Client,
  markdownMetadatas: MarkdownMetadata[],
  photos: Photo[]
) => {
  return await Promise.all(
    markdownMetadatas.map(
      async ({ slug, category, frontmatter: { title } }, idx) => {
        const { compressed, headings } = await serialize(category, slug);
        return await insertPost(
          client,
          title,
          slug,
          compressed,
          category,
          photos[idx],
          headings
        );
      }
    )
  );
};

export const insertPost = async (
  client: Client,
  title: string,
  slug: string,
  body: Uint8Array,
  category: string,
  photo: Photo,
  headings: Heading[]
) => {
  const { photo_id, photo_url, alt, blur_hash, user_name, user_link } = photo;

  const res = await client.query({
    text: `INSERT INTO posts(
      id, created_at, updated_at, title, slug, body, category,
      photo_id, photo_url, alt, blur_hash, user_name, user_link, headings
    ) VALUES (
      DEFAULT, DEFAULT, DEFAULT, $1, $2, $3, $4,
      $5, $6, $7, $8, $9, $10, $11
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
      headings,
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
    headings,
  };
};

export const seedPhotos = async (
  client: Client,
  photos: Photo[],
  limit = 1000
) => {
  const res = await client.query(`
    CREATE TABLE IF NOT EXISTS photos (
      photo_id VARCHAR(11) PRIMARY KEY, photo_url VARCHAR(255),
      blur_hash VARCHAR(255), alt VARCHAR(255),
      user_name VARCHAR(255), user_link VARCHAR(255),
      idx SMALLSERIAL
    );
  `);

  photos
    .slice(0, limit)
    .forEach(
      async ({ photo_id, photo_url, blur_hash, alt, user_name, user_link }) => {
        await client.query({
          text: `
      INSERT INTO photos (
        photo_id, photo_url,
        blur_hash, alt,
        user_name, user_link,
        idx
      ) VALUES (
        $1, $2, $3, $4, $5, $6, DEFAULT
      );
    `,
          values: [photo_id, photo_url, blur_hash, alt, user_name, user_link],
        });
      }
    );
};
