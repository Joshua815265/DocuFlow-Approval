import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { userAPI, groupAPI } from '../../services/api';

const AddMemberModal = ({ isOpen, onClose, group, onMemberAdded }) => {
  const [emailInput, setEmailInput] = useState('');
  const [emailList, setEmailList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Add email to the list when Enter is pressed or comma is typed
  const handleEmailInput = (e) => {
    const value = e.target.value;

    if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
      e.preventDefault();
      addEmailToList();
    } else {
      setEmailInput(value);
    }
  };

  const addEmailToList = () => {
    const email = emailInput.trim().replace(/[,\s]+$/, ''); // Remove trailing commas/spaces

    if (email && isValidEmail(email)) {
      if (!emailList.includes(email)) {
        setEmailList(prev => [...prev, email]);
        setEmailInput('');
        setError('');
      } else {
        setError('This email is already added');
      }
    } else if (email) {
      setError('Please enter a valid email address');
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const removeEmail = (emailToRemove) => {
    setEmailList(prev => prev.filter(email => email !== emailToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add current input to list if it's valid
    if (emailInput.trim()) {
      addEmailToList();
    }

    if (emailList.length === 0) {
      setError('Please add at least one email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Add each email to the group by finding users by email
      const results = await Promise.all(
        emailList.map(async (email) => {
          try {
            console.log(`Attempting to find user with email: ${email}`);

            // First find the user by email
            const userResponse = await userAPI.getUserByEmail(email);
            console.log(`User found:`, userResponse.data);
            const user = userResponse.data;

            // Then add the user to the group
            console.log(`Adding user ${user.id} to group ${group.id}`);
            await groupAPI.addUserToGroup(group.id, user.id);
            console.log(`Successfully added ${email} to group`);

            return { email, success: true };
          } catch (error) {
            console.error(`Failed to add ${email}:`, error);

            let errorMessage = 'Unknown error';
            if (error.response?.status === 404) {
              errorMessage = 'User not found - they may need to register first';
            } else if (error.response?.status === 400) {
              errorMessage = error.response.data || 'User may already be in the group';
            } else if (error.response?.data) {
              errorMessage = error.response.data;
            } else {
              errorMessage = error.message;
            }

            return { email, success: false, error: errorMessage };
          }
        })
      );

      console.log('Results:', results);

      // Check results
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);

      if (successful.length > 0) {
        onMemberAdded(); // Refresh the groups list

        if (failed.length === 0) {
          handleClose(); // Close modal if all successful
        } else {
          // Show detailed error message
          const failedDetails = failed.map(f => `${f.email} (${f.error})`).join(', ');
          setError(`Added ${successful.length} members successfully. Failed to add: ${failedDetails}`);
          // Remove successful emails from the list
          setEmailList(failed.map(f => f.email));
        }
      } else {
        // Show detailed error for all failures
        const failedDetails = failed.map(f => `${f.email}: ${f.error}`).join('\n');
        setError(`Failed to add any members:\n${failedDetails}`);
      }
    } catch (error) {
      console.error('Failed to add members:', error);
      setError('Failed to add members. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmailInput('');
    setEmailList([]);
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
                  Add Members to {group?.groupName}
                </h3>
                <button
                  onClick={handleClose}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Email Input */}
              <div className="mb-4">
                <label className="label text-gray-700 mb-2">
                  Add members by email address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter email address and press Enter or comma..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={handleEmailInput}
                    onBlur={addEmailToList}
                    className="input"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Type email addresses and press Enter, comma, or space to add them
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Note: Users must be registered in the system before they can be added to groups
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email List */}
                {emailList.length > 0 && (
                  <div>
                    <label className="label text-gray-700 mb-2">
                      Members to add ({emailList.length})
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-md max-h-32 overflow-y-auto">
                      {emailList.map((email, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-md"
                  >
                    <p className="text-sm text-red-600 whitespace-pre-line">{error}</p>
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
                    disabled={isLoading || (emailList.length === 0 && !emailInput.trim())}
                    className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </div>
                    ) : (
                      `Add ${emailList.length + (emailInput.trim() ? 1 : 0)} Member${(emailList.length + (emailInput.trim() ? 1 : 0)) !== 1 ? 's' : ''}`
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

export default AddMemberModal;
