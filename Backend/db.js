const pg = require('pg');
const { Pool } = pg;

// URL Pública de tu Railway
const DATABASE_URL = "postgresql://postgres:VkAMRGQpmDshBIdCZuEDXUQlDapKQSkg@sakura.proxy.rlwy.net:51751/railway";

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

module.exports = { pool };