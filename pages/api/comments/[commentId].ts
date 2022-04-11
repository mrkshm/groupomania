import type { NextApiRequest, NextApiResponse } from "next";
import middleware from "../../../middleware/middleware";
import { prisma } from "../../../db";
import nextConnect from "next-connect";
import { getSession } from "next-auth/react";

interface Request extends NextApiRequest {
  params: { commentId: number };
}

const handler = nextConnect({ attachParams: true });

handler.post(
  "api/comments/:commentId",
  async (req: Request, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(500).json({ message: "Il y avait un erreur" });
    }
    // @ts-ignore
    const uId = session.user.id;
    if (!uId) {
      return res.status(401).json({ message: "Pas connecté ?" });
    }
    const { commentId } = req.params;

    const body = JSON.parse(req.body).body;

    try {
      const modComment = await prisma.comment.update({
        where: {
          id: Number(commentId)
        },
        data: {
          body: body
        }
      });

      return res.status(200).json(modComment);
    } catch (error) {
      return res.status(500).json("Il y avait un erreur.");
    }
  }
);

handler.delete(
  "api/comments/:commentId",
  async (req: Request, res: NextApiResponse) => {
    const session = await getSession({ req });

    if (!session || !session.user) {
      return res.status(500).json({ message: "Il y avait un erreur." });
    }
    // @ts-ignore
    const uId = session.user.id;
    if (!uId) {
      return res.status(401).json({ message: "Pas connecté ?" });
    }
    const { commentId } = req.params;

    try {
      const delComment = await prisma.comment.delete({
        where: {
          id: Number(commentId)
        }
      });

      return res.status(200).json("Le commentaire a été supprimé.");
    } catch (error) {
      return res.status(500).json("Il y avait un erreur.");
    }
  }
);

export default handler;
