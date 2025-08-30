import { NextResponse } from "next/server";
import { messageQueue } from "@/lib/queue";

export async function GET() {
  try {
    // Get delayed (scheduled) jobs
    const delayedJobs = await messageQueue.getDelayed();
    const waitingJobs = await messageQueue.getWaiting(); // optional: not yet processed jobs

    // Map job data
    const jobs = [...delayedJobs, ...waitingJobs].map((job) => ({
      id: job.id,
      numbers: job.data.numbers,
      message: job.data.message,
      timestamp: new Date(job.timestamp).toLocaleString(),
      delay: job.delay,
    }));

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
