import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/auth/authSlice';
import { getNotifications } from '../../redux/notifications/notificationSlice';
import { BriefcaseIcon, ChartBarIcon, UserIcon, BellIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

const DashboardLayout = () => {  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { unreadCount, notifications, success } = useSelector((state) => state.notifications);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Ensure notifications are loaded when the dashboard layout mounts
  useEffect(() => {
    dispatch(getNotifications());
  }, [dispatch]);
  
  // Log when notification state changes (for debugging)
  useEffect(() => {
    console.log('DashboardLayout - Notification count updated:', unreadCount);
    console.log('DashboardLayout - Notifications:', notifications?.length);
  }, [unreadCount, notifications]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force navigation to login page even if there was an error during logout
      navigate('/login');
    }
  };

  const navigation = [
    { name: 'Dashboard', to: '/dashboard', icon: ChartBarIcon },
    { name: 'Jobs', to: '/dashboard/jobs', icon: BriefcaseIcon },
    { name: 'Notifications', to: '/dashboard/notifications', icon: BellIcon, badge: unreadCount },
    { name: 'Profile', to: '/dashboard/profile', icon: UserIcon },
  ];

  // Admin navigation items
  const adminNav = [
    { name: 'Admin Dashboard', to: '/admin', icon: Cog6ToothIcon },
    { name: 'User Management', to: '/admin/users', icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-primary-800">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/dashboard" className="text-white font-bold text-xl">
                JobTrack
              </Link>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-primary-900 text-white'
                        : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  <span>{item.name}</span>
                  {item.badge > 0 && (
                    <span className="ml-auto inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
              
              {user && user.role === 'admin' && (
                <>
                  <div className="mt-8 pt-2 border-t border-primary-700">
                    <h3 className="px-3 text-sm font-medium text-primary-200">Admin</h3>
                    {adminNav.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.to}
                        className={({ isActive }) =>
                          `mt-1 flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                            isActive
                              ? 'bg-primary-900 text-white'
                              : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                          }`
                        }
                      >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        <span>{item.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </>
              )}
            </nav>
          </div>
          <div className="flex flex-shrink-0 bg-primary-700 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium text-sm">
                    {user && user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user ? user.name : 'User'}</p>
                  <p className="text-xs font-medium text-primary-200 group-hover:text-primary-100">
                    {user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Loading...'}
                  </p>
                </div>
                <button
                  type="button"
                  className="ml-2 flex-shrink-0 rounded-full p-1 text-primary-200 hover:text-white hover:bg-primary-600"
                  onClick={handleLogout}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 bg-primary-800 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-white hover:text-primary-100 focus:outline-none"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
          <div className="flex-1 flex justify-between px-4 sm:px-6">
            <div className="flex-1 flex items-center">
              <h1 className="text-white font-bold text-xl">JobTrack</h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <NavLink
                to="/dashboard/notifications"
                className="rounded-full p-1 text-white hover:bg-primary-700 relative"
              >
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs font-medium text-white text-center">
                    {unreadCount}
                  </span>
                )}
              </NavLink>

              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="flex max-w-xs items-center rounded-full bg-primary-600 text-sm focus:outline-none"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                      {user && user.name ? user.name.charAt(0).toUpperCase() : '?'}
                    </div>
                  </button>
                </div>
                <Transition
                  show={userMenuOpen}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>        {/* Mobile menu */}
        <div
          className={`fixed inset-0 z-40 md:hidden transform transition ease-in-out duration-300 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Mobile menu content */}
          <div className="relative flex flex-col max-w-xs w-full h-full bg-primary-800">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-white font-bold text-xl">JobTrack</span>
              </div>
              <nav className="mt-5 space-y-1 px-2">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                        isActive
                          ? 'bg-primary-900 text-white'
                          : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span>{item.name}</span>
                    {item.badge > 0 && (
                      <span className="ml-auto inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-500 text-white">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
                
                {user && user.role === 'admin' && (
                  <>
                    <div className="mt-8 pt-2 border-t border-primary-700">
                      <h3 className="px-3 text-sm font-medium text-primary-200">Admin</h3>
                      {adminNav.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.to}
                          className={({ isActive }) =>
                            `mt-1 flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                              isActive
                                ? 'bg-primary-900 text-white'
                                : 'text-primary-100 hover:bg-primary-700 hover:text-white'
                            }`
                          }
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="mr-3 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                          <span>{item.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </nav>
            </div>
            <div className="flex-shrink-0 flex bg-primary-700 p-4">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="h-9 w-9 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium text-sm">
                    {user && user.name ? user.name.charAt(0).toUpperCase() : '?'}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user ? user.name : 'User'}</p>
                  <p className="text-xs font-medium text-primary-200">
                    {user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Loading...'}
                  </p>
                </div>
                <button
                  type="button"
                  className="ml-2 flex-shrink-0 rounded-full p-1 text-primary-200 hover:text-white hover:bg-primary-600"
                  onClick={handleLogout}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
