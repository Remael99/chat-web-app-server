const dotenv = require("dotenv");

dotenv.config();

const SECRET = process.env._SECRET;

module.exports = SECRET;
