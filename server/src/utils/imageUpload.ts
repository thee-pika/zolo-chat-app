import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadImageToCloudinary = async (
  file: Buffer<ArrayBufferLike>
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.log("error", error);
          return reject(error);
        }
        if (result) {
          console.log("result", result);
          const data = {
            url: result.secure_url,
            id: result.public_id,
          };
          resolve(JSON.stringify(data));
        }
      }
    );

    Readable.from(file).pipe(stream);
  });
};

export { uploadImageToCloudinary };
