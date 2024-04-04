import { db } from "@vercel/postgres";
import { getPhotos } from "lib/photos";
import {
  fetchPhotos,
  fetchMarkdown,
  isTableExists,
  resetTable,
  seedPhotos,
  insertAllPosts,
} from "lib/seed";

async function main() {
  try {
    const client = await db.connect();

    const isPhotoExists = await isTableExists(client, "photos");
    if (!isPhotoExists) {
      const photos = await getPhotos();
      await seedPhotos(client, photos);
    }

    await resetTable(client);
    const markdowns = await fetchMarkdown();
    const photos = await fetchPhotos(client, markdowns.length);
    const res = await insertAllPosts(client, markdowns, photos);
  } catch (e: any) {
    console.error(e);
  }

  process.exit();
}

main();
