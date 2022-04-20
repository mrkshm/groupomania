import type { NextApiRequest, NextApiResponse } from "next";
import middleware from "../../../middleware/middleware";
import { slugify, makeId } from "../../../src/utils/helpers";
import { prisma } from "../../../db";
import nextConnect from "next-connect";
const path = require("path");
import { getSession } from "next-auth/react";
import fs from "fs";
import imageNamer from "../../../src/utils/imageNamer";
import fileSaver from "../../../src/utils/fileSaver";
import deleteFile from "../../../src/utils/deleteFile";

interface Request extends NextApiRequest {
  params: { postId: string };
  files: any;
}

const handler = nextConnect({ attachParams: true });
handler.use(middleware);

handler.delete(
  "api/post/:postId",
  async (req: Request, res: NextApiResponse) => {
    const { postId } = req.params;
    const session = await getSession({ req });

    if (!session || !session.user) {
      console.log("no one here");
      return;
    }
    // @ts-ignore
    const uId = session.user.id;

    if (!uId) {
      console.log("no uId");
      return;
    }

    const localUser = await prisma.user.findUnique({
      where: {
        id: uId
      }
    });

    if (!localUser || !localUser.isAdmin) {
      return res.status(400).json({ message: "Pas autorisé." });
    }

    const postToDelete = await prisma.post.findUnique({
      where: {
        id: Number(postId)
      }
    });

    if (!postToDelete) {
      return res.status(400).json({
        message: "Le message que vous voulez supprimer n'a pas été trouvé."
      });
    }

    if (postToDelete.image) {
      deleteFile(postToDelete.image);
    }

    try {
      await prisma.post.delete({
        where: {
          id: Number(postId)
        }
      });
      return res
        .status(200)
        .json({ message: "Le message a bien été supprimé." });
    } catch (error) {
      return res.status(500).json({ message: "Il y avait un erreur." });
    }
  }
);

handler.put("api/post/:postId", async (req: Request, res: NextApiResponse) => {
  const { postId } = req.params;

  // Do a credentials check
  const session = await getSession({ req });
  if (!session || !session.user) {
    console.log("no one here");
    return;
  }
  // @ts-ignore
  const uId = session.user.id;
  if (!uId) {
    return res.status(401).json({ message: "Pas connecté ?" });
  }

  // Get the post to update
  const post = await prisma.post.findUnique({
    where: {
      id: Number(postId)
    }
  });
  if (!post) {
    return res.status(400).json({ message: "Le post n'a pas été trouvé." });
  }

  // Get req body
  const title = req.body.title[0];
  const slug = slugify(title);
  const body = req.body.body[0];
  const tag = req.body.tag[0];
  const userId = req.body.uId[0];
  const deleteImage = req.body.deleteImage[0];

  if (userId !== post.userId) {
    console.log("id check not successful");
    return res.status(401).json({ message: "Pas autorisé." });
  }

  // check for image, if there is: name it & save it
  let newImageName = "";

  if (req.files.image) {
    const imageFile = req.files.image[0];

    if (imageFile.size > 1024 * 1024 * 8) {
      return res
        .status(400)
        .json({ message: "la taille de l'image ne peut pas depasser 8 Mo." });
    }
    newImageName = imageNamer(imageFile.originalFilename);

    await fileSaver(imageFile, newImageName);

    if (post.image) {
      deleteFile(post.image);
    }
  }

  // Do the updating
  let imageName = newImageName ? newImageName : post.image;

  if (deleteImage === "true" && !req.files.image && post.image) {
    deleteFile(post.image);
    imageName = "";
  }

  const searchId = Number(postId);

  try {
    const newPost = await prisma.post.update({
      where: {
        id: searchId
      },
      data: {
        title: title,
        slug: slug,
        body: body,
        tagId: Number(tag),
        image: imageName
      }
    });

    return res.status(200).json(newPost);
  } catch (error) {
    return res.status(500).json({
      message: "Il y avait un erreur sauvgarder votre message. Désolé."
    });
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
