import { db } from "@vercel/postgres";
import { isTableExists } from "lib/_helper";
import { getPhotos, fetchPhotos } from "lib/photos";
import { resetPosts, seedPhotos, insertAllPosts } from "lib/seed";
import { fetchAllMarkdownMetadataOnReady } from "utils/markdown";

async function main() {
  try {
    const client = await db.connect();

    const isPhotoExists = await isTableExists(client, "photos");
    if (!isPhotoExists) {
      const photos = await getPhotos();
      await seedPhotos(client, photos);
    }

    await resetPosts(client);
    const markdownMetadatas = await fetchAllMarkdownMetadataOnReady();
    const photos = await fetchPhotos(client, markdownMetadatas.length);
    await insertAllPosts(client, markdownMetadatas, photos);
  } catch (e: any) {
    console.error(e);
  }

  process.exit();
}

main();
