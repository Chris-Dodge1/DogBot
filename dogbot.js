function createDogFedMessage() {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

  const name = process.env.PERSON_NAME?.trim() || "Someone";

  return `${name} fed the dogs at ${time}.`;
}

async function sendDogFedMessage() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN.");
  }

  if (!chatId) {
    throw new Error("Missing TELEGRAM_CHAT_ID.");
  }

  const message = createDogFedMessage();

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok || !result.ok) {
    throw new Error(
      result.description || "Telegram failed to send the message."
    );
  }

  console.log("Message sent successfully:");
  console.log(message);
}

sendDogFedMessage().catch((error) => {
  console.error("Error:", error.message);
  process.exitCode = 1;
});