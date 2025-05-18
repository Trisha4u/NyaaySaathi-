const express = require('express');
const cors = require('cors');
const axios = require('axios');
const twilio = require('twilio');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const witClient = axios.create({
  baseURL: 'https://api.wit.ai',
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${process.env.WIT_AI_KEY}`,
    'Content-Type': 'audio/wav',
    'Transfer-Encoding': 'chunked',
  },
});

// Function to download media with Twilio authentication
const downloadMedia = async (url) => {
  const response = await axios.get(url, {
    responseType: 'stream',
    auth: {
      username: process.env.TWILIO_SID,
      password: process.env.TWILIO_AUTH_TOKEN,
    },
  });
  return response.data;
};

// Function to convert audio using FFmpeg
const convertAudio = (inputFile, outputFile) => {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = `ffmpeg -y -i "${inputFile}" -ar 16000 -ac 1 "${outputFile}"`;
    const fullPath = `${process.env.PATH};C:\\ffmpeg\\bin`; // Adjust if needed
    exec(
      ffmpegCommand,
      { env: { PATH: fullPath } },
      (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      }
    );
  });
};

app.post('/webhook', async (req, res) => {
  const sender = req.body.From;
  const userMessage = req.body.Body;
  const mediaUrl = req.body.MediaUrl0;
  const mediaType = req.body.MediaContentType0;

  try {
    if (mediaUrl && mediaType && mediaType.startsWith('audio')) {
      const oggFile = path.join(__dirname, 'audio.ogg');
      const wavFile = path.join(__dirname, 'audio.wav');

      try {
        const audioStream = await downloadMedia(mediaUrl);
        const writer = fs.createWriteStream(oggFile);
        audioStream.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      } catch {
        await sendWhatsAppMessage(sender, 'Failed to download the audio message.');
        return res.status(500).send('Failed to download audio');
      }

      try {
        await convertAudio(oggFile, wavFile);
      } catch {
        await sendWhatsAppMessage(sender, 'Failed to convert the audio message.');
        return res.status(500).send('Failed to convert audio');
      }

      let transcribedText = '';
      try {
        const audioStream = fs.createReadStream(wavFile);
        const witResponse = await witClient.post('/speech?v=20210928', audioStream, {
          headers: { 'Content-Type': 'audio/wav' },
        });
        transcribedText = witResponse.data.text;
      } catch {
        await sendWhatsAppMessage(
          sender,
          "Sorry, I couldn't understand the audio. Please try again or send a text message."
        );
        return res.status(500).send('Failed to transcribe audio');
      } finally {
        try {
          fs.unlinkSync(oggFile);
          fs.unlinkSync(wavFile);
        } catch {}
      }

      try {
        const rasaResponse = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
          sender,
          message: transcribedText || '',
        });

        const botReply =
          rasaResponse.data.map((entry) => entry.text).join(' ') ||
          "Sorry, I didn't understand that.";

        await sendWhatsAppMessage(sender, botReply);
      } catch {
        await sendWhatsAppMessage(sender, 'Sorry, there was an error communicating with the chatbot.');
        return res.status(500).send('Failed to get response from Rasa');
      }
    } else if (userMessage) {
      try {
        const rasaResponse = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
          sender,
          message: userMessage,
        });

        const botReply =
          rasaResponse.data.map((entry) => entry.text).join(' ') ||
          "Sorry, I didn't understand that.";

        await sendWhatsAppMessage(sender, botReply);
      } catch {
        await sendWhatsAppMessage(sender, 'Sorry, there was an error communicating with the chatbot.');
        return res.status(500).send('Failed to get response from Rasa.');
      }
    } else {
      await sendWhatsAppMessage(sender, "Sorry, I didn't receive a valid message. Please send text or audio.");
      res.sendStatus(200);
    }

    res.sendStatus(200);
  } catch {
    res.status(500).send('Something went wrong');
  }
});

// Send WhatsApp message using Twilio
async function sendWhatsAppMessage(to, body) {
  try {
    await client.messages.create({
      body: body,
      from: 'whatsapp:+14155238886',
      to: to,
    });
  } catch {
    throw new Error('Failed to send WhatsApp message');
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
