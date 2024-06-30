import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";

const port = 5000;

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_kEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.orignalname);
  },
});

const upload = multer({ storage: storage }).single("file");
let filePath;
app.post("/file", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    filePath = req.file.path;
  });
});

app.post("/", async (req, res) => {
  console.log(req.body.history);
  console.log(req.body.message);

  const chat = model.startChat({
    history: req.body.history,
  });
  const message = req.body.message;

  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = response.text();

  res.send(text);
});

app.post("/openAI", async (req, res) => {
  const prompt = req.body.message;

  const image = fs.readFileSync(filePath, "base64");

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: image,
          fileUri: `data:image/jpeg:base64,${image}`,
        },
      },
    ]);
    console.log(result.response.text());
  } catch (error) {
    console.log(error);
  }

  // // Output the generated text to the console
  // console.log(result.response.text());
});

app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
