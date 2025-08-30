import { NextResponse } from "next/server";
import { messageQueue } from "@/lib/queue";

export async function POST(req) {
  try {
    const { numbers, message, sendAt } = await req.json();

    if (!Array.isArray(numbers) || numbers.length === 0) {
      return NextResponse.json({ error: "Provide at least one number" }, { status: 400 });
    }
    if (!message || !sendAt) {
      return NextResponse.json({ error: "Missing message or time" }, { status: 400 });
    }

    // Calculate delay (ms from now)
    const delayMs = new Date(sendAt).getTime() - Date.now();
    if (delayMs <= 0) {
      return NextResponse.json({ error: "Time must be in the future" }, { status: 400 });
    }

    // Add ONE job that contains all numbers
    await messageQueue.add(
      "sendMessage",
      { numbers, message },
      { delay: delayMs }
    );

    return NextResponse.json({
      success: true,
      scheduled: { numbers, message, sendAt },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
