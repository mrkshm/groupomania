import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { prisma } from "../../../db";
import nc from "next-connect";

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const uId: string | undefined | null = session?.user?.id;
  if (!uId) {
    return res.status(401).json({ message: "Pas connecté ?" });
  }

  try {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default handler;
