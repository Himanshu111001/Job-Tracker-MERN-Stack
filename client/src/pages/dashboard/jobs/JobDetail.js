import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobById, deleteJob, clearJobData } from '../../../redux/jobs/jobSlice';
import { formatDate, formatDateFromNow, getStatusColor } from '../../../utils/formatters';
import toast from 'react-hot-toast';
import { 
  BuildingOfficeIcon, 
  BriefcaseIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const JobDetail = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { job, loading, error } = useSelector((state) => state.jobs);
  
  useEffect(() => {
    dispatch(getJobById(jobId));
    
    return () => {
      dispatch(clearJobData()); // Clear job data on unmount
    };
  }, [dispatch, jobId]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      dispatch(deleteJob(jobId));
      toast.success('Job application deleted successfully');
      navigate('/dashboard/jobs');
    }
  };
  
  if (loading || !job) {
    return (
      <div className="py-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Back button and actions */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/dashboard/jobs"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-900"
          >
            <ArrowLeftIcon className="mr-2 h-5 w-5" />
            Back to Jobs
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to={`/dashboard/jobs/${jobId}/edit`}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="-ml-1 mr-2 h-5 w-5" />
              Delete
            </button>
          </div>
        </div>
        
        {/* Job details card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {job.title}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {job.company}
              </p>
            </div>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Company
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{job.company}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Job Title
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{job.title}</dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Applied Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(job.appliedDate)}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDateFromNow(job.appliedDate)}
                  </p>
                </dd>
              </div>
              
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{job.location || 'Not specified'}</dd>
              </div>
              
              {job.contactName && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Contact Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{job.contactName}</dd>
                </div>
              )}
              
              {job.contactEmail && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Contact Email
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`mailto:${job.contactEmail}`} className="text-primary-600 hover:text-primary-900">
                      {job.contactEmail}
                    </a>
                  </dd>
                </div>
              )}
              
              {job.contactPhone && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Contact Phone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a href={`tel:${job.contactPhone}`} className="text-primary-600 hover:text-primary-900">
                      {job.contactPhone}
                    </a>
                  </dd>
                </div>
              )}
              
              {job.salary && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Salary
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{job.salary}</dd>
                </div>
              )}
              
              {job.link && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <LinkIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Job Posting Link
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <a 
                      href={job.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary-600 hover:text-primary-900 break-all"
                    >
                      {job.link}
                    </a>
                  </dd>
                </div>
              )}
              
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Notes
                </dt>
                <dd className="mt-1 text-sm text-gray-900 prose">
                  {job.notes ? (
                    <div className="whitespace-pre-line">{job.notes}</div>
                  ) : (
                    <span className="text-gray-500 italic">No notes added</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
          
          {/* Additional metadata */}
          <div className="border-t border-gray-200 px-4 py-3 sm:px-6 bg-gray-50">
            <div className="flex justify-between text-xs text-gray-500">
              <div>Created: {formatDate(job.createdAt)}</div>
              <div>Last Updated: {formatDate(job.updatedAt)}</div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="mt-6 flex justify-between items-center">
          <Link
            to="/dashboard/jobs"
            className="text-sm font-medium text-primary-600 hover:text-primary-900"
          >
            ← Back to Jobs List
          </Link>
          <div className="flex space-x-4">
            <Link
              to={`/dashboard/jobs/${jobId}/edit`}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-700 bg-primary-100 hover:bg-primary-200 rounded-md"
            >
              Update Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
