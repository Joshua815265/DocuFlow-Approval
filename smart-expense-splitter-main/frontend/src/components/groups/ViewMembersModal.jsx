import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserIcon } from '@heroicons/react/24/outline';
import { groupAPI } from '../../services/api';

const ViewMembersModal = ({ isOpen, onClose, group }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && group) {
      fetchGroupMembers();
    }
  }, [isOpen, group]);

  const fetchGroupMembers = async () => {
    try {
      setLoading(true);
      const response = await groupAPI.getGroupById(group.id);
      const groupDetails = response.data;
      setMembers(groupDetails.members || []);
    } catch (error) {
      console.error('Failed to fetch group members:', error);
      setError('Failed to load group members. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
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
                  Members of {group?.groupName}
                </h3>
                <button
                  onClick={handleClose}
                  className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  </div>
                ) : error ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                ) : members.length === 0 ? (
                  <div className="text-center py-8">
                    <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No members yet</h3>
                    <p className="mt-2 text-gray-500">
                      This group doesn't have any members yet.
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      {members.length} member{members.length !== 1 ? 's' : ''} in this group
                    </p>
                    <div className="space-y-3">
                      {members.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-primary-600" />
                            </div>
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {member.user?.username || member.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {member.user?.email || member.email}
                            </div>
                          </div>
                          {member.user?.id === group?.createdBy?.id && (
                            <div className="flex-shrink-0">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                Admin
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleClose}
                    className="btn-primary px-4 py-2"
                  >
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewMembersModal;
