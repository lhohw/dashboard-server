import { Client } from "pg";
import { Photo } from "const/definitions";

export const getPhotos = async () => {
  const client = new Client();
  await client.connect();
  const res = await client.query<Photo>(`SELECT * FROM photos`);
  await client.end();
  return res.rows;
};
