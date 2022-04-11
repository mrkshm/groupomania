import type { NextApiRequest, NextApiResponse } from "next";
import middleware from "../../../../middleware/middleware";
import { prisma } from "../../../../db";
import nextConnect from "next-connect";
const path = require("path");
import { getSession } from "next-auth/react";

interface Request extends NextApiRequest {
  params: {
    identifier: string;
    slug: string;
  };
}

const handler = nextConnect({ attachParams: true });
handler.use(middleware);

//
// GET one post
//
handler.get(
  "api/posts/:identifier/:slug",
  async (req: Request, res: NextApiResponse) => {
    const session = await getSession({ req });
    if (!session || !session.user) {
      return res.status(401).json({ message: "Pas autorisé" });
    }
    const uId = session.user.id;
    if (!uId) {
      return res.status(401).json({ message: "Pas connecté ?" });
    }

    const { identifier, slug } = req.params;

    try {
      const post: any = await prisma.post.findUnique({
        where: {
          postId: {
            identifier: identifier,
            slug: slug
          }
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
        }
      });
      // set voteScore, commentCount, userVote for the post
      let voteScore = 0;
      let userVote = 0;
      post.postVotes.forEach((vote: any) => {
        voteScore += vote.value;
        if (vote.userId === uId) {
          userVote = vote.value;
        }
      });
      post.userVote = userVote ? userVote : 0;
      post.voteScore = voteScore ? voteScore : 0;
      post.commentCount = post._count.comments;
      post.tagName = post.tag.name;
      post.userName = post.user.name;
      delete post.user;
      delete post.tag;
      delete post.votes;
      delete post._count;

      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: "Le post n'était pas trouvé." });
    }
  }
);

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
