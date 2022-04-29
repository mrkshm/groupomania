import type { NextApiRequest, NextApiResponse } from "next";
import middleware from "../../../../middleware/middleware";
import { prisma } from "../../../../db";
import nextConnect from "next-connect";
import { getSession } from "next-auth/react";

interface Request extends NextApiRequest {
  params: { userId: string };
}

const handler = nextConnect({ attachParams: true });
handler.use(middleware);

handler.get(
  "api/comments/from/:userId",
  async (req: Request, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (!session || !session.user) {
      return res.status(401).json({ message: "Pas autorisé" });
    }
    // @ts-ignore
    const uId = session.user.id;
    if (!uId) {
      return res.status(401).json({ message: "Pas connecté ?" });
    }
    const { userId } = req.params;

    const currentPage: number = (req.query.page || 0) as number;
    const commentsPerPage: number = (req.query.count || 8) as number;

    try {
      const comments: any = await prisma.comment.findMany({
        where: {
          userId: userId
        },
        include: {
          user: {
            select: {
              name: true
            }
          },
          commentVotes: {
            select: {
              value: true,
              userId: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: currentPage * commentsPerPage,
        take: commentsPerPage
      });

      comments.forEach(async (comment: any) => {
        let voteScore = 0;
        let userVote = 0;
        comment.commentVotes.forEach((vote: any) => {
          voteScore += vote.value;
          if (vote.userId === uId) {
            userVote = vote.value;
          }
        });
        comment.userVote = userVote;
        comment.voteScore = voteScore;
        delete comment.votes;
        comment.username = comment.user.name;
        delete comment.user;
      });

      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ message: "Il y avait un erreur." });
    }
  }
);

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
