import express from "express";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = 3010;
app.use(express.json());

app.post("/api/process-payment", (req, res) => {
  const { accountId, amount } = req.body;

  if (accountId && typeof amount === "number" && amount > 0) {
    const transactionId = uuidv4();
    return res
      .status(200)
      .json({ message: "payment successful", transactionId });
  } else {
    return res
      .status(404)
      .json({ message: "payment failed", error: "Bad request" });
  }
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof Error) {
    return res.status(500).json({ message: err.message });
  }
  return res.status(500).json({ message: "Something was wrong" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
