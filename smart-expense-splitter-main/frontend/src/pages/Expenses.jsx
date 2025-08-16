import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  CalendarIcon,
  UserIcon,
  TagIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { expenseAPI, groupAPI } from '../services/api';
import AddExpenseModal from '../components/expenses/AddExpenseModal';

const ExpenseCard = ({ expense, delay, onDelete, currentUserId }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start flex-1">
          <div className="flex-shrink-0">
            <div className="w-14 h-14 bg-green-600 rounded-xl flex items-center justify-center">
              <BanknotesIcon className="h-7 w-7 text-white" />
            </div>
          </div>
          <div className="ml-5 flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">{expense.title}</h3>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>Paid by {expense.paidBy?.username}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>{new Date(expense.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
                <span>{expense.group?.groupName}</span>
              </div>

              {/* Show participants */}
              {expense.participants && expense.participants.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Participants:</p>
                  <div className="flex flex-wrap gap-2">
                    {expense.participants.map((participant, index) => (
                      <div
                        key={participant.id}
                        className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                      >
                        <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                          <span className="text-white text-xs font-medium">
                            {participant.user?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-700">
                          {participant.user?.username}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          (₹{participant.shareAmount?.toFixed(2) || '0.00'})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-right flex items-center space-x-3 ml-4">
          <div>
            <p className="text-xl font-bold text-gray-900">
              ₹{expense.amount.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              Total Amount
            </p>
          </div>

          {/* Show delete button only if current user is the one who paid */}
          {expense.paidBy?.id === currentUserId && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(expense.id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete expense"
            >
              <TrashIcon className="h-5 w-5" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Expenses = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState('all'); // all, paid, owe

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesResponse, groupsResponse] = await Promise.all([
        expenseAPI.getUserExpenses(user.id),
        groupAPI.getUserGroups(user.id)
      ]);
      console.log('Expenses data:', expensesResponse.data);
      console.log('Groups data for expenses:', groupsResponse.data);

      // Ensure expenses is always an array
      const expensesData = Array.isArray(expensesResponse.data) ? expensesResponse.data : [];
      const groupsData = Array.isArray(groupsResponse.data) ? groupsResponse.data : [];

      setExpenses(expensesData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await expenseAPI.addExpense(
        expenseData.groupId,
        user.id,
        {
          expense: {
            title: expenseData.description, // Backend expects 'title' field
            amount: expenseData.amount,
            category: expenseData.category,
            expenseDate: expenseData.expenseDate,
          },
          participantIds: expenseData.participantIds,
        }
      );
      fetchData(); // Refresh the list
      setShowAddModal(false);
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      try {
        await expenseAPI.deleteExpense(expenseId);
        fetchData(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'paid') {
      // Show expenses paid by the current user
      return expense.paidBy?.id === user.id;
    }
    if (filter === 'owe') {
      // Show expenses where current user is a participant but didn't pay
      return expense.paidBy?.id !== user.id &&
             expense.participants?.some(participant => participant.user?.id === user.id);
    }
    return true; // Show all expenses
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="section-header">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="section-title">Expenses</h1>
            <p className="section-subtitle">
              Track and manage your shared expenses
            </p>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary w-full sm:w-auto"
            disabled={groups.length === 0}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Expense
          </motion.button>
        </div>
      </div>

      {/* Filter tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6"
      >
        {[
          { key: 'all', label: 'All Expenses' },
          { key: 'paid', label: 'Paid by Me' },
          { key: 'owe', label: 'I Owe' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              filter === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Expenses list */}
      {filteredExpenses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card text-center py-12"
        >
          <CurrencyDollarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {filter === 'all' ? 'No expenses yet' : 
             filter === 'paid' ? 'No expenses paid by you' : 
             'No expenses you owe'}
          </h3>
          <p className="mt-2 text-gray-500">
            {groups.length === 0 
              ? 'Create a group first to start adding expenses'
              : 'Get started by adding your first expense'
            }
          </p>
          {groups.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="btn-primary mt-4 inline-flex items-center px-4 py-2"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Your First Expense
            </motion.button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((expense, index) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              delay={index * 0.1}
              onDelete={handleDeleteExpense}
              currentUserId={user.id}
            />
          ))}
        </div>
      )}

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddExpense}
        groups={groups}
      />
    </div>
  );
};

export default Expenses;
