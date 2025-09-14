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

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
