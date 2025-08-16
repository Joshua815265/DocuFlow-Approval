import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChartBarIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { settlementAPI, groupAPI } from '../services/api';

const SettlementCard = ({ settlement, delay, onSettle, currentUserId }) => {
  // If current user is the toUser, they are owed money
  // If current user is the fromUser, they owe money
  const isOwed = settlement.toUser?.id === currentUserId;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`card-hover border-l-4 ${
        isOwed ? 'border-green-500' : 'border-red-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-lg ${
            isOwed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {isOwed ? (
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            ) : (
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            )}
          </div>
          <div className="ml-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {settlement.fromUser?.username}
              </span>
              <ArrowRightIcon className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-900">
                {settlement.toUser?.username}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {settlement.group?.groupName}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <p className={`text-lg font-semibold ${
            isOwed ? 'text-green-600' : 'text-red-600'
          }`}>
            ₹{Math.abs(settlement.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {isOwed ? 'You are owed' : 'You owe'}
          </p>
        </div>
      </div>
      
      {!isOwed && (
        <div className="mt-4 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSettle(settlement)}
            className="btn-primary text-sm px-3 py-1"
          >
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Mark as Settled
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

const GroupSettlementCard = ({ group, settlements, delay, currentUserId }) => {
  // Calculate amounts based on current user's perspective
  const totalOwed = settlements
    .filter(s => s.fromUser?.id === currentUserId)
    .reduce((sum, s) => sum + Math.abs(s.amount), 0);

  const totalToReceive = settlements
    .filter(s => s.toUser?.id === currentUserId)
    .reduce((sum, s) => sum + Math.abs(s.amount), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{group.groupName}</h3>
        <span className="text-sm text-gray-500">
          {settlements.length} settlement{settlements.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <p className="text-sm text-gray-600">You Owe</p>
          <p className="text-xl font-semibold text-red-600">
            ₹{totalOwed.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-gray-600">You're Owed</p>
          <p className="text-xl font-semibold text-green-600">
            ₹{totalToReceive.toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        {settlements.map((settlement, index) => (
          <div key={settlement.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <span className="text-sm text-gray-600">
                {settlement.fromUser?.username}
              </span>
              <ArrowRightIcon className="h-3 w-3 mx-2 text-gray-400" />
              <span className="text-sm text-gray-600">
                {settlement.toUser?.username}
              </span>
            </div>
            <span className={`text-sm font-medium ${
              settlement.toUser?.id === currentUserId ? 'text-green-600' : 'text-red-600'
            }`}>
              ₹{Math.abs(settlement.amount).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const Settlements = () => {
  const { user } = useAuth();
  const [settlements, setSettlements] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('individual'); // individual, grouped

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settlementsResponse, groupsResponse] = await Promise.all([
        settlementAPI.getUserSettlements(user.id),
        groupAPI.getUserGroups(user.id)
      ]);
      setSettlements(settlementsResponse.data);
      setGroups(groupsResponse.data);
    } catch (error) {
      console.error('Failed to fetch settlements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettle = (settlement) => {
    // TODO: Implement settlement marking
    console.log('Mark as settled:', settlement);
  };

  const groupedSettlements = groups.map(group => ({
    group,
    settlements: settlements.filter(s => s.group?.id === group.id)
  })).filter(item => item.settlements.length > 0);

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
          <h1 className="text-3xl font-bold text-gray-900">Settlements</h1>
          <p className="mt-2 text-gray-600">
            Track who owes what and settle up
          </p>
        </div>
      </motion.div>

      {/* View toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit"
      >
        {[
          { key: 'individual', label: 'Individual View' },
          { key: 'grouped', label: 'Group View' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              view === tab.key
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      {settlements.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card text-center py-12"
        >
          <CheckCircleIcon className="mx-auto h-12 w-12 text-green-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">All settled up!</h3>
          <p className="mt-2 text-gray-500">
            You don't have any pending settlements
          </p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {view === 'individual' ? (
            settlements.map((settlement, index) => (
              <SettlementCard
                key={settlement.id}
                settlement={settlement}
                delay={index * 0.1}
                onSettle={handleSettle}
                currentUserId={user.id}
              />
            ))
          ) : (
            groupedSettlements.map((item, index) => (
              <GroupSettlementCard
                key={item.group.id}
                group={item.group}
                settlements={item.settlements}
                delay={index * 0.1}
                currentUserId={user.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Settlements;
