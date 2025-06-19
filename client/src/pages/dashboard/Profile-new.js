import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../redux/auth/authSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordMode, setPasswordMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const { name, email, currentPassword, newPassword, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordMode = () => {
    setPasswordMode(!passwordMode);
    // Reset password fields when toggling
    setFormData({
      ...formData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    
    // Validation for password update
    if (passwordMode) {
      if (newPassword !== confirmPassword) {
        // Handle password mismatch error
        return;
      }
      
      if (newPassword.length < 6) {
        // Handle password length error
        return;
      }
    }

    const updateData = {
      name,
      ...(passwordMode && {
        currentPassword,
        newPassword
      })
    };

    try {
      await dispatch(updateProfile(updateData)).unwrap();
      setSuccessMessage(passwordMode 
        ? 'Password updated successfully!' 
        : 'Profile updated successfully!');
        
      // Reset password fields after successful update
      if (passwordMode) {
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordMode(false);
      }
    } catch (error) {
      // Error will be handled by Redux
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="pb-5 border-b border-gray-200 mb-6">
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Profile Settings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update your personal information and password.
        </p>
      </div>

      {successMessage && (
        <div className="mt-4 mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6">
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-6 sm:p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold leading-6 text-gray-900 mb-4">
                    {passwordMode ? 'Change Password' : 'Personal Information'}
                  </h3>
                </div>

                {!passwordMode && (
                  <>
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-gray-800 mb-1">
                        Full Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={name}
                          onChange={handleChange}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-1">
                        Email Address
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={email}
                          disabled={true}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed"
                        />
                        <p className="mt-1 text-xs text-gray-500">Email address cannot be changed for security reasons.</p>
                      </div>
                    </div>
                  </>
                )}

                {passwordMode && (
                  <>
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-semibold text-gray-800 mb-1">
                        Current Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="currentPassword"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-800 mb-1">
                        New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="newPassword"
                          id="newPassword"
                          value={newPassword}
                          onChange={handleChange}
                          required
                          minLength={6}
                          className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                        <p className="mt-1 text-xs text-gray-500">Password must be at least 6 characters.</p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-1">
                        Confirm New Password
                      </label>
                      <div className="mt-1">
                        <input
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={handleChange}
                          required
                          className="block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={togglePasswordMode}
                    className="inline-flex items-center px-5 py-2.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {passwordMode ? 'Edit Profile Instead' : 'Change Password Instead'}
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
