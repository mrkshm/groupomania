import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../db";
import nextConnect from "next-connect";
import { getSession } from "next-auth/react";
import { makeId } from "../../../../src/utils/helpers";
import fs from "fs";

const handler = nextConnect({ attachParams: true });

interface Request extends NextApiRequest {
  params: {
    action: string;
    userId: string;
  };
}
handler.delete(
  `/api/admin/:action/:userId`,
  async (req: Request, res: NextApiResponse) => {
    const { action, userId } = req.params;
    const session = await getSession({ req });
    // @ts-ignore
    const uId = session.user.id;
    if (!uId) {
      return res.status(401).json({ message: "Pas connecté ?" });
    }

    if (uId !== userId) {
      return res.status(401).json({ message: "Pas autorisé." });
    }

    try {
      const changedUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          isActive: false,
          isAdmin: false
        }
      });
      res.status(200).json({ message: "ok" });
    } catch (error) {
      console.log("Il y avait un erreur");
    }
  }
);

handler.get(
  `/api/admin/:action/:userId`,
  async (req: Request, res: NextApiResponse) => {
    const { action, userId } = req.params;
    const session = await getSession({ req });
    // @ts-ignore
    const uId = session.user.id;
    if (!uId) {
      return res.status(401).json({ message: "Pas connecté ?" });
    }

    const sessionUser = await prisma.user.findUnique({
      where: {
        id: uId
      }
    });

    if (!sessionUser || !sessionUser.isAdmin) {
      return res.status(401).json({ message: "Pas autorisé." });
    }

    let msg = "";

    try {
      if (action === "promote") {
        const changedUser = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            isAdmin: true
          }
        });
        msg = "La promotion a été accompli.";
      } else if (action === "demote") {
        const changedUser = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            isAdmin: false
          }
        });
        msg = "La démotion a été accompli.";
      } else if (action === "deactivate") {
        const changedUser = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            isActive: false
          }
        });
        msg = "La déactivation a été accompli.";
      } else if (action === "reactivate") {
        const changedUser = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            isActive: true
          }
        });
        msg = "La réactivation a été accompli.";
      } else if (action === "delete") {
        const name = `supprimé_${makeId(6)}`;
        const email = `nomail@${makeId(6)}`;
        const changedUser = await prisma.user.update({
          where: {
            id: userId
          },
          data: {
            name: name,
            email: email,
            isActive: false,
            isAdmin: false
          }
        });
        msg = "La suppression a été accompli.";
      } else if (action === "annihilate") {
        try {
          const findUser = await prisma.user.findUnique({
            where: {
              id: userId
            }
          });
          if (!findUser) {
            console.log("utilisateur pas trouvé");
            return;
          }
          fs.unlink(`./public/${findUser.image}`, () => {
            console.log("image supprimé");
          });

          const deleteUser = await prisma.user.delete({
            where: {
              id: userId
            }
          });
        } catch (error) {
          console.log(Error);
        }
        const deleteUser = await prisma.user.delete({
          where: {
            id: userId
          }
        });
        console.log("ser user", deleteUser);

        msg = "La carbonisation a été accompli.";
      }
      return res.status(200).json({ message: msg });
    } catch (error) {
      return res.status(500).json({ message: "L'action a échouée." });
    }
  }
);

export const config = {
  api: {
    bodyParser: true
  }
};

export default handler;
