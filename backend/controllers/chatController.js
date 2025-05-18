// controllers/chatController.js
const axios = require("axios");

const chat = async (req, res) => {
  try {
    const rasaResponse = await axios.post("http://localhost:5005/webhooks/rest/webhook", {
      sender: req.body.sender || "user", // Optional: Pass sender ID if needed
      message: req.body.message
    });

    const botReply = rasaResponse.data.map(entry => entry.text).join(" ") || "Sorry, I didn't understand that.";

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Rasa error:", error);
    res.status(500).send("Error generating response from Rasa");
  }
};

module.exports = { chat };
