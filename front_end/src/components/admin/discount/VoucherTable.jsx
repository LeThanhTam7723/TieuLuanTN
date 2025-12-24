import VoucherRow from "./VoucherRow";

export default function VoucherTable({ vouchers,onToggleActive,onEdit }) {

  return (
    <div className="bg-white rounded shadow mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 text-left">Mã</th>
            <th className="p-3">Loại</th>
            <th className="p-3">Giá trị</th>
            <th className="p-3">Đơn tối thiểu</th>
            <th className="p-3 text-center">Hoạt động</th>
            <th className="p-3">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map(v => (
            <VoucherRow key={v.id} voucher={v} onToggleActive={onToggleActive} onEdit={onEdit}/>
          ))}
        </tbody> 
      </table>
    </div>
  );
}
