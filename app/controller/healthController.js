//const healthService = require('../services/healthService');
const db = require('../model')
const checkHealth = async (req, res) => {
  try {
    const result = await db.sequelize.authenticate();
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(200).send(result);
  } catch (error) {
    console.error('Health check error:', error);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.status(503).send();
  }
};

module.exports = {
  checkHealth,
};
