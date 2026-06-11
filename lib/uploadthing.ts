import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import { prisma } from "./prisma";

const f = createUploadthing();

const auth = async () => {
  const session = await getServerSession();

  if (!session?.user) {
    throw new UploadThingError("Unauthorized");
  }

  return {
    userId: session.user.id,
  };
};

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      return await auth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log(file.url);

      return {
        uploadedBy: metadata.userId,
      };
    }),

  documentUploader: f({
    pdf: {
      maxFileSize: "8MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      return await auth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
        url: file.url,
      };
    }),

  profileImageUploader: f({
    image: {
      maxFileSize: "2MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return await auth();
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await prisma.user.update({
        where: {
          id: metadata.userId,
        },
        data: {
          image: file.url,
        },
      });

      return {
        uploadedBy: metadata.userId,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;