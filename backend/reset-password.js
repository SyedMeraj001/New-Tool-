import pg from 'pg';
import bcrypt from 'bcrypt';
const { Client } = pg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'new_tool_db',
  user: 'postgres',
  password: 'admin'
});

async function resetPassword() {
  try {
    await client.connect();
    
    // Reset password for superadmin1 to "Admin@123"
    const newPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await client.query(
      "UPDATE users SET password = $1 WHERE email = 'superadmin1@esgenius.com'",
      [hashedPassword]
    );
    
    console.log('✅ Password reset successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('  Email: superadmin1@esgenius.com');
    console.log('  Password: Admin@123');
    console.log('  Role: Super Admin');
    
    await client.end();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

resetPassword();
