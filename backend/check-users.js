import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'new_tool_db',
  user: 'postgres',
  password: 'admin'
});

async function checkUsers() {
  try {
    await client.connect();
    const result = await client.query("SELECT id, email, password, role FROM users WHERE email = 'superadmin1@esgenius.com'");
    console.log('Users in database:');
    console.table(result.rows);
    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkUsers();
