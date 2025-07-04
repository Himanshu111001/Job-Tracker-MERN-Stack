import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getJobById, updateJob, resetJobState } from '../../../redux/jobs/jobSlice';

const EditJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { job, loading: jobsStatus } = useSelector((state) => state.jobs);
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    location: '',
    status: 'Applied',
    appliedDate: '',
    notes: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    salary: '',
    link: ''
  });
    // Debug: Log job state changes
  useEffect(() => {
    console.log("Current job state:", job);
    console.log("Current loading status:", jobsStatus);
  }, [job, jobsStatus]);
  // Fetch job details when component mounts
  useEffect(() => {
    console.log("Fetching job details for ID:", jobId);
    dispatch(getJobById(jobId));
    
    // Clean up when component unmounts
    return () => {
      dispatch(resetJobState());
    };
  }, [dispatch, jobId]);
  // Populate form when job details are fetched
  useEffect(() => {
    if (job) {
      console.log("Populating form with job data:", job);
      setFormData({
        company: job.company || '',
        title: job.title || '',
        location: job.location || '',
        status: job.status || 'Applied',
        appliedDate: job.appliedDate ? new Date(job.appliedDate).toISOString().split('T')[0] : '',
        notes: job.notes || '',
        contactName: job.contactName || '',
        contactEmail: job.contactEmail || '',
        contactPhone: job.contactPhone || '',
        salary: job.salary || '',
        link: job.link || ''
      });
    }
  }, [job]);

  const { 
    company, 
    title, 
    location, 
    status: jobStatus, 
    appliedDate, 
    notes, 
    contactName, 
    contactEmail, 
    contactPhone, 
    salary, 
    link 
  } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    console.log("Job ID for update:", jobId);
    
    try {
      // Ensure we're using 'id' instead of 'jobId' to match the expected parameter in the thunk
      const result = await dispatch(updateJob({ id: jobId, jobData: formData })).unwrap();
      console.log("Update successful:", result);
      navigate(`/dashboard/jobs/${jobId}`);
    } catch (error) {
      console.error("Error updating job:", error);
      // Here you could add a toast notification or other user feedback about the error
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Job Application</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update details for this job application.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/jobs/${jobId}`)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
        {jobsStatus ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading job details...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-800 mb-1">
                  Company Name*
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={company}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-800 mb-1">
                  Job Title*
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-800 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={location}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-semibold text-gray-800 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={jobStatus}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Accepted">Accepted</option>
                </select>
              </div>

              <div>
                <label htmlFor="appliedDate" className="block text-sm font-semibold text-gray-800 mb-1">
                  Date Applied*
                </label>
                <input
                  type="date"
                  name="appliedDate"
                  id="appliedDate"
                  value={appliedDate}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="salary" className="block text-sm font-semibold text-gray-800 mb-1">
                  Expected Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  value={salary}
                  onChange={handleChange}
                  placeholder="e.g. $80,000 - $100,000"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="link" className="block text-sm font-semibold text-gray-800 mb-1">
                  Job Posting URL
                </label>
                <input
                  type="url"
                  name="link"
                  id="link"
                  value={link}
                  onChange={handleChange}
                  placeholder="https://example.com/job"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-semibold text-gray-800 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  id="contactName"
                  value={contactName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-semibold text-gray-800 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  value={contactEmail}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="contactPhone" className="block text-sm font-semibold text-gray-800 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  id="contactPhone"
                  value={contactPhone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="notes" className="block text-sm font-semibold text-gray-800 mb-1">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={notes}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2.5 text-base shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/jobs/${jobId}`)}
              className="mr-3 rounded-md border border-gray-300 bg-white py-3 px-5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={jobsStatus}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
            >
              {jobsStatus ? 'Updating...' : 'Update Job Application'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditJob;
