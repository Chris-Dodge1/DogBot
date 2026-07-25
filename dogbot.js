function createDogFedMessage() {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());

  return `🐶 DogBot: The dogs were fed at ${time}.`;
}

async function sendDogFedMessage() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const message = createDogFedMessage();

  // This lets us build and test before creating the Telegram group.
  if (!chatId) {
    console.log("Telegram group is not connected yet.");
    console.log("Generated message:", message);
    return;
  }

  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN.");
  }

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

  if (!response.ok) {
    throw new Error(
      result.description || "Telegram failed to send the message."
    );
  }

  console.log("DogBot message sent successfully.");
}

sendDogFedMessage().catch((error) => {
  console.error("DogBot error:", error.message);
});