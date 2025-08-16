import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { groupAPI } from '../../services/api';

const AddExpenseModal = ({ isOpen, onClose, onSubmit, groups }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    groupId: '',
    expenseDate: new Date().toISOString().split('T')[0],
    participantIds: [],
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Travel',
    'Healthcare',
    'Other',
  ];

  useEffect(() => {
    if (formData.groupId) {
      fetchGroupMembers();
    }
  }, [formData.groupId]);

  const fetchGroupMembers = async () => {
    try {
      setLoadingMembers(true);
      console.log('Fetching members for group:', formData.groupId);
      const response = await groupAPI.getGroupById(formData.groupId);
      const group = response.data;

      console.log('Group data received:', group);
      console.log('Group members:', group?.members);

      if (group && group.members && group.members.length > 0) {
        // Handle different member data formats
        const members = group.members.map(member => {
          console.log('Processing member:', member);
          // If member has a user property, use it; otherwise use member directly
          const userData = member.user || member;
          console.log('User data:', userData);
          return userData;
        });

        console.log('Processed members:', members);
        setGroupMembers(members);

        // Auto-select all members
        setFormData(prev => ({
          ...prev,
          participantIds: members.map(member => member.id)
        }));
      } else {
        console.log('No members found in group');
        setGroupMembers([]);
        setError('This group has no members. Please add members to the group first.');
      }
    } catch (error) {
      console.error('Failed to fetch group members:', error);
      setError('Failed to load group members. Please try again.');
      setGroupMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'participantIds') {
        const participantId = parseInt(value);
        setFormData(prev => ({
          ...prev,
          participantIds: checked
            ? [...prev.participantIds, participantId]
            : prev.participantIds.filter(id => id !== participantId)
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Amount must be greater than 0');
      return false;
    }
    if (!formData.groupId) {
      setError('Please select a group');
      return false;
    }
    if (formData.participantIds.length === 0) {
      setError('Please select at least one participant');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');

    try {
      await onSubmit({
        ...formData,
        title: formData.description, // Backend expects 'title' field
        amount: parseFloat(formData.amount),
        groupId: parseInt(formData.groupId),
      });
      setFormData({
        description: '',
        amount: '',
        category: '',
        groupId: '',
        expenseDate: new Date().toISOString().split('T')[0],
        participantIds: [],
      });
      setGroupMembers([]);
    } catch (error) {
      setError('Failed to add expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      description: '',
      amount: '',
      category: '',
      groupId: '',
      expenseDate: new Date().toISOString().split('T')[0],
      participantIds: [],
    });
    setGroupMembers([]);
    setLoadingMembers(false);
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Expense
                </h3>
                <button
                  onClick={handleClose}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="description" className="label text-gray-700">
                    Description *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    type="text"
                    id="description"
                    name="description"
                    required
                    className="input mt-1"
                    placeholder="What was this expense for?"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="amount" className="label text-gray-700">
                      Amount *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      type="number"
                      id="amount"
                      name="amount"
                      step="0.01"
                      min="0"
                      required
                      className="input mt-1"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="expenseDate" className="label text-gray-700">
                      Date *
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      type="date"
                      id="expenseDate"
                      name="expenseDate"
                      required
                      className="input mt-1"
                      value={formData.expenseDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="label text-gray-700">
                      Category
                    </label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      id="category"
                      name="category"
                      className="input mt-1"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </motion.select>
                  </div>

                  <div>
                    <label htmlFor="groupId" className="label text-gray-700">
                      Group *
                    </label>
                    <motion.select
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      id="groupId"
                      name="groupId"
                      required
                      className="input mt-1"
                      value={formData.groupId}
                      onChange={handleChange}
                    >
                      <option value="">Select group</option>
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.groupName}
                        </option>
                      ))}
                    </motion.select>
                  </div>
                </div>

                {formData.groupId && (
                  <div>
                    <label className="label text-gray-700">
                      Split with *
                    </label>
                    {loadingMembers ? (
                      <div className="mt-2 flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        <span className="ml-2 text-sm text-gray-600">Loading group members...</span>
                      </div>
                    ) : groupMembers.length > 0 ? (
                      <div className="mt-2 space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
                        {groupMembers.map((member) => (
                          <label key={member.id} className="flex items-center">
                            <input
                              type="checkbox"
                              name="participantIds"
                              value={member.id}
                              checked={formData.participantIds.includes(member.id)}
                              onChange={handleChange}
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">
                              {member.username || member.email}
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : formData.groupId ? (
                      <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-700">
                          No members found in this group. Please add members to the group first.
                        </p>
                      </div>
                    ) : null}
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-md"
                  >
                    <p className="text-sm text-red-600">{error}</p>
                  </motion.div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleClose}
                    className="btn-outline px-4 py-2"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </div>
                    ) : (
                      'Add Expense'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddExpenseModal;
