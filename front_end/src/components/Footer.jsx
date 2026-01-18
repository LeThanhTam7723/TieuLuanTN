import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiHeart } from "react-icons/fi";
import { MdSecurity, MdLocalShipping, MdOutlinePayment } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const Footer = () => {
    const { t } = useTranslation(); // Khởi tạo hook useTranslation

    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail("");
            setTimeout(() => setIsSubscribed(false), 3000);
        }
    };

    const quickLinks = [
        { name: t('footer.quick_links.men_wear'), link: "/nam" }, 
        { name: t('footer.quick_links.women_wear'), link: "/nu" }, 
        { name: t('footer.quick_links.sale_off'), link: "/sale" }, 
        { name: t('footer.quick_links.collections'), link: "/collections" } 
    ];

    const supportLinks = [
        { name: t('footer.support_links.return_policy'), link: "/return-policy" }, 
        { name: t('footer.support_links.buying_guide'), link: "/guide" },       
        { name: t('footer.support_links.privacy_policy'), link: "/privacy" },   
        { name: t('footer.support_links.terms_of_use'), link: "/terms" }         
    ];

    const socialIcons = [
        { Icon: FaFacebookF, color: "hover:text-blue-500", bg: "hover:bg-blue-500/10" },
        { Icon: FaTwitter, color: "hover:text-sky-500", bg: "hover:bg-sky-500/10" },
        { Icon: FaInstagram, color: "hover:text-pink-500", bg: "hover:bg-pink-500/10" },
        { Icon: FaLinkedinIn, color: "hover:text-blue-600", bg: "hover:bg-blue-600/10" },
        { Icon: FaTiktok, color: "hover:text-black", bg: "hover:bg-gray-900/10" }
    ];

    return (
        <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-orange-500/5"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                {/* Top Benefits Bar */}
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 py-4">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div className="flex items-center justify-center space-x-3">
                                <MdLocalShipping className="text-2xl" />
                                <span className="font-medium">{t('footer.benefits.free_shipping')}</span> 
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <MdSecurity className="text-2xl" />
                                <span className="font-medium">{t('footer.benefits.genuine_warranty')}</span> 
                            </div>
                            <div className="flex items-center justify-center space-x-3">
                                <MdOutlinePayment className="text-2xl" />
                                <span className="font-medium">{t('footer.benefits.secure_payment')}</span> 
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="container mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                        {/* Brand Section */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-4">
                                    MOGGO
                                </h3>
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {t('footer.brand_description')} 
                                </p>
                            </div>

                            {/* Social Media */}
                            <div>
                                <h4 className="text-lg font-semibold mb-4 text-white">{t('footer.connect_us')}</h4> 
                                <div className="flex space-x-3">
                                    {socialIcons.map(({ Icon, color, bg }, index) => (
                                        <div key={index} className={`group p-3 rounded-full bg-white/10 backdrop-blur-sm ${color} ${bg} transition-all duration-300 cursor-pointer hover:scale-110 hover:shadow-lg`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white relative">
                                {t('footer.product_categories')} 
                                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                            </h4>
                            <ul className="space-y-4">
                                {quickLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.link}
                                            className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-sm"
                                        >
                                            <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white relative">
                                {t('footer.customer_support')} 
                                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                            </h4>
                            <ul className="space-y-4">
                                {supportLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link
                                            to={link.link}
                                            className="text-gray-300 hover:text-white transition-all duration-300 flex items-center group text-sm"
                                        >
                                            <span className="w-2 h-2 bg-amber-400 rounded-full mr-3 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            {/* Contact Info */}
                            <div className="mt-8 space-y-3">
                                <div className="flex items-center text-gray-300 text-sm group">
                                    <FiMapPin className="mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span>{t('footer.contact_info.address')}</span> 
                                </div>
                                <div className="flex items-center text-gray-300 text-sm group">
                                    <FiPhone className="mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span>+84 123 456 789</span>
                                </div>
                                <div className="flex items-center text-gray-300 text-sm group">
                                    <FiMail className="mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span>info@moggo.com</span>
                                </div>
                                <div className="flex items-center text-gray-300 text-sm group">
                                    <FiClock className="mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
                                    <span>{t('footer.contact_info.opening_hours')}</span> 
                                </div>
                            </div>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white relative">
                                {t('footer.newsletter.title')} 
                                <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"></div>
                            </h4>
                            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                                {t('footer.newsletter.description')} 
                            </p>

                            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t('footer.newsletter.placeholder')} 
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all duration-300"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 p-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 group"
                                    >
                                        <FiSend className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>

                                {isSubscribed && (
                                    <div className="flex items-center text-green-400 text-sm">
                                        <FiHeart className="mr-2" />
                                        <span>{t('footer.newsletter.subscribe_success')}</span> 
                                    </div>
                                )}
                            </form>

                            {/* Additional Info */}
                            <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                                <div className="flex items-center mb-2">
                                    <FiHeart className="text-amber-400 mr-2" />
                                    <span className="text-sm font-medium text-white">{t('footer.vip_member.title')}</span> 
                                </div>
                                <p className="text-xs text-gray-300">
                                    {t('footer.vip_member.description')} 
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700/50 backdrop-blur-sm">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-8">
                                <p className="text-gray-400 text-sm">
                                    &copy; {new Date().getFullYear()} MOGGO Fashion. {t('footer.bottom_bar.all_rights_reserved')} 
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <span>{t('footer.bottom_bar.made_with')}</span> 
                                    <FiHeart className="text-red-400 animate-pulse" />
                                    <span>{t('footer.bottom_bar.in_vietnam')}</span> 
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                    <span>{t('footer.bottom_bar.payment_methods')}</span> 
                                </div>
                                <div className="flex space-x-2">
                                    {['VISA', 'MASTER', 'MOMO', 'VNPAY'].map((payment, index) => (
                                        <div key={index} className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300 font-medium">
                                            {payment}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;