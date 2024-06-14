import type { Client as DBClient } from "class/DBClient";
import { Client } from "pg";
import { Photo } from "const/definitions";

export const getPhotos = async () => {
  const client = new Client();
  await client.connect();
  const res = await client.query<Photo>(`SELECT * FROM photos`);
  await client.end();
  return res.rows;
};

export const getUnusedPhoto = async (client: DBClient) => {
  const photos = await client.query<Photo>(`
  SELECT * FROM photos
    WHERE photo_id
    NOT IN (SELECT photo_id FROM posts)
    LIMIT 1;
`);
  const photo = photos.rows[0];
  return photo;
};

export const fetchPhotos = async (client: DBClient, limit: number) => {
  const res = await client.query<Photo>(`SELECT * FROM photos LIMIT ${limit}`);
  return res.rows;
};
