import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const addSocialMedia = async (req: Request, res: Response) => {
  const { github, instagram, twitter, facebook, discord, linkedin, whatsapp } =
    req.body;

  try {
    await prisma.social.create({
      data: {
        userid: req?.id,
        github: github ? github : null,
        instagram: instagram ? instagram : null,
        facebook: facebook ? facebook : null,
        discord: discord ? discord : null,
        linkedin: linkedin ? linkedin : null,
        whatsapp: whatsapp ? whatsapp : null,
        twitter: twitter ? twitter : null,
      },
    });
    res.status(200).json({ msg: "links added" });
  } catch (error: any) {
    res.status(400).json(error);
  }
};

// export const addSocialMedia = async (req: Request, res: Response) => {
//   const { github, instagram, twitter, facebook, discord, linkedin, whatsapp } =
//     req.body;

//   try {
//     await prisma.social.create({
//       data: {
//         userid: req.body.userid,
//         github: github ? github : null,
//         instagram: instagram ? instagram : null,
//         facebook: facebook ? facebook : null,
//         discord: discord ? discord : null,
//         linkedin: linkedin ? linkedin : null,
//         whatsapp: whatsapp ? whatsapp : null,
//         twitter: twitter ? twitter : null,
//       },
//     });
//     res.status(200).json({ msg: "links added" });
//   } catch (error: any) {
//     res.status(400).json(error);
//   }
// };

export const getSocialMedias = async (req: Request, res: Response) => {
  try {
    const socials = await prisma.social.findMany({
      where: {
        userid: req.id,
      },
    });

    res.status(200).json(socials);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const updateSocialMedia = async (req: Request, res: Response) => {
  const { github, instagram, twitter, facebook, discord, linkedin, whatsapp } =
    req.body;

  const social = await prisma.social.findUnique({
    where: {
      userid: req.id,
    },
  });

  if (!social) return res.status(404).json({ msg: "social not found" });

  try {
    const updated = await prisma.social.update({
      where: {
        userid: req.id,
      },
      data: {
        github: github ? github : social?.github,
        instagram: instagram ? instagram : social?.instagram,
        facebook: facebook ? facebook : social?.facebook,
        discord: discord ? discord : social?.discord,
        linkedin: linkedin ? linkedin : social?.linkedin,
        whatsapp: whatsapp ? whatsapp : social?.whatsapp,
        twitter: twitter ? twitter : social?.twitter,
      },
    });
    res.status(200).json({ old: social, updated: updated });
  } catch (error) {
    res.status(400).json(error);
  }
};
