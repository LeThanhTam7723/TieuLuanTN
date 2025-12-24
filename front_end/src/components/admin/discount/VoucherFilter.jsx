export default function VoucherFilter({onAdd}) {
  return (
    <div className="flex items-center justify-between">
      <div className="rounded shadow flex gap-3">
        <input  
          className="border p-2 rounded w-64"
          placeholder="Tìm theo mã..."
        />
        <select className="border p-2 rounded">
          <option value="">Tất cả loại</option>
          <option value="FIXED_AMOUNT">Giảm tiền</option>
          <option value="PERCENTAGE">Giảm %</option>
          <option value="FREE_SHIPPING">Free ship</option>
        </select>
      </div>
      <button
          onClick={onAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
          + Thêm mã
      </button>
    </div>
  );
}
