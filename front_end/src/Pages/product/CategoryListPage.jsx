import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiRefreshCw, FiGrid, FiFilter } from 'react-icons/fi';
import CategoryService from '../../API/CategoryService';
import CategoryCard from "../../components/category/CategoryCard.jsx";
import CategoryBrandCard from "../../components/category/CategoryBrandCard.jsx";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import BrandService from '../../API/BrandService.jsx';

const CategoryListPage = () => {
    const { t } = useTranslation(); // Initialize useTranslation hook
    const { genderSlug } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCategories = async (gender) => {
        try {
            setLoading(true);
            setError(null);
            const response = await CategoryService.getCategoriesByGenderSlug(gender);
            setCategories(response.data || []);
        } catch (err) {
            // Use t() for error messages
            setError(t('category_list.error_state.message'));
            console.error(t('category_list.errors.loading_categories_log'), err);
        } finally {
            setLoading(false);
        }
    };

    const loadBrands = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await BrandService.getAllBrands();
            setCategories(response.data || []);
        } catch (err) {
            // Use t() for error messages
            setError(t('category_list.error_state.message'));
            console.error(t('category_list.errors.loading_categories_log'), err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (genderSlug === "brands") {
            loadBrands();
        }else{
            loadCategories(genderSlug);
        }
        
    }, [genderSlug, t]); // Add t to dependency array

    const handleCategoryClick = (categorySlug) => {
        navigate(`/collections/${categorySlug}`);
    };

    // Helper to get gender name from translations
    const getGenderDisplayName = (slug) => {
        return t(`category_list.gender_names.${slug}`, { defaultValue: slug });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Hero Section */}
            <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {t('category_list.hero.title_prefix')} {getGenderDisplayName(genderSlug)}
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t('category_list.hero.description')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    /* Loading State */
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900"></div>
                            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-900 to-transparent opacity-20"></div>
                        </div>
                        <p className="mt-6 text-gray-600 font-medium">{t('category_list.loading.message')}</p>
                    </div>
                ) : error ? (
                    /* Error State */
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiRefreshCw className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {t('category_list.error_state.heading')}
                            </h3>
                            <p className="text-gray-600 mb-6">{error}</p>
                            <button
                                onClick={() => loadCategories(genderSlug)}
                                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <FiRefreshCw className="w-4 h-4" />
                                {t('category_list.error_state.retry_button')}
                            </button>
                        </div>
                    </div>
                ) : categories.length === 0 ? (
                    /* Empty State */
                    <div className="max-w-md mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl border p-12 text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiGrid className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                {t('category_list.empty_state.heading')}
                            </h3>
                            <p className="text-gray-600">
                                {t('category_list.empty_state.message_prefix')} {getGenderDisplayName(genderSlug)} {t('category_list.empty_state.message_suffix')}
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Categories Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-gray-900 to-gray-600 rounded-full"></div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {t('category_list.categories_section.title')}
                                    </h2>
                                    <p className="text-gray-600 mt-1">
                                        {categories.length} {t('category_list.categories_section.count_suffix')}
                                    </p>
                                </div>
                            </div>

                            <div className="hidden sm:flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <FiFilter className="w-4 h-4" />
                                    {t('category_list.categories_section.filter_button')}
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                    <FiGrid className="w-4 h-4" />
                                    {t('category_list.categories_section.view_button')}
                                </button>
                            </div>
                        </div>

                        {/* Categories Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {categories.map((category, index) => (
                                <div
                                    key={category.id}
                                    className="animate-fadeInUp"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    {genderSlug === "brands" ? (
                                        <CategoryBrandCard brand={category} />
                                    ):(
                                        <CategoryCard category={category} genderSlug={genderSlug} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out;
                }
            `}</style>
        </div>
    );
};

export default CategoryListPage;