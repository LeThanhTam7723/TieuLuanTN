import React, { createContext, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

// Tạo Context
export const CurrencyContext = createContext();

// Provider Component
export const CurrencyProvider = ({ children }) => {
    const { i18n } = useTranslation();

    // currentCurrency: Tiền tệ đang được chọn, mặc định là VND
    const [currentCurrency, setCurrentCurrency] = useState(() => {
        return localStorage.getItem('selectedCurrency') || 'VND';
    });

    // exchangeRates: Lưu trữ tỷ giá. Key là tiền tệ (lowercase), value là tỷ giá so với USD.
    // Ví dụ: { 'usd': 1, 'vnd': 25000, 'eur': 0.9, ... } Nghĩa là 1 USD = 25000 VND, 1 USD = 0.9 EUR
    const [exchangeRates, setExchangeRates] = useState({
        'usd': 1,
        'vnd': 25000, // Tỷ giá mặc định ban đầu: 1 USD = 25000 VND
    });

    // Trạng thái tải tỷ giá
    const [isLoadingRates, setIsLoadingRates] = useState(true);
    const [errorLoadingRates, setErrorLoadingRates] = useState(false);

    /**
     * Chuyển đổi giá trị từ tiền tệ gốc (VND) sang tiền tệ hiện tại đã chọn.
     * @param {number} priceInBaseCurrency - Giá trị tiền sản phẩm từ database (VND).
     * @returns {number} Giá trị đã chuyển đổi.
     */
    const convertAndGetDisplayPrice = (priceInBaseCurrency) => {
        // Nếu tiền tệ hiện tại là VND, không cần chuyển đổi, trả về giá gốc.
        if (currentCurrency.toUpperCase() === 'VND') {
            return priceInBaseCurrency;
        }

        // Lấy tỷ giá 1 USD = X VND (X = exchangeRates.vnd)
        const vndToUsdRateFromApi = exchangeRates['vnd'];

        if (!vndToUsdRateFromApi) {
            console.warn("Không có tỷ giá VND -> USD. Không thể chuyển đổi.");
            return priceInBaseCurrency; // Fallback: trả về giá gốc VND
        }

        // Bước 1: Chuyển đổi từ VND sang USD (giá VND / X VND/USD)
        const priceInUSD = priceInBaseCurrency / vndToUsdRateFromApi;

        // Bước 2: Chuyển đổi từ USD sang tiền tệ hiện tại (ví dụ: USD).
        // currentCurrency.toLowerCase() sẽ là 'usd'
        const targetCurrencyRateVsUsd = exchangeRates[currentCurrency.toLowerCase()];

        if (!targetCurrencyRateVsUsd) {
            console.warn(`Không tìm thấy tỷ giá cho ${currentCurrency}. Trả về giá USD đã chuyển đổi.`);
            return priceInUSD; // Fallback: trả về giá USD đã chuyển đổi
        }

        // Nếu currentCurrency là USD, targetCurrencyRateVsUsd sẽ là 1
        return priceInUSD * targetCurrencyRateVsUsd;
    };

    /**
     * Định dạng số thành chuỗi tiền tệ theo chuẩn quốc tế.
     * @param {number} amount - Số tiền cần định dạng.
     * @param {string} currencyCode - Mã tiền tệ (ví dụ: 'VND', 'USD'). Mặc định là currentCurrency.
     * @returns {string} Chuỗi tiền tệ đã định dạng.
     */
    const formatCurrency = (amount, currencyCode = currentCurrency) => {
        try {
            // Sử dụng ngôn ngữ định dạng dựa trên ngôn ngữ i18n
            const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
            const upperCaseCurrencyCode = currencyCode.toUpperCase();

            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: upperCaseCurrencyCode,
                // VND không cần số thập phân, các loại khác có 2 chữ số
                minimumFractionDigits: upperCaseCurrencyCode === 'VND' ? 0 : 2,
                maximumFractionDigits: upperCaseCurrencyCode === 'VND' ? 0 : 2
            }).format(amount);
        } catch (error) {
            console.error("Lỗi khi định dạng tiền tệ:", error);
            return `${amount} ${currencyCode.toUpperCase()}`; // Fallback nếu có lỗi
        }
    };

    /**
     * Thay đổi tiền tệ hiện tại.
     * @param {string} currencyCode - Mã tiền tệ mới (ví dụ: 'VND', 'USD').
     */
    const changeCurrency = (currencyCode) => {
        const lowerCaseCode = currencyCode.toLowerCase();
        // Chỉ thay đổi nếu tỷ giá cho tiền tệ đó đã có
        if (exchangeRates[lowerCaseCode]) {
            setCurrentCurrency(currencyCode.toUpperCase());
            localStorage.setItem('selectedCurrency', currencyCode.toUpperCase());
            toast.success(`Tiền tệ đã được đổi sang ${currencyCode.toUpperCase()}`);
        } else {
            toast.error(`Không thể chuyển sang tiền tệ ${currencyCode.toUpperCase()}. Tỷ giá chưa được tải hoặc không hỗ trợ.`);
        }
    };

    // useEffect: Fetch tỷ giá hối đoái từ API khi component mount
    useEffect(() => {
        const fetchExchangeRates = async () => {
            setIsLoadingRates(true);
            setErrorLoadingRates(false);
            try {
                // Fetch tỷ giá với USD là tiền tệ cơ sở.
                // API trả về: { "usd": { "vnd": 24000, "eur": 0.9, ... } }
                const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                const ratesUsdAsBase = data.usd;

                const newRates = {
                    'usd': 1, // Tỷ giá của USD so với chính nó
                    'vnd': ratesUsdAsBase.vnd, // Tỷ giá 1 USD = X VND
                    'eur': ratesUsdAsBase.eur || null,
                    'jpy': ratesUsdAsBase.jpy || null,
                    // Thêm các tiền tệ khác bạn muốn hỗ trợ ở đây
                };

                setExchangeRates(newRates);
                console.log("Tỷ giá hối đoái đã được cập nhật:", newRates);
                toast.success("Tỷ giá hối đoái đã được tải mới nhất.");

            } catch (error) {
                console.error("Lỗi khi tải tỷ giá hối đoái:", error);
                setErrorLoadingRates(true);
                toast.error("Không thể tải tỷ giá hối đoái mới nhất. Sử dụng tỷ giá mặc định.");
            } finally {
                setIsLoadingRates(false);
            }
        };

        fetchExchangeRates();
        // Thiết lập interval để fetch định kỳ (ví dụ: mỗi 6 giờ)
        const intervalId = setInterval(fetchExchangeRates, 21600000);
        return () => clearInterval(intervalId); // Cleanup interval khi unmount
    }, []);

    // useEffect: Tự động đổi tiền tệ theo ngôn ngữ (nếu cần)
    useEffect(() => {
        const handleLanguageChange = (lng) => {
            // Chỉ đổi nếu tỷ giá đã load và không có lỗi
            if (!isLoadingRates && !errorLoadingRates) {
                if (lng === 'vi' && currentCurrency.toUpperCase() !== 'VND') {
                    changeCurrency('VND');
                } else if (lng === 'en' && currentCurrency.toUpperCase() !== 'USD') {
                    changeCurrency('USD');
                }
            }
        };
        i18n.on('languageChanged', handleLanguageChange);
        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n, currentCurrency, isLoadingRates, errorLoadingRates]);

    return (
        <CurrencyContext.Provider value={{
            currentCurrency,
            exchangeRates, // Có thể expose exchangeRates nếu cần cho mục đích debug hoặc hiển thị
            convertAndGetDisplayPrice, // Đổi tên hàm cho rõ ràng hơn
            formatCurrency,
            changeCurrency,
            isLoadingRates,
            errorLoadingRates
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};