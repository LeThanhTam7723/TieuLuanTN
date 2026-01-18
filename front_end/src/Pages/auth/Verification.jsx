import { useTranslation } from "react-i18next";

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

export default VerificationPage;