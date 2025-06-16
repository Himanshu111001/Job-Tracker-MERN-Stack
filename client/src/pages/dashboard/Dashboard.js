import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../redux/jobs/jobSlice';
import { getNotifications } from '../../redux/notifications/notificationSlice';
import { ChartBarIcon, BriefcaseIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { formatDate, formatDateFromNow, getStatusColor } from '../../utils/formatters';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { 
    totalJobs, 
    statusCounts, 
    loading 
  } = useSelector((state) => state.jobs);
  const { notifications } = useSelector((state) => state.notifications);
  
  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getNotifications());
  }, [dispatch]);

  // Prepare data for status chart
  const statusLabels = ['Applied', 'Interview', 'Offer', 'Rejected', 'Accepted'];
  const statusData = statusLabels.map(status => statusCounts[status] || 0);
  const totalApplications = statusData.reduce((acc, count) => acc + count, 0);

  // Filter recent notifications
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Welcome section */}
        <div className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 mt-6">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Welcome back, {user?.name || 'User'}!
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Here's an overview of your job applications
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Applications Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BriefcaseIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Applications
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {loading ? '...' : totalApplications || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Applications in Process */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-yellow-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        In Process
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {loading ? '...' : (
                            (statusCounts['Applied'] || 0) + (statusCounts['Interview'] || 0)
                          )}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Offers */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Offers
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {loading ? '...' : statusCounts['Offer'] || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <XCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Rejected
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {loading ? '...' : statusCounts['Rejected'] || 0}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Chart and Recent Activity */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-12">
          {/* Status Chart */}
          <div className="sm:col-span-7 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Application Status Overview
            </h3>
            <div className="flex flex-col space-y-4">
              {statusLabels.map((status, index) => (
                <div key={status} className="flex items-center">
                  <div className="w-32 text-sm text-gray-600">{status}</div>
                  <div className="relative flex-1">
                    <div className="h-4 bg-gray-200 rounded">
                      <div 
                        className={`h-4 rounded ${getStatusColor(status).replace('bg-', 'bg-').replace('text-', '')}`}
                        style={{
                          width: `${totalApplications ? (statusCounts[status] || 0) / totalApplications * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-10 text-right text-sm text-gray-600 ml-3">
                    {statusCounts[status] || 0}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Link 
                to="/dashboard/jobs"
                className="text-sm text-primary-600 hover:text-primary-900"
              >
                View all applications
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="sm:col-span-5 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="flow-root">
              <ul className="-mb-8">
                {recentNotifications.length > 0 ? (
                  recentNotifications.map((notification, index) => (
                    <li key={notification._id}>
                      <div className="relative pb-8">
                        {index !== recentNotifications.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          ></span>
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                              notification.type === 'status_change' ? 'bg-blue-500' :
                              notification.type === 'new_job' ? 'bg-green-500' : 'bg-gray-500'
                            }`}>
                              {notification.type === 'status_change' && (
                                <ChartBarIcon className="h-5 w-5 text-white" aria-hidden="true" />
                              )}
                              {notification.type === 'new_job' && (
                                <BriefcaseIcon className="h-5 w-5 text-white" aria-hidden="true" />
                              )}
                              {notification.type !== 'status_change' && notification.type !== 'new_job' && (
                                <ClockIcon className="h-5 w-5 text-white" aria-hidden="true" />
                              )}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {notification.message}
                              </p>
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-gray-500">
                              {formatDateFromNow(notification.createdAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-sm text-gray-500 py-4">
                    No recent activity
                  </li>
                )}
              </ul>
            </div>
            <div className="mt-6 flex justify-end">
              <Link 
                to="/dashboard/notifications"
                className="text-sm text-primary-600 hover:text-primary-900"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Quick Actions
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="bg-gray-50 px-4 py-5 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:px-6">
              <Link 
                to="/dashboard/jobs/add"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New Job
              </Link>
              
              <Link 
                to="/dashboard/jobs?status=Interview"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                View Upcoming Interviews
              </Link>
              
              <Link 
                to="/dashboard/profile"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="h-5 w-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
