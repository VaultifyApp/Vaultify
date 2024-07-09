import express from 'express';

const app = express();
const port = process.env.PORT || 3002;

app.get('/api', (req, res) => {
  res.send('Hello from the server!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});