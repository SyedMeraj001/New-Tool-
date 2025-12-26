// Signup approval system for super admin
export const getSignupRequests = () => {
  return JSON.parse(localStorage.getItem('signupRequests') || '[]');
};

export const getSuperAdminNotifications = () => {
  return JSON.parse(localStorage.getItem('superAdminNotifications') || '[]');
};

export const approveSignupRequest = (requestId) => {
  const requests = getSignupRequests();
  const request = requests.find(r => r.id === requestId);
  
  if (request) {
    // Add to approved users
    const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
    approvedUsers.push({
      ...request,
      status: 'approved',
      approvedDate: new Date().toISOString()
    });
    localStorage.setItem('approvedUsers', JSON.stringify(approvedUsers));
    
    // Remove from pending requests
    const updatedRequests = requests.filter(r => r.id !== requestId);
    localStorage.setItem('signupRequests', JSON.stringify(updatedRequests));
    
    // Update notification
    const notifications = getSuperAdminNotifications();
    const notification = notifications.find(n => n.requestId === requestId);
    if (notification) {
      notification.read = true;
      notification.message = `Approved signup request for ${request.fullName} (${request.email})`;
    }
    localStorage.setItem('superAdminNotifications', JSON.stringify(notifications));
    
    return true;
  }
  return false;
};

export const rejectSignupRequest = (requestId, reason = '') => {
  const requests = getSignupRequests();
  const request = requests.find(r => r.id === requestId);
  
  if (request) {
    // Remove from pending requests
    const updatedRequests = requests.filter(r => r.id !== requestId);
    localStorage.setItem('signupRequests', JSON.stringify(updatedRequests));
    
    // Update notification
    const notifications = getSuperAdminNotifications();
    const notification = notifications.find(n => n.requestId === requestId);
    if (notification) {
      notification.read = true;
      notification.message = `Rejected signup request for ${request.fullName} (${request.email})${reason ? `: ${reason}` : ''}`;
    }
    localStorage.setItem('superAdminNotifications', JSON.stringify(notifications));
    
    return true;
  }
  return false;
};

export const getApprovedUsers = () => {
  return JSON.parse(localStorage.getItem('approvedUsers') || '[]');
};

export const markNotificationAsRead = (notificationId) => {
  const notifications = getSuperAdminNotifications();
  const notification = notifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    localStorage.setItem('superAdminNotifications', JSON.stringify(notifications));
  }
};