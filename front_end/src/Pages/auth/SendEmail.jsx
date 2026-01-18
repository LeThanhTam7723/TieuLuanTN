import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
          {strength === 0 && t("password_strength.enter_password")}
          {strength === 1 && t("password_strength.weak")}
          {strength === 2 && t("password_strength.fair")}
          {strength === 3 && t("password_strength.good")}
          {strength === 4 && t("password_strength.strong")}
        </p>
      </div>
  );
};

const VerificationPage = ({ email, onResend }) => {
  const { t } = useTranslation();
  return (
      <div className="text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-gray-900">{t("verification_page.verify_your_email")}</h2>
        <p className="text-gray-600">{t("verification_page.we_have_sent_a_verification_link_to")}</p>
        <p className="font-medium text-gray-800">{email}</p>
        <p className="text-gray-600">{t("verification_page.please_check_your_inbox")}</p>
        <div className="pt-4">
          <button
              onClick={onResend}
              className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {t("verification_page.resend_verification_email")}
          </button>
        </div>
      </div>
  );
};

const SendEmail = () => {
  const { t } = useTranslation();
  const [authState, setAuthState] = useState("sendEmail");
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
  const [captchaValue, setCaptchaValue] = useState(null);
  const handleCaptchaChange = (value) => {
    setCaptchaValue(value);
  };

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
          error = t("errors.please_enter_a_valid_email_address");
        }
        break;
      case "password":
        if (value && !validatePassword(value)) {
          error = t("errors.password_must_be_at_least_8_characters");
        }
        break;
      case "confirmPassword":
        if (value && value !== formData.password) {
          error = t("errors.passwords_do_not_match");
        }
        break;
      case "fullName":
        if (value.trim() === "") {
          error = t("errors.full_name_is_required");
        }
        break;
      case "username":
        if (value.trim() === "") {
          error = t("errors.username_is_required");
        }
        break;
      case "phone":
        if (value.trim() === "") {
          error = t("errors.phone_number_is_required");
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
      const confirmError = formData.confirmPassword !== value ? t("errors.passwords_do_not_match") : "";
      setErrors(prev => ({
        ...prev,
        confirmPassword: confirmError
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach(field => {
      if (field !== "rememberMe" && field !== "termsAccepted") {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });

    if (authState === "register" && !formData.termsAccepted) {
      newErrors.terms = t("errors.please_accept_terms_and_conditions");
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (authState === "register" || authState === "forgot") {
        setIsVerificationSent(true);
      } else {
        console.log("Form submitted:", formData);
      }
    }
    if(authState === "login"){
      console.log("login :", formData);
    } else {
      if(authState === "register"){
        console.log("register :", formData);
      } else {
        console.log("send vertical :", formData);
      }
    }
  };

  const handleResendVerification = () => {
    console.log("Resending verification email to:", formData.email);
  };

  const isFormValid = () => {
    if (authState === "login") {
      return validateEmail(formData.email) && captchaValue;
    } else if (authState === "register") {
      return validateEmail(formData.email) &&
          validatePassword(formData.password) &&
          formData.password === formData.confirmPassword &&
          formData.fullName &&
          formData.username &&
          formData.phone &&
          formData.termsAccepted;
    } else {
      return validateEmail(formData.email);
    }
  };

  return (
      <>
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t("send_email_page.sending_verify")}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">{t("send_email_page.email_address")}</label>
            <input
                type="email"
                name="email"
                placeholder={t("send_email_page.enter_email_address")}
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
          <button
              type="submit"
              disabled={!isFormValid()}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isFormValid() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {t("send_email_page.send_reset_link")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
              type="button"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {t("send_email_page.back_to_sign_in")}
          </button>
        </div>
      </>
  );
};

export default SendEmail;