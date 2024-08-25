import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

interface UserInfo {
  username: string | null;
  imageUrl: string;
  id: string;
  email: string | null; // Add email field to the interface
}

export async function GET() {
  try {
    // Fetch the user list from Clerk
    const response = await clerkClient.users.getUserList({
      limit: 10,
    });
    
    // console.log(response);

    // Map the user data to extract necessary fields, including email
    const usersInfoMapped = response.data.map((user: any) => {
      // Extract the primary email address, if available
      const primaryEmail = user.emailAddresses && user.emailAddresses.length > 0
        ? user.emailAddresses[0].emailAddress
        : null;

      return {
        username: user.username,
        imageUrl: user.imageUrl,
        id: user.id,
        email: primaryEmail, // Add email to the returned data
      };
    });

    // console.log(usersInfoMapped)

    // Return the mapped user information as a JSON response
    return NextResponse.json(usersInfoMapped);
  } catch (error) {
    console.error(`Error fetching user details:`, error);
    return new NextResponse("Failed to fetch users", { status: 500 });
  }
}