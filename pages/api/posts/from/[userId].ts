import type { NextApiRequest, NextApiResponse } from "next";
import middleware from "../../../../middleware/middleware";
import { prisma } from "../../../../db";
import nextConnect from "next-connect";
const path = require("path");
import { getSession } from "next-auth/react";

// TODO update type definition for req.files
interface Request extends NextApiRequest {
  params: { userId: string };
}

const handler = nextConnect({ attachParams: true });
handler.use(middleware);

//
// GET (read all posts with tag from req)
//
handler.get(
  "api/posts/from/:userId",
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
    const postsPerPage: number = (req.query.count || 8) as number;
    try {
      const posts: any = await prisma.post.findMany({
        where: {
          userId: userId
        },
        include: {
          comments: true,
          tag: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              name: true
            }
          },
          postVotes: {
            select: {
              value: true,
              userId: true
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        orderBy: {
          createdAt: "desc"
        },
        skip: currentPage * postsPerPage,
        take: postsPerPage
      });

      // set voteScore, commentCount, userVote for each post

      posts.forEach(async (post: any) => {
        let voteScore = 0;
        let userVote = 0;
        post.postVotes.forEach((vote: any) => {
          voteScore += vote.value;
          if (vote.userId === uId) {
            userVote = vote.value;
          }
        });
        post.userVote = userVote;
        post.voteScore = voteScore;
        post.commentCount = post._count.comments;
        post.tagName = post.tag.name;
        post.userName = post.user.name;
        delete post.user;
        delete post.tag;
        delete post.votes;
        delete post._count;
      });

      return res.status(200).json(posts);
      // return res.status(200).json({ message: "ok" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
);

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
