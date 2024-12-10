// api/teams/[teamId]/domains.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; // Correct path to prisma.ts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { teamId } = req.query; // Get teamId from query params

  if (method === "POST") {
    const { domain } = req.body; // Extract domain from request body

    // Validate that the domain is provided
    if (!domain) {
      return res.status(400).json({ message: "Domain is required" });
    }

    // Example: Prevent domain from containing 'papermark'
    if (domain.toLowerCase().includes("papermark")) {
      return res.status(400).json({ message: "Domain cannot contain 'papermark'" });
    }

    try {
      // Create the domain for the team in the database
      const newDomain = await prisma.domain.create({
        data: {
          domain,
          team: {
            connect: {
              id: teamId, // Link the domain to the team
            },
          },
        },
      });

      return res.status(200).json(newDomain); // Return newly created domain
    } catch (error) {
      console.error("Error adding domain:", error);
      return res.status(500).json({ message: "Error adding domain" }); // Handle unexpected errors
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" }); // Only allow POST requests
  }
}
