export const mode = ["test", "published", "draft"] as const;
export type Mode = (typeof mode)[number];
