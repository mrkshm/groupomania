import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ message: "Pas autorisé." });
  }

  const uId = session.user.id;

  if (!uId) {
    return res.status(401).json({ message: "Pas connecté ?" });
  }

  //
  // POST (create new comment)
  if (req.method === "POST") {
    const { body, postId, sessionUserId } = req.body;

    if (sessionUserId !== uId) {
      return res.status(401).json({ message: "Vous n'êtes pas le même..." });
    }

    try {
      const newComment = await prisma.comment.create({
        data: {
          body: body,
          userId: uId,
          postId: postId
        }
      });
      res.status(201).json(newComment);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Le commentaire n'a pas été sauvgardé." });
    }
    //
    // GET all comments for a post
  } else if (req.method === "GET") {
    console.log("getting what ?");
  }

  res.status(200).json({ message: "OK FROM BACK" });
}
