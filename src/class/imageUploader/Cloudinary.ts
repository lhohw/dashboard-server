import type { ImageCloud } from "./ImageCloud";
import type {
  ConfigOptions,
  UploadApiOptions,
  AdminAndResourceOptions,
  UploadApiResponse,
} from "cloudinary";

import { v2 as cloudinary } from "cloudinary";
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;

class Cloudinary implements ImageCloud {
  private defaultOptions: UploadApiOptions = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
    use_asset_folder_as_public_id_prefix: true,
  };

  constructor(configOptions?: ConfigOptions) {
    cloudinary.config({
      ...configOptions,
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }

  /**
   * upload image file
   */
  async upload(src: string, options: UploadApiOptions = {}): Promise<string> {
    const { defaultOptions } = this;
    const uploadOptions: UploadApiOptions = {
      ...defaultOptions,
      ...options,
    };

    const result = await cloudinary.uploader.upload(src, uploadOptions);
    return result.secure_url;
  }
  /**
   * upload image buffer by stream
   */
  async uploadStream(buf: Buffer, options: UploadApiOptions = {}) {
    const { defaultOptions } = this;
    const uploadOptions: UploadApiOptions = {
      ...defaultOptions,
      ...options,
    };

    const secure_url = await new Promise<string>((res) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (err, result) => {
          if (err || !result) throw new Error(err as any);
          this.printUploadInfo(result);
          return res(result.secure_url);
        })
        .end(buf);
    });

    return secure_url;
  }

  /**
   * Gets details of an uploaded image
   */
  async getAssetInfo(publicId: string) {
    const options: AdminAndResourceOptions = {};

    const secure_url = await new Promise<string>((res) => {
      cloudinary.api.resource(publicId, options, (err, result) => {
        if (err || !result) throw new Error(err);
        return res(result.secure_url);
      });
    });
    return secure_url;
  }

  private printUploadInfo(result: UploadApiResponse) {
    const { public_id, width, height, format, secure_url } = result;

    console.log(`====== ${public_id} is successfully uploaded =======`);
    console.log(`width: ${width}, height: ${height}, format: ${format}`);
    console.log(`URL: ${secure_url}`);
    console.log(`====================================================`);
  }
}

export default Cloudinary;
