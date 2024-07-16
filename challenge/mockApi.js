const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 8001;

app.use(bodyParser.json());

app.post('/payments', (_req, res) => {
  res.status(200).json({ status: 'success', transactionId: uuidv4() });
});

app.listen(port, () => {
  console.log(`Mock API server running at http://localhost:${port}`);
});