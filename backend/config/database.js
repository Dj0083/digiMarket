// config/database.js - Cleaned MySQL Database Configuration
const mysql = require('mysql2');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🔧 Loading database configuration...');
console.log('Environment variables loaded:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PASSWORD: process.env.DB_PASSWORD ? '***set***' : 'empty'
});

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'marketplace',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
};

console.log('📋 Database Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password === '' ? 'empty (WAMP default)' : '***set***'
});

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

/**
 * Test connection and check database/tables
 */
const testConnection = async () => {
  let connection;
  try {
    console.log('\n🔌 Testing database connection...');
    connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully!');

    // Test basic info query
    try {
      const [rows] = await connection.execute(
        'SELECT DATABASE() AS db_name, VERSION() AS mysql_version, CURRENT_USER() AS db_user'
      );
      console.log('📊 Database Info:', rows[0]);
    } catch (queryError) {
      console.error('⚠️ Test info query failed:', queryError.message);
    }

    // Check if marketplace database exists
    const [databases] = await connection.query('SHOW DATABASES'); // use query() here
    const dbNames = databases.map(db => Object.values(db)[0]);

    if (dbNames.includes('marketplace')) {
      console.log('✅ marketplace database exists!');

      // Switch to marketplace and list tables
      await connection.query('USE marketplace');
      const [tables] = await connection.query('SHOW TABLES');
      console.log(`📋 Found ${tables.length} tables in marketplace database`);
      if (tables.length > 0) {
        console.log('   Tables:', tables.map(t => Object.values(t)[0]).join(', '));
      } else {
        console.log('   📝 Database is empty - ready for schema setup');
      }
    } else {
      console.log('❌ marketplace database does not exist');
      console.log('💡 Create it in phpMyAdmin or run: CREATE DATABASE marketplace;');
    }

    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Error code:', error.code);

    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('🔧 SOLUTION: Check your MySQL username/password (.env)');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔧 SOLUTION: Ensure MySQL service is running on port 3306');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🔧 SOLUTION: Verify DB_HOST in .env file');
    }

    return false;
  } finally {
    if (connection) connection.release();
  }
};

// Helper query functions
const executeQuery = async (query, params = []) => {
  try {
    const [rows] = await promisePool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};

const getConnection = async () => {
  return await promisePool.getConnection();
};

// Run test if file is executed directly
if (require.main === module) {
  console.log('🚀 Running database connection test...\n');
  testConnection().then(success => {
    if (success) {
      console.log('\n🎉 Database configuration is working correctly!');
    } else {
      console.log('\n❌ Database configuration needs fixing');
    }
    process.exit(success ? 0 : 1);
  });
}

module.exports = {
  pool: promisePool,
  executeQuery,
  getConnection,
  testConnection
};
