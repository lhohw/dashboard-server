import type { Photo, UnsplashPhoto } from "const/definitions";

export const serializeUnsplashPhoto = (photos: UnsplashPhoto[]): Photo[] => {
  try {
    const array = photos.map((res) => {
      const {
        id,
        urls: { raw },
        alt_description,
        blur_hash,
        user: {
          name,
          links: { html },
        },
      } = res;

      return {
        image_id: id,
        url: raw,
        alt: alt_description,
        blur_hash,
        user_name: name,
        user_link: html,
      };
    });
    return array;
  } catch (e) {
    console.log(e);
  }
  return [];
};
