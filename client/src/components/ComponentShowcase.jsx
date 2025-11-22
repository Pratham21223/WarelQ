// src/components/ComponentShowcase.jsx
import { useState } from 'react';
import KPICard from './dashboard/KPICard';
import Badge from './shared/Badge';
import { CubeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ComponentShowcase = () => {
  const [activeTab, setActiveTab] = useState('kpi');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Component Library
        </h1>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'kpi'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            KPI Cards
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'badges'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Badges
          </button>
        </div>

        {/* KPI Cards Section */}
        {activeTab === 'kpi' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                KPI Cards
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard
                  title="Total Stock"
                  value="45,231"
                  change="+12%"
                  trend="up"
                  icon={<CubeIcon className="w-8 h-8" />}
                  color="blue"
                />
                <KPICard
                  title="Low Stock"
                  value="23"
                  change="-5%"
                  trend="down"
                  icon={<ExclamationTriangleIcon className="w-8 h-8" />}
                  color="orange"
                />
              </div>
            </div>
          </div>
        )}

        {/* Badges Section */}
        {activeTab === 'badges' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Badge Variants
              </h2>
              <div className="flex flex-wrap gap-4">
                <Badge variant="blue">Blue Badge</Badge>
                <Badge variant="green">Green Badge</Badge>
                <Badge variant="yellow">Yellow Badge</Badge>
                <Badge variant="purple">Purple Badge</Badge>
                <Badge variant="gray">Gray Badge</Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentShowcase;
