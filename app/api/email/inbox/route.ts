import { NextResponse } from "next/server";
import { emailService } from "@/lib/email-service";

// Mark this route as dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Ensure environment variables are set
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  throw new Error('Email configuration is missing required environment variables');
}

export async function GET(request: Request) {
  try {
    // Safely parse the URL and get search params
    let limit = 10;
    try {
      const url = new URL(request.url);
      const limitParam = url.searchParams.get('limit');
      if (limitParam) {
        const parsedLimit = parseInt(limitParam);
        if (!isNaN(parsedLimit) && parsedLimit > 0) {
          limit = Math.min(parsedLimit, 50); // Cap at 50 emails
        }
      }
    } catch (error) {
      console.warn('Failed to parse request URL, using default limit:', error);
    }
    
    const emails = await emailService.getLatestEmails(limit);
    
    return NextResponse.json({
      success: true,
      data: emails,
      limit,
      count: emails.length
    });
  } catch (error) {
    console.error("Fetch emails error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to fetch emails",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 