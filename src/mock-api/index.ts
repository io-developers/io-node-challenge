import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());

app.post('/process-payment', (req, res) => {
  const transactionId = uuidv4();
  res.json({ status: 'success', transactionId });
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => console.log(`API Mock running on port ${PORT}`));
