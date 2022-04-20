import type { NextApiRequest, NextApiResponse } from "next";

import nextConnect from "next-connect";
const path = require("path");

import fs from "fs";

import { getImage } from "../../../src/utils/aws";

interface Request extends NextApiRequest {
  params: { key: string };
}

const handler = nextConnect({ attachParams: true });

handler.get("api/images/:key", async (req: Request, res: NextApiResponse) => {
  const { key } = req.params;
  const readStream = getImage(key);
  readStream.pipe(res);
});

export const config = {
  api: {
    bodyParser: false
  }
};

export default handler;
