import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (date, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs(date).format(format);
};

export const formatDateShort = (date) => {
  return dayjs(date).format('MMM DD, YYYY');
};

export const formatTime = (date) => {
  return dayjs(date).format('HH:mm');
};

export const getRelativeTime = (date) => {
  return dayjs(date).fromNow();
};

export const isToday = (date) => {
  return dayjs(date).isSame(dayjs(), 'day');
};

export const isTomorrow = (date) => {
  return dayjs(date).isSame(dayjs().add(1, 'day'), 'day');
};

export const getStatusColor = (status) => {
  const colors = {
    SCHEDULED: '#ed6c02',    // Warning
    IN_PROGRESS: '#1976d2',  // Primary
    COMPLETED: '#2e7d32'     // Success
  };
  return colors[status] || '#757575';
};

export const getStatusLabel = (status) => {
  const labels = {
    SCHEDULED: 'Scheduled',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed'
  };
  return labels[status] || status;
};

export const validateAircraftId = (id) => {
  return /^[A-Z]{2}\d{3,}$/.test(id);
};

export const validateDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const calculateDaysUntilMaintenance = (maintenanceDate) => {
  const days = dayjs(maintenanceDate).diff(dayjs(), 'day');
  return days;
};
