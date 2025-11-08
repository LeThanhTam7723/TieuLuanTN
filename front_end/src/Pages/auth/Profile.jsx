import { useState, useEffect } from "react";
import { FiSettings, FiLogOut, FiCamera, FiSave, FiLock, FiUser, FiMail, FiPhone } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import UserService from "../../API/UserService";
import { toast } from "react-toastify";
import { checkAndRefreshSession, getTokenExpiryTime } from "../../utils/tokenUtils";
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    phone: "",
    avatar: null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentSession = checkAndRefreshSession();
    if (!currentSession) {
      toast.error(t('session.expired'));
      navigate('/auth/login');
      return;
    }
    setSession(currentSession);

    const expiryTime = getTokenExpiryTime(currentSession.token);
    if (expiryTime) {
      console.log("Token sẽ hết hạn vào:", expiryTime.toLocaleString());
    }

    fetchUserProfile();
  }, [t, navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUserProfile();
      const { data } = response.data;
      setUserInfo({
        fullname: data.fullname || "",
        email: data.email || "",
        phone: data.phone || "",
        avatar: data.imageUrl || null
      });
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(t('session.expired'));
        localStorage.removeItem("session");
        navigate('/auth/login');
      } else {
        toast.error(t('session.loadingProfileFailed'));
        console.error("Error fetching profile:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!userInfo.fullname.trim()) {
      newErrors.fullname = t('profile.personalInfo.fullname.required');
    }
    if (!userInfo.phone.trim()) {
      newErrors.phone = t('profile.personalInfo.phone.required');
    } else if (!/^[0-9]{10}$/.test(userInfo.phone)) {
      newErrors.phone = t('profile.personalInfo.phone.invalid');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      await UserService.updateUserProfile({
        fullname: userInfo.fullname,
        phone: userInfo.phone
      });
      toast.success(t('profile.personalInfo.updateSuccess'));
    } catch (error) {
      toast.error(error.response?.data?.message || t('profile.personalInfo.updateFailed'));
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t('profile.avatarSection.fileSizeError'));
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(t('profile.avatarSection.fileTypeError'));
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarUpdate = async () => {
    if (!selectedFile) {
      toast.warning(t('profile.avatarSection.selectNewImage'));
      return;
    }

    try {
      setAvatarLoading(true);
      await UserService.updateAvatar(selectedFile);
      toast.success(t('profile.avatarSection.updateAvatarSuccess'));
      fetchUserProfile();
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error(t('session.expired'));
        localStorage.removeItem("session");
        navigate('/auth/login');
      } else {
        toast.error(error.response?.data?.message || t('profile.avatarSection.updateAvatarFailed'));
        console.error("Error updating avatar:", error);
      }
    } finally {
      setAvatarLoading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(t('passwordModal.passwordMismatch'));
      return;
    }

    try {
      setLoading(true);
      await UserService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      toast.success(t('passwordModal.changePasswordSuccess'));
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      toast.error(error.response?.data?.message || t('passwordModal.changePasswordFailed'));
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    navigate('/auth/login');
  };

  if (loading && !userInfo.fullname) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent"></div>
            <div className="absolute inset-0 rounded-full border-4 border-amber-100"></div>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white py-6 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">{t('profile.header.title')}</h1>
            <p className="text-gray-300 mt-2">{t('profile.header.description')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Avatar & Quick Actions */}
            <div className="lg:col-span-1">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center mb-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-1 shadow-2xl">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white flex items-center justify-center">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : userInfo.avatar ? (
                            <img
                                src={userInfo.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  setUserInfo(prev => ({ ...prev, avatar: null }));
                                }}
                            />
                        ) : (
                            <FaUserCircle className="w-full h-full text-gray-300" />
                        )}
                      </div>
                    </div>

                    <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full p-3 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 group-hover:scale-110">
                      <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                      />
                      <FiCamera className="text-white w-4 h-4" />
                    </label>
                  </div>

                  <div className="text-center mt-4">
                    <h3 className="text-xl font-bold text-gray-800">{userInfo.fullname}</h3>
                    <p className="text-gray-500 text-sm">{userInfo.email}</p>
                  </div>

                  {selectedFile && (
                      <button
                          onClick={handleAvatarUpdate}
                          disabled={avatarLoading}
                          className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        {avatarLoading ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        ) : (
                            <>
                              <FiSave className="w-4 h-4" />
                              {t('profile.avatarSection.saveImage')}
                            </>
                        )}
                      </button>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-600 transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-white shadow-sm group-hover:bg-amber-100 transition-colors">
                      <FiLock className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{t('profile.quickActions.changePassword')}</span>
                  </button>

                  <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all duration-300 group"
                  >
                    <div className="p-2 rounded-lg bg-white shadow-sm group-hover:bg-red-100 transition-colors">
                      <FiLogOut className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{t('profile.quickActions.logout')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200/50 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                    <FiSettings className="w-6 h-6 text-white" />
                  </div>
                  {t('profile.personalInfo.title')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-amber-500" />
                      {t('profile.personalInfo.fullname.label')}
                    </label>
                    <input
                        type="text"
                        name="fullname"
                        value={userInfo.fullname}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:bg-white transition-all duration-300 ${
                            errors.fullname
                                ? 'border-red-300 focus:border-red-400'
                                : 'border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100'
                        }`}
                        placeholder={t('profile.personalInfo.fullname.placeholder')}
                    />
                    {errors.fullname && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {errors.fullname}
                        </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FiMail className="w-4 h-4 text-amber-500" />
                      {t('profile.personalInfo.email.label')}
                    </label>
                    <input
                        type="email"
                        value={userInfo.email}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                        placeholder={t('profile.personalInfo.email.placeholder')}
                    />
                    <p className="mt-2 text-xs text-gray-500">{t('profile.personalInfo.email.note')}</p>
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FiPhone className="w-4 h-4 text-amber-500" />
                      {t('profile.personalInfo.phone.label')}
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl border-2 bg-white/50 backdrop-blur-sm focus:outline-none focus:bg-white transition-all duration-300 ${
                            errors.phone
                                ? 'border-red-300 focus:border-red-400'
                                : 'border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100'
                        }`}
                        placeholder={t('profile.personalInfo.phone.placeholder')}
                    />
                    {errors.phone && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                          {errors.phone}
                        </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>{t('profile.personalInfo.saving')}</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                          <FiSave className="w-5 h-5" />
                          <span>{t('profile.personalInfo.saveChanges')}</span>
                        </div>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <FiLock className="w-5 h-5 text-white" />
                    </div>
                    {t('passwordModal.title')}
                  </h3>
                </div>

                <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('passwordModal.currentPassword.label')}
                    </label>
                    <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({
                          ...prev,
                          currentPassword: e.target.value
                        }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('passwordModal.newPassword.label')}
                    </label>
                    <input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({
                          ...prev,
                          newPassword: e.target.value
                        }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('passwordModal.confirmNewPassword.label')}
                    </label>
                    <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({
                          ...prev,
                          confirmPassword: e.target.value
                        }))}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100 focus:outline-none transition-all duration-300"
                        required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => setShowPasswordModal(false)}
                        className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors duration-300 font-medium"
                    >
                      {t('passwordModal.cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-amber-100 transition-all duration-300 disabled:opacity-50"
                    >
                      {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          </div>
                      ) : (
                          t('passwordModal.changePasswordBtn')
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
};

export default Profile;