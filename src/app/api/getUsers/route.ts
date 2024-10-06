import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface UserInfo {
  username: string | null;
  imageUrl: string;
  id: string;
  email: string | null; // Add email field to the interface
  firstname: string | null;
  lastname: string | null;
}

export async function GET() {
  try {
    const response = await clerkClient.users.getUserList({
      limit: 11,
    });

    const usersInfoMapped: UserInfo[] = response.data.map((user: any) => {
      const primaryEmail = user.emailAddresses?.[0]?.emailAddress || null;

      return {
        username: user.username,
        imageUrl: user.imageUrl,
        id: user.id,
        email: primaryEmail,
        firstname: user.firstName,
        lastname: user.lastName,
      };
    });

    // console.log(usersInfoMapped)

    return NextResponse.json(usersInfoMapped);
  } catch (error) {
    console.error(`Error fetching user details:`, error);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}
