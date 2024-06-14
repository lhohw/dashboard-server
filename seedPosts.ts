import { Client } from "pg";
import { insertAllPosts, resetPosts } from "lib/seed";
import { fetchAllMarkdownMetadataOnReady } from "utils/markdown";
import { fetchPhotos } from "lib/photos";

async function main() {
  try {
    const client = new Client();
    await client.connect();

    await resetPosts(client);
    const markdowns = await fetchAllMarkdownMetadataOnReady();
    const photos = await fetchPhotos(client, markdowns.length);
    await insertAllPosts(client, markdowns, photos);

    await client.end();
  } catch (e: any) {
    console.error(e);
  }
}

main();
