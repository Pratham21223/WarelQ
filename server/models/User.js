const pool = require('../config/database');

class User {
  static async create(userData) {
    const result = await pool.query(
      `INSERT INTO users 
       (clerk_user_id, email, first_name, last_name, username, profile_image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userData.clerk_user_id,
        userData.email,
        userData.first_name,
        userData.last_name,
        userData.username,
        userData.profile_image_url
      ]
    );
    return result.rows[0];
  }

  static async findByClerkId(clerkUserId) {
    const result = await pool.query(
      `SELECT * FROM users WHERE clerk_user_id = $1`,
      [clerkUserId]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }

  static async findAll(limit = 50, offset = 0) {
    const result = await pool.query(
      `SELECT * FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async update(clerkUserId, userData) {
    const result = await pool.query(
      `UPDATE users 
       SET email = $1, 
           first_name = $2, 
           last_name = $3, 
           username = $4, 
           profile_image_url = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE clerk_user_id = $6
       RETURNING *`,
      [
        userData.email,
        userData.first_name,
        userData.last_name,
        userData.username,
        userData.profile_image_url,
        clerkUserId
      ]
    );
    return result.rows[0];
  }

  static async delete(clerkUserId) {
    const result = await pool.query(
      `DELETE FROM users WHERE clerk_user_id = $1 RETURNING *`,
      [clerkUserId]
    );
    return result.rows[0];
  }

  static async getRecentUsers(days = 7) {
    const result = await pool.query(
      `SELECT 
        id,
        clerk_user_id,
        email,
        first_name,
        last_name,
        username,
        created_at
       FROM users
       WHERE created_at >= NOW() - INTERVAL '${days} days'
       ORDER BY created_at DESC
       LIMIT 20`
    );
    return result.rows;
  }

  static async count() {
    const result = await pool.query(
      `SELECT COUNT(*) as total FROM users`
    );
    return parseInt(result.rows[0].total);
  }

  static async search(searchTerm, limit = 20) {
    const result = await pool.query(
      `SELECT * FROM users 
       WHERE first_name ILIKE $1 
          OR last_name ILIKE $1 
          OR email ILIKE $1 
          OR username ILIKE $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [`%${searchTerm}%`, limit]
    );
    return result.rows;
  }

  static async upsert(userData) {
    const result = await pool.query(
      `INSERT INTO users 
       (clerk_user_id, email, first_name, last_name, username, profile_image_url)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (clerk_user_id) 
       DO UPDATE SET 
         email = EXCLUDED.email,
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         username = EXCLUDED.username,
         profile_image_url = EXCLUDED.profile_image_url,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        userData.clerk_user_id,
        userData.email,
        userData.first_name,
        userData.last_name,
        userData.username,
        userData.profile_image_url
      ]
    );
    return result.rows[0];
  }
}

module.exports = User;
