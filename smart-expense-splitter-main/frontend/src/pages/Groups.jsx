import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  UserGroupIcon,
  UsersIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { groupAPI } from '../services/api';
import CreateGroupModal from '../components/groups/CreateGroupModal';
import AddMemberModal from '../components/groups/AddMemberModal';
import ViewMembersModal from '../components/groups/ViewMembersModal';

const GroupCard = ({ group, onEdit, onDelete, onAddMembers, onViewMembers, delay }) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="card-hover relative"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{group.groupName}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <UsersIcon className="h-4 w-4 mr-1" />
              <span>{group.members?.length || 0} members</span>
              <CalendarIcon className="h-4 w-4 ml-4 mr-1" />
              <span>Created {new Date(group.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
          </button>
          
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200"
              >
                <div className="py-1">
                  <button
                    onClick={() => {
                      onViewMembers(group);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    View Members
                  </button>
                  <button
                    onClick={() => {
                      onAddMembers(group);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Add Members
                  </button>
                  <button
                    onClick={() => {
                      onEdit(group);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Group
                  </button>
                  <button
                    onClick={() => {
                      onDelete(group);
                      setShowMenu(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Delete Group
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Created by {group.createdBy?.username}
        </p>
      </div>
    </motion.div>
  );
};

const Groups = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showViewMembersModal, setShowViewMembersModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      console.log('Fetching groups for user:', user.id);
      const response = await groupAPI.getUserGroups(user.id);
      console.log('Groups response:', response.data);
      setGroups(response.data);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (groupData) => {
    try {
      await groupAPI.createGroup(groupData, user.id);
      fetchGroups(); // Refresh the list
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create group:', error);
    }
  };

  const handleViewMembers = (group) => {
    setSelectedGroup(group);
    setShowViewMembersModal(true);
  };

  const handleAddMembers = (group) => {
    setSelectedGroup(group);
    setShowAddMemberModal(true);
  };

  const handleEditGroup = (group) => {
    console.log('Edit group:', group);
    // TODO: Implement edit functionality
  };

  const handleDeleteGroup = (group) => {
    console.log('Delete group:', group);
    // TODO: Implement delete functionality
  };

  const handleMemberAdded = () => {
    fetchGroups(); // Refresh the groups list to show updated member count
    setShowAddMemberModal(false);
    setSelectedGroup(null);
  };

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <p className="mt-2 text-gray-600">
            Manage your expense groups and members
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center px-4 py-2"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Group
        </motion.button>
      </motion.div>

      {/* Groups grid */}
      {groups.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card text-center py-12"
        >
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No groups yet</h3>
          <p className="mt-2 text-gray-500">
            Get started by creating your first expense group
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="btn-primary mt-4 inline-flex items-center px-4 py-2"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Your First Group
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group, index) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEditGroup}
              onDelete={handleDeleteGroup}
              onAddMembers={handleAddMembers}
              onViewMembers={handleViewMembers}
              delay={index * 0.1}
            />
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateGroup}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={() => {
          setShowAddMemberModal(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
        onMemberAdded={handleMemberAdded}
      />

      {/* View Members Modal */}
      <ViewMembersModal
        isOpen={showViewMembersModal}
        onClose={() => {
          setShowViewMembersModal(false);
          setSelectedGroup(null);
        }}
        group={selectedGroup}
      />
    </div>
  );
};

export default Groups;
