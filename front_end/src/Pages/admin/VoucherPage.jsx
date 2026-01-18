import { useEffect, useState } from "react";
import VoucherFilter from "../../components/admin/discount/VoucherFilter";
import VoucherTable from "../../components/admin/discount/VoucherTable";
import VoucherFormModal from "../../components/admin/discount/VoucherFormModal";
import DiscountService from "../../API/DiscountService";
import { Spin } from "antd";


export default function VoucherPage() {
  const [vouchers, setVouchers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingVoucher, setEditingVoucher] = useState(null);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    const data = await DiscountService.getAllDiscounts();
    setVouchers(data.result);
    setLoading(false);
  };

  const handleToggleActive = (id) => {
    setVouchers(prev =>
      prev.map(v =>
        v.id === id ? { ...v, active: !v.active } : v
      )
    );

    // Sau này gắn API:
    // DiscountService.toggleActive(id);
  };
   const handleAdd = () => {
    setEditingVoucher(null);
    setOpenModal(true);
  };

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher);
    setOpenModal(true); 
  };



  return (
    <div style={{ padding: 24 }}>
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Quản lý mã giảm</h1>
      <VoucherFilter onAdd={handleAdd}/>
      {loading ? (<Spin size="large" />) 
        : (<VoucherTable vouchers={vouchers} onToggleActive={handleToggleActive} onEdit={handleEdit}/>)
      }

      {openModal && (
        <VoucherFormModal
          voucher={editingVoucher}
          onClose={() => setOpenModal(false)}
          onSuccess={loadVouchers}
        />
      )}
    </div>
  );
}
