import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Trước
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = currentPage <= 2 ? i : currentPage - 2 + i;
          if (page >= totalPages) return null;

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 border text-sm rounded ${
                currentPage === page
                  ? 'border-gray-800 bg-gray-800 text-white'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page + 1}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="px-3 py-2 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
};

export default Pagination; 