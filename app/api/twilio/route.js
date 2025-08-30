export async function POST(req) {
  // Twilio sends form-urlencoded data, not JSON
  const bodyText = await req.text();
  const params = new URLSearchParams(bodyText);

  const MessageSid = params.get("MessageSid");
  const MessageStatus = params.get("MessageStatus");
  const To = params.get("To");

  console.log(`📡 Status update for ${To}: ${MessageStatus} (SID: ${MessageSid})`);

  return new Response(null, { status: 200 }); // Twilio expects 200
}
