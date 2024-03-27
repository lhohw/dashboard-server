import { unsplashPerPage } from "const/defaults";
import { UnsplashPhoto } from "const/definitions";
import createClient from "utils/createClient";

const { UNSPLASH_BASE_URL = "", UNSPLASH_ACCESS_KEY = "" } = Bun.env;
if (!UNSPLASH_BASE_URL) throw new Error("unsplash base url not exist");

const unsplashClient = createClient(UNSPLASH_BASE_URL, {
  "Accept-Version": "v1",
  Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
});

export type searchPhotosProps = {
  query?: string;
  per_page?: number;
  page?: number;
};
export const searchPhotos = ({
  query = "sea",
  per_page = unsplashPerPage,
  page = 1,
}: searchPhotosProps) => {
  return unsplashClient.get<UnsplashPhoto[]>("/search/photos", {
    params: {
      query,
      per_page,
      page,
      orientation: "landscape",
    },
  });
};
