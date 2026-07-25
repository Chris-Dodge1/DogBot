const token = process.env.TELEGRAM_BOT_TOKEN;

async function getChatIds() {
  if (!token) {
    throw new Error("Missing TELEGRAM_BOT_TOKEN in .env");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/getUpdates`
  );

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.description || "Telegram request failed");
  }

  if (data.result.length === 0) {
    console.log("No updates found.");
    return;
  }

  for (const update of data.result) {
    const chat =
      update.message?.chat ??
      update.edited_message?.chat ??
      update.my_chat_member?.chat ??
      update.chat_member?.chat ??
      update.channel_post?.chat;

    if (chat) {
      console.log("-------------------------");
      console.log("Name:", chat.title || chat.first_name || "Unknown");
      console.log("Type:", chat.type);
      console.log("Chat ID:", chat.id);
    }
  }
}

getChatIds().catch((error) => {
  console.error("Error:", error.message);
});