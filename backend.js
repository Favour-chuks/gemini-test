import getColors from "get-image-colors";
import fs from "fs";
import multer from "multer";
import express from "express";
import cors from "cors";
import axios from "axios";

const port = 3000;
const app = express();
app.use(cors());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.orignalname + ".png");
  },
});

const upload = multer({ storage: storage }).single("file");

let filePath, filename, mimeType, fileURI, imageValue;
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
    console.log("file saved successfully");
  });
});

app.get("/colors", async (req, res) => {
  const buffer = await fs.readFileSync(filePath);
  try {
    getColors(buffer, "image/png").then((colors) => {
      // `colors` is an array of color objects
      console.log(colors.map((color) => color.hex()));
      res.json(colors.map((color) => color.hex()));
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => {
  console.log(`server started at port : ${port}`);
});
