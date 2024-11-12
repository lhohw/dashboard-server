import type { ImageCloud } from "./ImageCloud";
import Cloudinary from "./Cloudinary";

class ImageUploader {
  cloud: ImageCloud = new Cloudinary();

  async uploadImage(src: string, options?: Record<string, any>) {
    try {
      const secure_url = await this.cloud.upload(src, options);
      return secure_url;
    } catch (e) {
      console.error(e);
      throw new Error("upload failed");
    }
  }

  async uploadStream(buf: Buffer, options?: Record<string, any>) {
    try {
      const secure_url = await this.cloud.uploadStream(buf, options);
      return secure_url;
    } catch (e) {
      console.error(e);
      throw new Error("upload failed");
    }
  }

  async getAssetInfo(publicId: string) {
    try {
      return await this.cloud.getAssetInfo(publicId);
    } catch (e) {
      console.error(e);
      throw new Error("get asset info failed");
    }
  }
}

export default ImageUploader;
