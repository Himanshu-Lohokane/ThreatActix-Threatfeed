import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fetchOpenCTIData } from "./src/utils/opencti-client.js";

dotenv.config();

const app = express();
app.use(cors());

app.get("/api/opencti", async (req, res) => {
  try {
    const data = await fetchOpenCTIData();
    res.json(data);
  } catch (err) {
    console.error("Error fetching OpenCTI data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`Backend running on http://0.0.0.0:${PORT}`));
