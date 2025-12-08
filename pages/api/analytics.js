import fs from "fs";
import path from "path";

export default function handler(req, res) {
  const secret = req.query.key;

  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const analyticsPath = path.join(process.cwd(), "data", "analytics.json");

  try {
    const raw = fs.readFileSync(analyticsPath, "utf8");
    const data = JSON.parse(raw);
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Cannot read analytics" });
  }
}
