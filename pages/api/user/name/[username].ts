import type { NextApiRequest, NextApiResponse } from "next";
import middleware from "../../../../middleware/middleware";
import imageNamer from "../../../../src/utils/imageNamer";
import nextConnect from "next-connect";
const path = require("path");
import { prisma } from "../../../../db";
import fs from "fs";
import { getSession } from "next-auth/react";
import fileSaver from "../../../../src/utils/fileSaver";

interface GetRequest extends NextApiRequest {
  params: { username: string };
}

interface PutRequest extends NextApiRequest {
  files: any;
}

interface DelRequest extends NextApiRequest {
  params: { userId: string };
}
const handler = nextConnect({ attachParams: true });
handler.use(middleware);

handler.get(
  "api/user/name/:username",
  async (req: GetRequest, res: NextApiResponse) => {
    const { username } = req.params;

    try {
      const user: any = await prisma.user.findUnique({
        where: {
          name: username
        },
        include: {
          _count: {
            select: {
              posts: true,
              comments: true
            }
          }
        }
      });
      user.commentCount = user?._count.comments;
      user.postCount = user?._count.posts;
      delete user?._count;
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: "Utilisateur pas trouvé" });
    }
  }
);

handler.put(
  "api/user/:userId",
  async (req: PutRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    const sessionUser: any = session?.user;
    const solicitorId = req.body.userId[0];
    if (solicitorId !== sessionUser.id) {
      console.log("users not identidal");
      return res.status(401).json({ message: "Non autorisé" });
    }

    let newImageName = "";

    const newBody = req.body.body[0];
    const newUsername = req.body.username[0];
    const newEmail = req.body.email[0];

    const user = await prisma.user.findUnique({
      where: {
        id: solicitorId
      }
    });

    if (!user) {
      return res.status(500).json({ message: "Utilisateur pas trouvé" });
    }

    console.log("ok, user is", user);

    if (req.files.image) {
      const imageFile = req.files.image[0];

      if (imageFile.size > 1024 * 1024 * 8) {
        return res
          .status(400)
          .json({ message: "La taille de l'image ne peut pas depasser 8Mo." });
      }

      newImageName = imageNamer(imageFile.originalFilename);

      console.log("new name is", newImageName);

      await fileSaver(imageFile, newImageName);

      fs.unlink(`./public/${user.image}`, () => {
        console.log("old image deleted");
      });
    }

    user.name = newUsername ? newUsername.trim() : user.name;
    user.body = newBody ? newBody.trim() : user.body;
    user.email = newEmail ? newEmail.trim() : user.email;
    user.image = newImageName ? newImageName : user.image;

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: solicitorId
        },
        data: {
          name: user.name,
          body: user.body,
          email: user.email,
          image: newImageName
        }
      });
      return res.status(201).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Utilisateur pas modifié." });
    }
  }
);

handler.delete(
  "api/user/:userId",
  async (req: DelRequest, res: NextApiResponse) => {
    const session = await getSession({ req });
    const sessionUser: any = session?.user;
    const { userId } = req.params;
    if (userId !== sessionUser.id) {
      console.log("users not identidal");
      return res.status(401).json({ message: "Non autorisé" });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

    if (!user) {
      return res.status(500).json({ message: "Utilisateur pas trouvé" });
    }

    if (!user.image) {
      return res.status(200).json({ message: "Rien à supprimer." });
    }

    fs.unlink(`./public/${user.image}`, () => {
      console.log("old image deleted");
    });

    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          image: ""
        }
      });
      return res.status(201).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: "Utilisateur pas modifié." });
    }
  }
);

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
