import { motion } from 'framer-motion';
import { PlusIcon, TruckIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function ReceiptsHeader({ onCreateClick, receipts = [] }) {
  // Calculate stats from real data
  const today = new Date().toISOString().split('T')[0];
  
  // Get start of week (Sunday)
  const getStartOfWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day;
    const startOfWeek = new Date(now.setDate(diff));
    return startOfWeek.toISOString().split('T')[0];
  };

  const startOfWeek = getStartOfWeek();

  // Calculate today's receipts
  const todaysReceipts = receipts.filter(r => {
    const receiptDate = r.date || r.expectedDate || '';
    return receiptDate.startsWith(today);
  }).length;

  // Calculate pending validation (waiting or draft status)
  const pendingValidation = receipts.filter(r => 
    r.status === 'waiting' || r.status === 'draft'
  ).length;

  // Calculate validated today
  const validatedToday = receipts.filter(r => {
    const receiptDate = r.date || r.expectedDate || '';
    return receiptDate.startsWith(today) && r.status === 'validated';
  }).length;

  // Calculate total this week
  const totalThisWeek = receipts.filter(r => {
    const receiptDate = r.date || r.expectedDate || '';
    return receiptDate >= startOfWeek;
  }).length;

  const stats = [
    { label: "Today's Receipts", value: todaysReceipts, icon: DocumentTextIcon, color: 'blue' },
    { label: 'Pending Validation', value: pendingValidation, icon: ClockIcon, color: 'yellow' },
    { label: 'Validated Today', value: validatedToday, icon: CheckCircleIcon, color: 'green' },
    { label: 'Total This Week', value: totalThisWeek, icon: TruckIcon, color: 'purple' }
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Receipts</h1>
          <p className="text-gray-600 mt-1">Manage incoming stock and deliveries</p>
        </div>
        
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          <span className="font-medium">New Receipt</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200'
  };

  const iconColors = {
    blue: 'bg-blue-600',
    yellow: 'bg-yellow-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg p-5 border ${colors[color]} transition-all hover:shadow-md`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${iconColors[color]}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}
