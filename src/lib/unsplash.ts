import FetchClient from "class/FetchClient";

const { UNSPLASH_BASE_URL = "", UNSPLASH_ACCESS_KEY = "" } = Bun.env;
if (!UNSPLASH_BASE_URL) throw new Error("unsplash base url not exist");

const unsplashClient = new FetchClient(UNSPLASH_BASE_URL, {
  "Accept-Version": "v1",
  Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
});

export const getPhotos = () => {
  return unsplashClient.get("/search/photos", {
    query: "sea",
    orientation: "landscape",
  });
};
