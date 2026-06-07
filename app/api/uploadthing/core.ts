import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  image: f(["image"]).onUploadComplete(() => {}),
  chatImage: f(["image"]).onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
