import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiShoppingBag, FiTrendingUp, FiStar } from 'react-icons/fi';
import ProductService from '../API/ProductService';
import ProductCard from '../components/product/ProductCard';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import ChatBot from '../components/chatbot/ChatBot';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop&crop=center';
const MEN_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop&crop=center';
const WOMEN_IMAGE = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?fit=crop&w=600&h=400';
const CASUAL_IMAGE = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=600&fit=crop&crop=center';

function HomePage() {
  const { t } = useTranslation(); // Khởi tạo hook useTranslation

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingFeaturedProducts, setLoadingFeaturedProducts] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  console.log("a");

  const productsContainerRef = useRef(null);
  const navigate = useNavigate();

  // Auto-slide for hero banner
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % 3);
  //   }, 5000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await ProductService.getFeaturedProducts();
        setFeaturedProducts(response.data.content);
      } catch (err) {
        console.error('Error fetching sản phẩm nổi bật:', err); // Giữ lại log gốc để debug
        setErrorFeatured(t('homepage.featured_products.error_message.description')); // Sử dụng chuỗi dịch
      } finally {
        setLoadingFeaturedProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, [t]);
  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src =
  //     "https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []); // Thêm t vào dependency array

  const scrollProducts = (direction) => {
    if (productsContainerRef.current) {
      const scrollAmount = 400;
      const scrollLeft = direction === 'left' ? -scrollAmount : scrollAmount;
      productsContainerRef.current.scrollBy({ left: scrollLeft, behavior: 'smooth' });
    }
  };

  // Cập nhật nội dung heroSlides để sử dụng t()
  const heroSlides = [
    {
      title: t('homepage.hero_banner.slide1_title'),
      subtitle: t('homepage.hero_banner.slide1_subtitle'),
      description: t('homepage.hero_banner.slide1_description'),
      cta: t('homepage.hero_banner.slide1_cta'),
      gradient: "from-blue-600 via-purple-600 to-blue-800"
    },
    {
      title: t('homepage.hero_banner.slide2_title'),
      subtitle: t('homepage.hero_banner.slide2_subtitle'),
      description: t('homepage.hero_banner.slide2_description'),
      cta: t('homepage.hero_banner.slide2_cta'),
      gradient: "from-pink-500 via-red-500 to-yellow-500"
    },
    {
      title: t('homepage.hero_banner.slide3_title'),
      subtitle: t('homepage.hero_banner.slide3_subtitle'),
      description: t('homepage.hero_banner.slide3_description'),
      cta: t('homepage.hero_banner.slide3_cta'),
      gradient: "from-green-400 via-blue-500 to-purple-600"
    }
  ];

  if (loadingFeaturedProducts) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mx-auto"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-gray-900 to-transparent opacity-20"></div>
            </div>
            <p className="text-xl font-medium text-gray-700">{t('loading_page.title')}</p>
            <p className="text-gray-500 mt-2">{t('loading_page.subtitle')}</p>
          </div>
        </div>
    );
  }

  

  return (
      <div className="homepage bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Banner Section */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          {heroSlides.map((slide, index) => (
              <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                  }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}>
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
                <div
                    className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
                    style={{ backgroundImage: `url(${HERO_IMAGE})` }}
                ></div>

                <div className="relative z-10 h-full flex items-center justify-center text-white text-center px-4">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-light mb-4 opacity-90">
                      {slide.subtitle}
                    </p>
                    <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto">
                      {slide.description}
                    </p>
                    <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-full shadow-2xl hover:shadow-white/25 hover:scale-105 transition-all duration-300 text-lg">
                      {slide.cta}
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
            {heroSlides.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                    }`}
                />
            ))}
          </div>
        </section>

        {/* Category Sections */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Men Wear */}
            <div className="group relative h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${MEN_IMAGE})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              <div className="relative z-10 h-full flex items-end p-8">
                <div className="text-white">
                  <h2 className="text-4xl font-bold mb-4">{t('homepage.categories.men_wear_title')}</h2>
                  <p className="text-lg opacity-90 mb-6">{t('homepage.categories.men_wear_description')}</p>
                  <button className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                    <FiShoppingBag className="w-4 h-4" />
                    {t('homepage.categories.men_wear_cta')}
                    <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>

            {/* Women Active */}
            <div className="group relative h-96 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${WOMEN_IMAGE})` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              <div className="relative z-10 h-full flex items-end p-8">
                <div className="text-white">
                  <h2 className="text-4xl font-bold mb-4">{t('homepage.categories.women_active_title')}</h2>
                  <p className="text-lg opacity-90 mb-6">{t('homepage.categories.women_active_description')}</p>
                  <button className="group/btn inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                    <FiShoppingBag className="w-4 h-4" />
                    {t('homepage.categories.women_active_cta')}
                    <FiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Casualwear Collection Banner */}
        <section className="relative py-20 mx-4 rounded-3xl overflow-hidden mb-20 shadow-2xl">
          <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${CASUAL_IMAGE})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-pink-900/60 to-orange-900/80"></div>

          <div className="relative z-10 text-white text-center px-4 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              {t('homepage.casualwear_banner.title')}
            </h2>
            <p className="text-xl md:text-2xl font-light mb-4 opacity-90">
              {t('homepage.casualwear_banner.subtitle')}
            </p>
            <p className="text-lg mb-8 opacity-80">
              {t('homepage.casualwear_banner.description')}
            </p>
            <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-700 font-bold rounded-full shadow-2xl hover:shadow-white/25 hover:scale-105 transition-all duration-300 text-lg">
              {t('homepage.casualwear_banner.cta')}
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <FiTrendingUp className="w-4 h-4" />
              {t('homepage.featured_products.section_tag')}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('homepage.featured_products.section_title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('homepage.featured_products.section_description')}
            </p>
          </div>

          {errorFeatured ? (
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center">
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiArrowRight className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {t('homepage.featured_products.error_message.title')}
                  </h3>
                  <p className="text-gray-600 mb-6">{errorFeatured}</p>
                  <button
                      onClick={() => window.location.reload()}
                      className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    {t('homepage.featured_products.error_message.retry_button')}
                  </button>
                </div>
              </div>
          ) : featuredProducts.length > 0 ? (
              <div className="relative">
                {/* Navigation Buttons */}
                <button
                    onClick={() => scrollProducts('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:scale-110 transition-all duration-300 -ml-6"
                    aria-label={t('homepage.featured_products.scroll_left_aria')}
                >
                  <FiChevronLeft className="w-6 h-6" />
                </button>

                <button
                    onClick={() => scrollProducts('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 hover:scale-110 transition-all duration-300 -mr-6"
                    aria-label={t('homepage.featured_products.scroll_right_aria')}
                >
                  <FiChevronRight className="w-6 h-6" />
                </button>

                {/* Products Container */}
                <div
                    ref={productsContainerRef}
                    className="flex overflow-x-auto gap-8 pb-8 px-8 scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {featuredProducts.map((product, index) => (
                      <div
                          key={product.id}
                          className="flex-none w-80 animate-fadeInUp"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'both'
                          }}
                      >
                        <ProductCard product={product} />
                      </div>
                  ))}
                </div>

                {/* Fade Gradients */}
                <div className="absolute left-0 top-0 bottom-8 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-8 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
              </div>
          ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiStar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {t('homepage.featured_products.no_products_message.title')}
                </h3>
                <p className="text-gray-600">
                  {t('homepage.featured_products.no_products_message.description')}
                </p>
              </div>
          )}
        </section>


        <style>{`
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

          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
      
  );
}

export default HomePage;