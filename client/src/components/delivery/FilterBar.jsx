// components/delivery/FilterBar.jsx
import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 sticky top-0 z-40">
      <div className="flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by reference or order number..."
              value={filters.search}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="waiting">Waiting</option>
          <option value="dispatched">Dispatched</option>
          <option value="delivered">Delivered</option>
        </select>

        {/* Warehouse Filter */}
        <select
          value={filters.warehouse}
          onChange={(e) => onFilterChange({ warehouse: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">All Warehouses</option>
          <option value="wh-1">Warehouse 1</option>
          <option value="wh-2">Warehouse 2</option>
          <option value="wh-3">Warehouse 3</option>
        </select>

        {/* Date Range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateRange.start || ''}
            onChange={(e) => onFilterChange({ 
              dateRange: { ...filters.dateRange, start: e.target.value }
            })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
          <span className="text-gray-500">to</span>
          <input
            type="date"
            value={filters.dateRange.end || ''}
            onChange={(e) => onFilterChange({ 
              dateRange: { ...filters.dateRange, end: e.target.value }
            })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          />
        </div>

        {/* Customer Search */}
        <input
          type="text"
          placeholder="Customer name..."
          value={filters.customer}
          onChange={(e) => onFilterChange({ customer: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>
    </div>
  );
}
