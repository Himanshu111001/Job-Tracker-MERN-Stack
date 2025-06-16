import { format, formatDistance } from 'date-fns';

// Format date to display as: Mar 15, 2023
export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM d, yyyy');
};

// Format date to display as: 2 days ago, 1 month ago, etc.
export const formatDateFromNow = (date) => {
  if (!date) return '';
  return formatDistance(new Date(date), new Date(), { addSuffix: true });
};

// Get status color classes (Tailwind CSS)
export const getStatusColor = (status) => {
  switch (status) {
    case 'Applied':
      return 'bg-blue-100 text-blue-800';
    case 'Interview':
      return 'bg-yellow-100 text-yellow-800';
    case 'Offer':
      return 'bg-green-100 text-green-800';
    case 'Rejected':
      return 'bg-red-100 text-red-800';
    case 'Accepted':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
