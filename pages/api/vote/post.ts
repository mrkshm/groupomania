import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../db";
import nextConnect from "next-connect";
import { getSession } from "next-auth/react";
interface Request extends NextApiRequest {}
const handler = nextConnect();

handler.post(async (req: Request, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: "Pas autorisé" });
  }
  // @ts-ignore
  const uId = session.user.id;
  if (!uId) {
    return res.status(401).json({ message: "Pas connecté ?" });
  }

  const { id, value, userId } = req.body;

  // validate vote value
  if (![-1, 0, 1].includes(value)) {
    return res
      .status(400)
      .json({ message: "le vote ne peut être que -1, 0 ou 1" });
  }

  if (userId !== uId) {
    return res.status(401).json({
      message:
        "Vous n'étes pas la même personne sur le frontend que sur le backend."
    });
  }

  const vote = await prisma.postVote.upsert({
    where: {
      userPostVote: {
        userId: uId,
        postId: id
      }
    },
    update: {
      value: value
    },
    create: {
      userId: uId,
      postId: id,
      value: Number(value)
    }
  });

  const post: any = await prisma.post.findUnique({
    where: {
      id: id
    },
    include: {
      postVotes: {
        select: {
          value: true,
          userId: true
        }
      }
    }
  });
  let voteScore = 0;
  let userVote = 0;
  post?.postVotes.forEach((vote: any) => {
    voteScore += vote.value;
    if (vote.userId === uId) {
      userVote = vote.value;
    }
  });

  post.voteScore = voteScore;
  post.userVote = userVote;

  return res.status(201).json(post);
});

export const config = {
  api: {
    bodyParser: true
  }
};

export default handler;
