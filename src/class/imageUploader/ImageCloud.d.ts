export type Image = {
  src: string;
};

export interface ImageCloud {
  upload(src: string, options?: Record<string, any>): Promise<string>;

  uploadStream(buf: Buffer, options?: Record<string, any>): Promise<string>;

  getAssetInfo(publicId: string): Promise<any>;
}
