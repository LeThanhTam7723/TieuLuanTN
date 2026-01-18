// src/components/common/CustomMessageBox.jsx
import React from 'react';

const CustomMessageBox = ({ message, type }) => {
    if (!message) return null;

    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg text-white ${bgColor} z-50`}>
            {message}
        </div>
    );
};

export default CustomMessageBox;
