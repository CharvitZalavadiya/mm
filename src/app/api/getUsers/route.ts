import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Prevents static rendering issuescls

interface UserInfo {
  username: string;
  imageUrl: string;
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export async function GET() {
  try {
    const response = await (await clerkClient()).users.getUserList({
      limit: 100,
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
    
    // const headers = new Headers({
    //   "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    //   Pragma: "no-cache",
    //   Expires: "0",
    // });

    // return NextResponse.json(usersInfoMapped, {headers});
    return NextResponse.json(usersInfoMapped);
  } catch (error) {
    console.error(`Error fetching user details:`, error);
    return new NextResponse("Failed to fetch users ss", { status: 500 });
  }
}
