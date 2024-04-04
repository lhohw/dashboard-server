import { Client } from "pg";
import {
  insertAllPosts,
  fetchPhotos,
  fetchMarkdown,
  resetTable,
} from "lib/seed";

async function main() {
  try {
    const client = new Client();
    await client.connect();

    await resetTable(client);
    const markdowns = await fetchMarkdown();
    const photos = await fetchPhotos(client, markdowns.length);
    const res = await insertAllPosts(client, markdowns, photos);

    await client.end();
  } catch (e: any) {
    console.error(e);
  }
}

main();
