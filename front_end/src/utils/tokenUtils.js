// Hàm kiểm tra token có hợp lệ không
export const isTokenValid = (token) => {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return expiryTime > Date.now();
  } catch (error) {
    console.error('Error parsing token:', error);
    return false;
  }
};

// Hàm lấy thời gian hết hạn của token
export const getTokenExpiryTime = (token) => {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiry:', error);
    return null;
  }
};

// Hàm kiểm tra và làm mới session nếu cần
export const checkAndRefreshSession = () => {
  const sessionStr = localStorage.getItem('session');
  if (!sessionStr) return null;

  try {
    const session = JSON.parse(sessionStr);
    if (!session?.token) return null;

    if (!isTokenValid(session.token)) {
      console.log('Token đã hết hạn, xóa session');
      localStorage.removeItem('session');
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error checking session:', error);
    localStorage.removeItem('session');
    return null;
  }
}; 