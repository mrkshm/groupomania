import { getBoxShadow } from "@chakra-ui/popper/dist/declarations/src/utils";
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { prisma } from "../../../../db";

interface SearchRequest extends NextApiRequest {
  params: {
    searchTerm: string;
  };
}
const handler = nextConnect({ attachParams: true });

handler.get(
  "api/posts/search/:searchTerm",
  async (req: SearchRequest, res: NextApiResponse) => {
    const { searchTerm } = req.params;

    if (!searchTerm || searchTerm === "") {
      return res.status(400).json({ message: "searchTerm cannot be empty" });
    }

    try {
      const searchTermFormatted = `%${searchTerm.toLowerCase().trim()}%`;
      // const result = await prisma.$queryRaw`SELECT * FROM "Post"`;
      const result =
        await prisma.$queryRaw`SELECT * FROM "Post" where (LOWER(title) LIKE ${searchTermFormatted} OR LOWER(body) LIKE ${searchTermFormatted}) LIMIT 30`;
      return res.status(200).json(result);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Il y avait un erreur de notre part..." });
    }
  }
);

export default handler;
