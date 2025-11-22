export default function Login({ onLogin }) {
  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">StockMaster Pro</h1>
          <p className="text-gray-600">Inventory Management System</p>
        </div>
        
        <button
          onClick={onLogin}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          Login (Demo Mode)
        </button>
      </div>
    </div>
  );
}
