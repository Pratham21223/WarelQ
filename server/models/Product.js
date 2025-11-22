const pool = require('../config/database');

class Product {
  static async findAll(activeOnly = true) {
    const query = activeOnly 
      ? 'SELECT * FROM products WHERE is_active = true ORDER BY name'
      : 'SELECT * FROM products ORDER BY name';
      
    const result = await pool.query(query);
    return result.rows;
  }
  
  static async findById(id) {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  }
  
  static async create(productData) {
    const result = await pool.query(
      `INSERT INTO products (name, sku, description, category, unit_price, reorder_level)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [productData.name, productData.sku, productData.description, 
       productData.category, productData.unit_price, productData.reorder_level]
    );
    return result.rows[0];
  }
  
  static async update(id, productData) {
    const result = await pool.query(
      `UPDATE products 
       SET name = $1, sku = $2, description = $3, category = $4, 
           unit_price = $5, reorder_level = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [productData.name, productData.sku, productData.description,
       productData.category, productData.unit_price, productData.reorder_level, id]
    );
    return result.rows[0];
  }
  
  static async delete(id) {
    const result = await pool.query(
      'UPDATE products SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Product;
