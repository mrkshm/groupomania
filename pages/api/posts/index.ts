import type { NextApiRequest, NextApiResponse } from "next";
import middleware from "../../../middleware/middleware";
import { slugify, makeId } from "../../../src/utils/helpers";
import { prisma } from "../../../db";
import nextConnect from "next-connect";
const path = require("path");
import { getSession } from "next-auth/react";
import imageNamer from "../../../src/utils/imageNamer";
import fileSaver from "../../../src/utils/fileSaver";

interface Request extends NextApiRequest {
  files: any;
}

const handler = nextConnect({ attachParams: true });
handler.use(middleware);
//
// POST (create Post)
//
handler.post(async (req: Request, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: "Pas autorisé" });
  }

  const uId = session.user.id;
  if (!uId) {
    return res.status(401).json({ message: "Pas connecté ?" });
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

  const title: string = req.body.title[0];
  const identifier: string = makeId(7);
  const slug: string = slugify(title);
  const body: string = req.body.body[0];
  const tag: number = Number(req.body.tag[0]);
  const userId = uId;

  try {
    await prisma.post.create({
      data: {
        title: title,
        identifier: identifier,
        slug: slug,
        body: body,
        tagId: tag,
        image: newImageName,
        userId: userId
      }
    });
  } catch (error) {
    return res.status(400).json(error);
  }

  return res.status(201).json({ message: "OK" });
});

//
// GET (read all posts)
//
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session.user) {
    return res.status(401).json({ message: "Pas autorisé" });
  }

  const uId = session.user.id;
  if (!uId) {
    return res.status(401).json({ message: "Pas connecté ?" });
  }
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 8) as number;
  try {
    const posts: any = await prisma.post.findMany({
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
  } catch (error) {
    return res.status(500).json(error);
  }
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
