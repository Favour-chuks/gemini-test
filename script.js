import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import multer from "multer";
import axios from "axios";

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
    cb(null, Date.now() + "-" + file.orignalname + ".png");
  },
});

const upload = multer({ storage: storage }).single("file");



app.post("/file", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    filePath = req.file.path;
    mimeType = req.file.mimetype;
    imageValue = filePath.split("\\").reverse().at(0);
    fileURI = `file://${req.get("host")}/${filePath}`;
    filename = req.file;
  });
});

app.post("/get", async (req, res) => {
  const prompt = "what is in this image";
const image = {
  inlineData: {
    data: Buffer.from(fs.readFileSync("img.png")).toString("base64"),
    mimeType: "image/png",
  },
};
try{
  
const result = await model.generateContent([prompt, image]);
console.log(result.response.text());
}catch(error){
  console.log(error.message)
}
});


app.listen(port, () => {
  console.log(`listening on port: ${port}`);
});
