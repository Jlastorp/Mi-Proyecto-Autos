const pg = require('pg');
const { Pool } = pg;

const DATABASE_URL = "postgresql://postgres:VkAMRGQpmDshBIdCZuEDXUQlDapKQSkg@sakura.proxy.rlwy.net:51751/railway";

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function check() {
    try {
        console.log('Connecting to database...');
        const res = await pool.query(`
            SELECT table_name, column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'ventas';
        `);
        console.log('Ventas columns:', res.rows);

        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public';
        `);
        console.log('All tables:', tables.rows.map(r => r.table_name));

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
