import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { groupAPI, expenseAPI, settlementAPI } from '../services/api';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    className="card-stats"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-base font-medium text-gray-600 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
    </div>
  </motion.div>
);

const QuickActionCard = ({ title, description, icon: Icon, onClick, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="card-hover cursor-pointer"
    onClick={onClick}
  >
    <div className="text-center">
      <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalExpenses: 0,
    totalAmount: 0,
    pendingSettlements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's groups
      const groupsResponse = await groupAPI.getUserGroups(user.id);
      const groups = groupsResponse.data;
      
      // Fetch user's expenses
      const expensesResponse = await expenseAPI.getUserExpenses(user.id);
      const expenses = expensesResponse.data;
      
      // Fetch user's settlements
      const settlementsResponse = await settlementAPI.getUserSettlements(user.id);
      const settlements = settlementsResponse.data;
      
      // Calculate total amount
      const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      
      setStats({
        totalGroups: groups.length,
        totalExpenses: expenses.length,
        totalAmount: totalAmount,
        pendingSettlements: settlements.length,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create Group',
      description: 'Start a new expense group',
      icon: UserGroupIcon,
      color: 'bg-primary-600',
      onClick: () => navigate('/groups'),
    },
    {
      title: 'Add Expense',
      description: 'Record a new expense',
      icon: PlusIcon,
      color: 'bg-green-600',
      onClick: () => navigate('/expenses'),
    },
    {
      title: 'View Settlements',
      description: 'Check pending settlements',
      icon: ChartBarIcon,
      color: 'bg-purple-600',
      onClick: () => navigate('/settlements'),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="section-header">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="section-title">Dashboard</h1>
          <p className="section-subtitle">
            Overview of your expenses and groups
          </p>
        </motion.div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard
          title="Total Groups"
          value={stats.totalGroups}
          icon={UserGroupIcon}
          color="bg-blue-600"
          delay={0.1}
        />
        <StatCard
          title="Total Expenses"
          value={stats.totalExpenses}
          icon={CurrencyDollarIcon}
          color="bg-green-600"
          delay={0.2}
        />
        <StatCard
          title="Total Amount"
          value={`₹${stats.totalAmount.toFixed(2)}`}
          icon={ChartBarIcon}
          color="bg-purple-600"
          delay={0.3}
        />
        <StatCard
          title="Pending Settlements"
          value={stats.pendingSettlements}
          icon={ChartBarIcon}
          color="bg-red-600"
          delay={0.4}
        />
      </div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quickActions.map((action, index) => (
            <QuickActionCard
              key={action.title}
              {...action}
              delay={0.6 + index * 0.1}
            />
          ))}
        </div>
      </motion.div>

      {/* Recent activity placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">No recent activity to show</p>
          <p className="text-sm text-gray-400 mt-2">
            Start by creating a group or adding an expense
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
