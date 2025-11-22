// src/components/Dashboard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from './layout/MainLayout';
import KPICard from './dashboard/KPICard';
import StockLineChart from './dashboard/StockLineChart';
import ProductBarChart from './dashboard/ProductBarChart';
import CategoryPieChart from './dashboard/CategoryPieChart';
import ActivityTable from './dashboard/ActivityTable';
import FloatingActionButton from './dashboard/FloatingActionButton';
import { CubeIcon, ExclamationTriangleIcon, InboxArrowDownIcon, TruckIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [kpiData] = useState({
    totalStock: { value: '45,231', change: '+12%', trend: 'up' },
    lowStock: { value: '23', change: '-5%', trend: 'down' },
    pendingReceipts: { value: '156', change: '+8%', trend: 'up' },
    pendingDeliveries: { value: '89', change: '+15%', trend: 'up' }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div variants={itemVariants}>
            <KPICard title="Total Stock" value={kpiData.totalStock.value} change={kpiData.totalStock.change} trend={kpiData.totalStock.trend} icon={<CubeIcon className="w-8 h-8" />} color="blue" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KPICard title="Low Stock Alerts" value={kpiData.lowStock.value} change={kpiData.lowStock.change} trend={kpiData.lowStock.trend} icon={<ExclamationTriangleIcon className="w-8 h-8" />} color="orange" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KPICard title="Pending Receipts" value={kpiData.pendingReceipts.value} change={kpiData.pendingReceipts.change} trend={kpiData.pendingReceipts.trend} icon={<InboxArrowDownIcon className="w-8 h-8" />} color="green" />
          </motion.div>
          <motion.div variants={itemVariants}>
            <KPICard title="Pending Deliveries" value={kpiData.pendingDeliveries.value} change={kpiData.pendingDeliveries.change} trend={kpiData.pendingDeliveries.trend} icon={<TruckIcon className="w-8 h-8" />} color="purple" />
          </motion.div>
        </motion.div>

        {/* Charts */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}><StockLineChart /></motion.div>
          <motion.div variants={itemVariants}><ProductBarChart /></motion.div>
          <motion.div variants={itemVariants} className="lg:col-span-2"><CategoryPieChart /></motion.div>
        </motion.div>

        {/* Activity Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <ActivityTable />
        </motion.div>
      </div>

      <FloatingActionButton />
    </MainLayout>
  );
};

export default Dashboard;

