import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import IORedis from "ioredis";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379",{ 
        maxRetriesPerRequest: null,
        enableReadyCheck: true,
        username : null,
        password : null
    });
// Twilio client

const worker = new Worker(
  "messages",
  async (job) => {
    const { numbers, message } = job.data;

    console.log(`📨 Sending message to ${numbers.length} recipients...`);

    for (const to of numbers) {
      try {
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP,
          to: `whatsapp:${to}`,
          body: message,
          statusCallback: "https://8a2f02e5e96c.ngrok-free.app/api/twilio"
        });
        console.log(`✅ Sent to ${to}`);
      } catch (err) {
        console.error(`❌ Failed to send to ${to}: ${err.message}`);
      }
    }

    console.log("🎉 All messages processed!");
  },
  { connection }
);

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed: ${err.message}`);
});
