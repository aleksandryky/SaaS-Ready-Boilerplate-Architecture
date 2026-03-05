const dotenv = require('dotenv');

dotenv.config();

const required = (name, defaultValue) => {
  const value = process.env[name] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(required('PORT', 4000)),
  jwtSecret: required('JWT_SECRET', 'change-me-in-prod'),
  corsOrigin: required('CORS_ORIGIN', '*'),
};

