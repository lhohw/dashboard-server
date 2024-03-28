import { z } from "zod";

export const UnsplashDatasetPhoto = z.object({
  photo_id: z.string(),
  photo_url: z.string(),
  photo_image_url: z.string(),
  photo_submitted_at: z.string(),
  photo_featured: z.string(),
  photo_width: z.string(),
  photo_height: z.string(),
  photo_aspect_ratio: z.string(),
  photo_description: z.string(),
  photographer_username: z.string(),
  photographer_first_name: z.string(),
  photographer_last_name: z.string(),
  exif_camera_make: z.string(),
  exif_camera_model: z.string(),
  exif_iso: z.string(),
  exif_aperture_value: z.string(),
  exif_focal_length: z.string(),
  exif_exposure_time: z.string(),
  photo_location_name: z.string(),
  photo_location_latitude: z.string(),
  photo_location_longitude: z.string(),
  photo_location_country: z.string(),
  photo_location_city: z.string(),
  stats_views: z.string(),
  stats_downloads: z.string(),
  ai_description: z.string(),
  ai_primary_landmark_name: z.string(),
  ai_primary_landmark_latitude: z.string(),
  ai_primary_landmark_longitude: z.string(),
  ai_primary_landmark_confidence: z.string(),
  blur_hash: z.string(),
});
export type UnsplashDatasetPhoto = z.infer<typeof UnsplashDatasetPhoto>;

export const UnsplashPhoto = z.object({
  id: z.string(),
  urls: z.object({
    raw: z.string().url({ message: "Invalid url" }),
  }),
  alt_description: z.string(),
  blur_hash: z.string(),
  user: z.object({
    name: z.string(),
    links: z.object({
      html: z.string().url({ message: "Invalid url" }),
    }),
  }),
});
export type UnsplashPhoto = z.infer<typeof UnsplashPhoto>;

export const Photo = z.object({
  photo_id: UnsplashPhoto.shape.id,
  photo_url: UnsplashPhoto.shape.urls.shape.raw,
  user_name: UnsplashPhoto.shape.user.shape.name,
  user_link: UnsplashPhoto.shape.user.shape.links.shape.html,
  alt: UnsplashPhoto.shape.alt_description,
  blur_hash: UnsplashPhoto.shape.blur_hash,
});
export type Photo = z.infer<typeof Photo>;

export const Post = z
  .object({
    id: z.string().uuid(),
    created_at: z.coerce.date(),
    slug: z.string(),
    title: z.string(),
    body: z.array(z.number()),
    category: z.string(),
  })
  .merge(Photo);
export type Post = z.infer<typeof Post>;
