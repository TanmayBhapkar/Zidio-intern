import { Router } from "express";
import multer from "multer";
import xlsx from "xlsx";
import Dataset from "../models/Dataset.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });
    const columns =
      rows.length
        ? Object.keys(rows[0]).map((k) => ({ key: k, type: typeof rows[0][k] }))
        : [];
    const ds = await Dataset.create({
      userId: req.user.id,
      name: sheetName || req.file.originalname || "Sheet1",
      originalFilename: req.file.originalname,
      columns,
      rows,
      sizeBytes: req.file.size,
    });
    res.json({ id: ds._id, name: ds.name, rows: ds.rows.length, columns: ds.columns.map((c) => c.key) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to parse or save dataset" });
  }
});

router.get("/", requireAuth, async (req, res) => {
  const items = await Dataset.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .select("_id name originalFilename createdAt rows columns sizeBytes");
  res.json(items);
});

router.get("/:id", requireAuth, async (req, res) => {
  const ds = await Dataset.findOne({ _id: req.params.id, userId: req.user.id });
  if (!ds) return res.status(404).json({ error: "Not found" });
  res.json(ds);
});

router.delete("/:id", requireAuth, async (req, res) => {
  await Dataset.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.json({ ok: true });
});

export default router;
