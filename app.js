const express = require('express');
const healthRouter = require('./routes/routes');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// Health check route
app.use('/', healthRouter);

const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
