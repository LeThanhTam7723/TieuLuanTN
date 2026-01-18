import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { checkEmailExists, register } from "../../API/AuthService";
import useQueryParam from "../../utils/useQueryParam";
import { useTranslation } from 'react-i18next';

const PasswordStrength = ({ password }) => {
  const { t } = useTranslation();
  const getStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^A-Za-z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  const getColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
      <div className="mt-2">
        <div className="h-2 w-full bg-gray-200 rounded-full">
          <div
              className={`h-full ${getColor()} rounded-full transition-all duration-300`}
              style={{ width: `${(strength / 4) * 100}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-gray-500">
          {strength === 0 && t('register.passwordStrength.enterPassword')}
          {strength === 1 && t('register.passwordStrength.weak')}
          {strength === 2 && t('register.passwordStrength.fair')}
          {strength === 3 && t('register.passwordStrength.good')}
          {strength === 4 && t('register.passwordStrength.strong')}
        </p>
      </div>
  );
};



const Register = () => {
  const email = useQueryParam("email");
  const { t } = useTranslation();

  useEffect(() => {
    if (email) {
      console.log("Email từ URL:", email);
    }
  }, [email]);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    username: "",
    phone: "",
    rememberMe: false,
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    return hasMinLength && hasUpperCase && hasNumber && hasSpecialChar;
  };

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (value && !validateEmail(value)) {
          error = t('register.errors.emailInvalid');
        }
        break;
      case "password":
        if (value && !validatePassword(value)) {
          error = t('register.errors.passwordInvalid');
        }
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          error = t('register.errors.passwordsMismatch');
        }
        break;
      case "fullName":
        if (value.trim() === "") {
          error = t('register.errors.fullNameRequired');
        }
        break;
      case "username":
        if (value.trim() === "") {
          error = t('register.errors.usernameRequired');
        }
        break;
      case "phone":
        if (value.trim() === "") {
          error = t('register.errors.phoneRequired');
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (type !== "checkbox") {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }

    if (name === "password" && formData.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? t('register.errors.passwordsMismatch') : "";
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    console.log("register :", formData);
    await register({username: formData.username,
      password: formData.password,
      phone: formData.phone ,
      email: email,
      fullname: formData.fullName,
      active: 1,
    })
        .then((res) => {
          const { code, message, result } = res.data;
          if(code !== 0){
            console.log(message);
          }
          navigate('/auth/login');
        })
        .catch((err) => {
          console.error("Đã xảy ra lỗi khi gọi API:", err);
        });
  };

  const handleResendVerification = () => {
    console.log("Resending verification email to:", formData.email);
  };

  const isFormValid = () => {
    return   validatePassword(formData.password) &&
        formData.password === formData.confirmPassword &&
        formData.fullName &&
        formData.username &&
        formData.phone &&
        formData.termsAccepted &&
        isEmailAvailable;
  };

  return (
      <>
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('register.title')}
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('register.fullNameLabel')}</label>
            <input
                type="text"
                name="fullName"
                value={formData.fullName}
                placeholder={t('register.fullNamePlaceholder')}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('register.usernameLabel')}</label>
            <input
                type="text"
                name="username"
                value={formData.username}
                placeholder={t('register.usernamePlaceholder')}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">{t('register.phoneNumberLabel')}</label>
            <input
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder={t('register.phoneNumberPlaceholder')}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">{t('register.passwordLabel')}</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder={t('register.passwordPlaceholder')}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              />
              <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
              </button>
            </div>
            <PasswordStrength password={formData.password} />
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('register.confirmPasswordLabel')}</label>
            <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder={t('register.confirmPasswordPlaceholder')}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div className="flex items-center">
            <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              {t('register.termsAndConditions')}
            </label>
          </div>

          <button
              type="submit"
              disabled={!isFormValid()}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {t('register.signUpButton')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
              type="button"
              onClick={() => { navigate('/auth/login');}}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {t('register.haveAccountSignIn')}
          </button>
        </div>
      </>
  );
};

export default Register;