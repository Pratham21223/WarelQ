// components/delivery/AnalyticsSidebar.jsx
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { motion } from 'framer-motion';

Chart.register(...registerables);

export default function AnalyticsSidebar({ deliveries = [] }) {
  const completionChartRef = useRef(null);
  const volumeChartRef = useRef(null);
  const completionChartInstance = useRef(null);
  const volumeChartInstance = useRef(null);

  useEffect(() => {
    if (completionChartRef.current) {
      createCompletionChart();
    }
    if (volumeChartRef.current) {
      createVolumeChart();
    }

    return () => {
      if (completionChartInstance.current) {
        completionChartInstance.current.destroy();
      }
      if (volumeChartInstance.current) {
        volumeChartInstance.current.destroy();
      }
    };
  }, [deliveries]);

  const createCompletionChart = () => {
    const ctx = completionChartRef.current.getContext('2d');
    
    if (completionChartInstance.current) {
      completionChartInstance.current.destroy();
    }

    const completed = deliveries.filter(d => d.status === 'delivered').length;
    const total = deliveries.length || 1;
    const percentage = (completed / total) * 100;

    completionChartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [{
          data: [completed, total - completed],
          backgroundColor: ['#10b981', '#e5e7eb'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.label}: ${context.parsed}`;
              }
            }
          }
        }
      }
    });
  };

  const createVolumeChart = () => {
    const ctx = volumeChartRef.current.getContext('2d');
    
    if (volumeChartInstance.current) {
      volumeChartInstance.current.destroy();
    }

    // Mock data for last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const volumeData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 20) + 5);

    volumeChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: last7Days,
        datasets: [{
          label: 'Deliveries',
          data: volumeData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f3f4f6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
  };

  const stats = calculateAnalytics(deliveries);

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="w-80 bg-gray-50 border-l border-gray-200 p-6 overflow-y-auto hidden lg:block"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-6">Analytics</h2>

      {/* On-Time Delivery Rate */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700">On-Time Delivery</h3>
          <span className="text-2xl font-bold text-green-600">{stats.onTimeRate}%</span>
        </div>
        <div className="relative h-40">
          <canvas ref={completionChartRef}></canvas>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
              <div className="text-xs text-gray-500">of {stats.total}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Volume Trend */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Last 7 Days</h3>
        <div className="relative h-48">
          <canvas ref={volumeChartRef}></canvas>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500">Avg. Delivery Time</div>
          <div className="text-xl font-bold text-gray-900">2.3 days</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500">Active Deliveries</div>
          <div className="text-xl font-bold text-blue-600">{stats.active}</div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="text-xs text-gray-500">This Month</div>
          <div className="text-xl font-bold text-purple-600">{stats.thisMonth}</div>
        </div>
      </div>
    </motion.div>
  );
}

function calculateAnalytics(deliveries) {
  const completed = deliveries.filter(d => d.status === 'delivered').length;
  const total = deliveries.length || 1;
  const active = deliveries.filter(d => 
    d.status === 'waiting' || d.status === 'dispatched'
  ).length;

  return {
    total,
    completed,
    active,
    onTimeRate: Math.round((completed / total) * 100) || 0,
    thisMonth: Math.floor(Math.random() * 100) + 50
  };
}

