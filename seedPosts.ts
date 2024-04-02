import type { Photo } from "const/definitions";

import { Client } from "pg";
import { readdirSync } from "node:fs";

import {
  extractMetadata,
  type MarkdownMetadata,
  serializeMarkdown,
} from "utils/markdown";
import { decompress } from "utils/compress";
import { markdownPath } from "const/path";

const seedPosts = async () => {
  try {
    const client = new Client();
    await client.connect();
    await resetTable(client);
    const markdowns = await fetchMarkdown();
    const photos = await fetchAllPhotos(client, markdowns.length);
    const res = await addAllPosts(client, markdowns, photos);
    await client.end();
  } catch (e: any) {
    console.error(e);
  }
};

const resetTable = async (client: Client) => {
  return await client.query(`
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

const fetchAllPhotos = async (client: Client, limit: number) => {
  const res = await client.query<Photo>(`SELECT * FROM photos LIMIT ${limit}`);
  return res.rows;
};

const fetchMarkdown = async () => {
  const path = markdownPath;
  const dirs = readdirSync(path).filter(
    (e) => !e.endsWith(".md") && e !== "draft"
  );

  const markdownMetadatas: MarkdownMetadata[] = [];
  for (const category of dirs) {
    const categoryPath = `${markdownPath}/${category}`;
    const files = readdirSync(categoryPath);
    const markdowns = await Promise.all(
      files.map(async (filename) => {
        const filePath = `${categoryPath}/${filename}`;
        const file = Bun.file(filePath);
        const text = await file.text();
        return extractMetadata(filename, text, category);
      })
    );
    const onReadyMarkdown = markdowns.filter(
      ({ frontmatter }) => frontmatter.status === "ready"
    );
    markdownMetadatas.push(...onReadyMarkdown);
  }

  return markdownMetadatas;
};

const addAllPosts = async (
  client: Client,
  markdowns: MarkdownMetadata[],
  photos: Photo[]
) => {
  return await Promise.all(
    markdowns.map(async ({ slug, category, frontmatter: { title } }, idx) => {
      const compressed = await serializeMarkdown(category, slug);
      return await insertPost(
        client,
        title,
        slug,
        compressed,
        category,
        photos[idx]
      );
    })
  );
};

export const insertPost = async (
  client: Client,
  title: string,
  slug: string,
  body: Uint8Array,
  category: string,
  photo: Photo
) => {
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

seedPosts();
