// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import middleware from "../../middleware/middleware";
import imageNamer from "../../src/utils/imageNamer";
import nextConnect from "next-connect";
const path = require("path");
import { prisma } from "../../db";
import fs from "fs";
import { getSession } from "next-auth/react";
import fileSaver from "../../src/utils/fileSaver";

interface ImageFile extends File {
  originalFilename: string;
}
interface Request extends NextApiRequest {
  files: { image: [ImageFile] };
}
const handler = nextConnect();
handler.use(middleware);

handler.post(async (req: Request, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "Pas autorisé." });
  }

  const existingUsername = await prisma.user.findUnique({
    where: {
      name: req.body.name[0]
    }
  });

  if (existingUsername) {
    return res
      .status(400)
      .json({ message: "Ce nom d'utilisateur est déjà pris." });
  }

  const email: string | null | undefined = session?.user?.email;

  if (!email) {
    return res
      .status(500)
      .json({ message: "Something happened during onboarding" });
  }
  let newImageName = "";

  if (req.files.image) {
    const imageFile = req.files.image[0];

    if (imageFile.size > 1024 * 1024 * 8) {
      return res
        .status(400)
        .json({ message: "La taille de l'image ne peut pas depasser 8Mo." });
    }

    newImageName = imageNamer(imageFile.originalFilename);

    await fileSaver(imageFile, newImageName);
  }

  const updateUser = await prisma.user.update({
    where: {
      email: email
    },
    data: {
      name: req.body.name[0],
      body: req.body.body[0],
      image: newImageName
    }
  });
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
