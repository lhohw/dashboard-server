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
        photo_id: id,
        photo_url: raw,
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

export const toBase64 = (
  data: string | number[] | ArrayBuffer | Buffer
): string => {
  if (Array.isArray(data)) data = arrayToAsciiStr(data);
  else if (typeof data === "object") data = bufferToAsciiStr(data);
  return btoa(data);
};

const arrayToAsciiStr = (array: number[]) =>
  array.map((code) => String.fromCharCode(code)).join("");

const bufferToAsciiStr = (buffer: ArrayBuffer | Buffer) =>
  arrayToAsciiStr(Array.from(new Uint8Array(buffer)));
