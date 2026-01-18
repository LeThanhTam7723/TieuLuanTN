// src/components/PriceFilter.jsx
import React, {useState, useContext, useEffect} from 'react'; // Import useContext, useEffect
import {useTranslation} from "react-i18next";
import { CurrencyContext } from '../../contexts/CurrencyContext.jsx'; // Import CurrencyContext

const PriceFilter = ({priceRange, onPriceRangeChange, onPriceFilter}) => {
    const {t} = useTranslation();
    const [error, setError] = useState('');
    // Lấy hàm và tiền tệ từ CurrencyContext
    const { convertAndGetDisplayPrice, currentCurrency, exchangeRates, isLoadingRates } = useContext(CurrencyContext);

    // useEffect để cập nhật quickPriceRanges khi tiền tệ thay đổi hoặc tỷ giá tải xong
    // Điều này đảm bảo nhãn "k" được chuyển đổi đúng
    const [displayQuickRanges, setDisplayQuickRanges] = useState([]);

    useEffect(() => {
        if (!isLoadingRates) { // Chỉ cập nhật khi tỷ giá đã tải xong
            const updatedRanges = [
                {label: t('product_list.price_filter.below_300k'), min: '0', max: '300000'},
                {label: t('product_list.price_filter.300k_500k'), min: '300000', max: '500000'},
                {label: t('product_list.price_filter.500k_1m'), min: '500000', max: '1000000'},
                {label: t('product_list.price_filter.above_1m'), min: '1000000', max: ''}
            ].map(range => {
                // Nếu currentCurrency là USD, chuyển đổi các giá trị min/max từ VND sang USD
                if (currentCurrency.toUpperCase() === 'USD') {
                    // Lấy tỷ giá 1 USD = X VND
                    const vndToUsdRate = exchangeRates['vnd'];
                    if (vndToUsdRate) {
                        return {
                            label: range.label, // Giữ nguyên nhãn ngôn ngữ
                            min: range.min ? String(Number(range.min) / vndToUsdRate) : '',
                            max: range.max ? String(Number(range.max) / vndToUsdRate) : ''
                        };
                    }
                }
                return range; // Giữ nguyên nếu là VND hoặc không có tỷ giá
            });
            setDisplayQuickRanges(updatedRanges);
        }
    }, [currentCurrency, exchangeRates, isLoadingRates, t]); // Dependencies quan trọng

    const validatePrice = (min, max) => {
        if (min === '' && max === '') { // Cho phép cả hai rỗng để xóa bộ lọc
            setError('');
            return true;
        }

        const numMin = Number(min);
        const numMax = Number(max);

        if (min && isNaN(numMin)) {
            setError(t('product_list.price_filter.invalid_min_price'));
            return false;
        }
        if (max && isNaN(numMax)) {
            setError(t('product_list.price_filter.invalid_max_price'));
            return false;
        }

        if (min && numMin < 0) {
            setError(t('product_list.price_filter.negative_price_error'));
            return false;
        }
        if (max && numMax < 0) {
            setError(t('product_list.price_filter.negative_price_error'));
            return false;
        }
        if (min !== '' && max !== '' && numMin > numMax) {
            setError(t('product_list.price_filter.min_greater_than_max_error'));
            return false;
        }

        setError('');
        return true;
    };

    const handlePriceChange = (field, value) => {
        const newPriceRange = {...priceRange, [field]: value};
        onPriceRangeChange(newPriceRange);
        validatePrice(newPriceRange.min, newPriceRange.max);
    };

    const handleApplyFilter = () => {
        if (validatePrice(priceRange.min, priceRange.max)) {
            // Giá trị gửi đi backend PHẢI luôn là VND
            let minPriceToSend = priceRange.min ? Number(priceRange.min) : '';
            let maxPriceToSend = priceRange.max ? Number(priceRange.max) : '';

            if (currentCurrency.toUpperCase() === 'USD' && !isLoadingRates) {
                const vndToUsdRate = exchangeRates['vnd'];
                if (vndToUsdRate) {
                    minPriceToSend = minPriceToSend ? Math.round(minPriceToSend * vndToUsdRate) : '';
                    maxPriceToSend = maxPriceToSend ? Math.round(maxPriceToSend * vndToUsdRate) : '';
                }
            }
            onPriceFilter(minPriceToSend, maxPriceToSend);
        }
    };

    const handleQuickFilter = (min, max) => {
        // Giá trị gửi đi backend PHẢI luôn là VND.
        // Quick ranges đã được tính toán lại trong useEffect, nên min/max ở đây là theo currentCurrency.
        // Cần chuyển đổi ngược lại về VND nếu currentCurrency là USD.
        let minPriceToSend = min ? Number(min) : '';
        let maxPriceToSend = max ? Number(max) : '';

        if (currentCurrency.toUpperCase() === 'USD' && !isLoadingRates) {
            const vndToUsdRate = exchangeRates['vnd'];
            if (vndToUsdRate) {
                minPriceToSend = minPriceToSend ? Math.round(minPriceToSend * vndToUsdRate) : '';
                maxPriceToSend = maxPriceToSend ? Math.round(maxPriceToSend * vndToUsdRate) : '';
            }
        }
        onPriceRangeChange({min: min, max: max}); // Cập nhật input hiển thị theo tiền tệ hiện tại
        onPriceFilter(minPriceToSend, maxPriceToSend); // Gửi giá trị VND cho backend
    };

    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                {t("product_list.price")} ({currentCurrency.toUpperCase()}) {/* Hiển thị tiền tệ */}
            </h3>

            {/* Quick Price Filters */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {isLoadingRates ? (
                    <div className="col-span-2 text-center text-gray-500">{t('product_list.price_filter.loading_rates')}</div>
                ) : (
                    displayQuickRanges.map((range, index) => (
                        <button
                            key={index}
                            onClick={() => handleQuickFilter(range.min, range.max)}
                            className={`px-3 py-2 text-sm border rounded transition-colors duration-200 ${
                                // So sánh giá trị hiển thị để active button
                                priceRange.min === range.min && priceRange.max === range.max
                                    ? 'border-gray-800 bg-gray-800 text-white'
                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                            }`}
                        >
                            {range.label} {/* Nhãn đã được dịch */}
                        </button>
                    ))
                )}
            </div>

            {/* Manual Price Inputs */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="flex-1">
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    onClick={handleApplyFilter}
                    disabled={!!error || isLoadingRates} // Disable khi đang tải tỷ giá
                    className="w-full px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t("product_list.apply_button")}
                </button>
            </div>
        </div>
    );
};

export default PriceFilter;