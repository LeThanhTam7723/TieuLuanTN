import { formatCurrency } from "../../../utils/format";

export default function VoucherRow({ voucher, onToggleActive , onEdit}) {
  return (
    <tr className="border-t border-gray-200 hover:bg-gray-50">
      <td className="p-3 font-medium">{voucher.code}</td>
      <td className="p-3 text-center">{voucher.discountType}</td>
      <td className="p-3 text-center">
        {voucher.discountType === "PERCENTAGE"
          ? `${voucher.discountValue * 100}%`
          : formatCurrency(voucher.discountValue)}
      </td>
      <td className="p-3 text-center">
        {formatCurrency(voucher.minimumOrderAmount)}
      </td>
      <td className="p-3 text-center">
        <button
          onClick={() => onToggleActive(voucher.id)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition
            ${voucher.active ? "bg-green-500" : "bg-gray-300"}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition
              ${voucher.active ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>

        <div className="text-xs mt-1 text-gray-600">
          {voucher.active ? "Có" : "Không"}
        </div>
      </td>
      <td className="p-3 text-center space-x-2">
        <button className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
        onClick={() => onEdit(voucher)}
        >Sửa</button>
        <button className="text-red-600 hover:text-red-800 px-2 py-1 rounded-md bg-red-50 hover:bg-red-100 transition-colors duration-200">Xóa</button>
      </td>
    </tr>
  );
}
