import React from 'react';
import {useTranslation} from "react-i18next";

const SizeFilter = ({sizes, selectedSizes, onSizeSelect}) => {
    const {t} = useTranslation();
    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                {t("product_list.size")}
            </h3>
            <div className="grid grid-cols-4 gap-2">
                {sizes.map((size) => (
                    <button
                        key={size.id}
                        onClick={() => onSizeSelect(size.id)}
                        className={`px-3 py-2 text-sm border rounded ${
                            selectedSizes.includes(size.id)
                                ? 'border-gray-800 bg-gray-800 text-white'
                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        } transition-colors duration-200`}
                    >
                        {size.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SizeFilter; 