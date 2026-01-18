import React, {useState, useEffect} from 'react';
import StatusService from '../../../API/StatusService';

const OrderSearchBar = ({onSearch}) => {
    const [keyword, setKeyword] = useState('');
    const [statusId, setStatusId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        const fetchStatuses = async () => {
            try {
                const response = await StatusService.getAllStatuses();
                if (response.code === 0) {
                    setStatuses(response.data);
                } else {
                    console.error("Failed to fetch statuses:", response.message);
                }
            } catch (error) {
                console.error("Error fetching statuses:", error);
            }
        };
        fetchStatuses();
    }, []);

    const handleSearchClick = () => {
        // Gọi onSearch prop với các tham số tìm kiếm
        onSearch({
            keyword: keyword.trim(),
            statusId: statusId ? parseInt(statusId) : null,
            startDate: startDate || null,
            endDate: endDate || null,
        });
    };

    const handleClearFilter = () => {
        setKeyword('');
        setStatusId('');
        setStartDate('');
        setEndDate('');
        // Thực hiện tìm kiếm với các giá trị rỗng để reset
        onSearch({
            keyword: '',
            statusId: null,
            startDate: null,
            endDate: null,
        });
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tìm kiếm & Lọc Đơn hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Keyword Search */}
                <div>
                    <label htmlFor="keyword" className="block text-sm font-medium text-gray-700 mb-1">
                        Từ khóa (ID, Người nhận, SĐT)
                    </label>
                    <input
                        type="text"
                        id="keyword"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Tìm kiếm..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                    </label>
                    <select
                        id="status"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={statusId}
                        onChange={(e) => setStatusId(e.target.value)}
                    >
                        <option value="">Tất cả</option>
                        {statuses.map(status => (
                            <option key={status.id} value={status.id}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Start Date Filter */}
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày đặt từ
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                {/* End Date Filter */}
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày đặt đến
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={handleClearFilter}
                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                    Xóa bộ lọc
                </button>
                <button
                    onClick={handleSearchClick}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                >
                    Tìm kiếm
                </button>
            </div>
        </div>
    );
};

export default OrderSearchBar;