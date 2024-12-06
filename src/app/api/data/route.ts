// app/api/data/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Fetch fresh data (replace this with your actual database query)
  const freshData = { message: "Fresh data from the database" };

  // Create a response with "Cache-Control: no-store" header
  return new NextResponse(JSON.stringify(freshData), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store', // Prevents caching
    },
  });
}
