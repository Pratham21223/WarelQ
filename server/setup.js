const fs = require('fs');
const path = require('path');

// Define the project structure
const structure = {
  'routes': [
    'auth.routes.js',
    'products.routes.js',
    'receipts.routes.js',
    'deliveries.routes.js',
    'transfers.routes.js',
    'reports.routes.js'
  ],
  'controllers': [
    'authController.js',
    'productController.js',
    'inventoryController.js'
  ],
  'models': [
    'User.js',
    'Product.js',
    'Receipt.js',
    'StockMovement.js'
  ],
  'middleware': [
    'auth.middleware.js',
    'validation.middleware.js'
  ],
  'services': [
    'emailService.js',
    'predictionService.js'
  ],
  'socket': [
    'socketHandler.js'
  ],
  'config': [
    'database.js'
  ]
};

// Create directories and files
Object.keys(structure).forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created directory: ${dir}/`);
  }
  
  // Create empty files in each directory
  structure[dir].forEach(file => {
    const filePath = path.join(dirPath, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '');
      console.log(`✅ Created file: ${dir}/${file}`);
    }
  });
});

// Create server.js in root
const serverPath = path.join(__dirname, 'server.js');
if (!fs.existsSync(serverPath)) {
  fs.writeFileSync(serverPath, '');
  console.log('✅ Created file: server.js');
}

console.log('\n🎉 Project structure created successfully!');
