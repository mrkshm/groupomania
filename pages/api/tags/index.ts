import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session || !session.user) {
    return res.status(401).json({ message: "Pas autorisé" });
  }
  // @ts-ignore
  const userId = session.user.id;
  if (!userId) {
    return res.status(401).json({ message: "Pas authentifié ?" });
  }

  if (req.method === "POST") {
    // POST create one tag
    const tagname = JSON.parse(req.body).name;
    if (tagname.length > 20 || tagname.length < 2) {
      return res.status(400).json({
        message: "Le nom d'un tag doit contenir entre 2 et 20 caractères."
      });
    }

    try {
      await prisma.tag.create({
        data: {
          name: tagname,
          userId: userId
        }
      });
    } catch (error) {
      return res.status(400).json({ message: "Ce tag existe déjà." });
    }
    return res.status(201).json({ message: "Le tag a été crée." });
  } else if (req.method === "GET") {
    // GET read all tags
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });

    return res.json(tags);
  } else if (req.method === "DELETE") {
    // DELETE clean all tags not associated with a post
    // Get all tags
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true
          }
        }
      }
    });
    // Go through tags and delete everything where posts < 1
    tags.forEach(async tag => {
      if (tag._count.posts < 1) {
        try {
          await prisma.tag.delete({
            where: {
              id: tag.id
            }
          });
        } catch (error) {}
      }
    });
    return res.status(200).json({ message: "Les tags ont été nettoyés." });
  }
}
