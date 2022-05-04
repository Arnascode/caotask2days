require('dotenv').config();

const PORT = process.env.PORT || 5000;

// db config
const dbConfig = {
  host: '194.135.87.110',
  user: 'slscom_vetbee6',
  password: 'k4hMJsmD76dNqXKp',
  database: 'slscom_vetbee6',
};

module.exports = {
  PORT,
  dbConfig,
};
