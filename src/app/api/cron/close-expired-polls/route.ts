import { NextResponse } from "next/server";
import { pollService } from "@/lib/services";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const closed = await pollService.closeExpiredPolls();
    return NextResponse.json({ success: true, closed });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
