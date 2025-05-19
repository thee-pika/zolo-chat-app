import multer from "multer";

export const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

const uploadSingle = multerUpload.single("image");

const attachmentsMulter = multerUpload.array("files", 5);

export { uploadSingle , attachmentsMulter};
