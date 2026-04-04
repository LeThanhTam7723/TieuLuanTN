import { useEffect, useState } from "react";
import DiscountService from "../../../API/DiscountService";

const emptyForm = {
  code: "",
  discountType: "FIXED_AMOUNT",
  discountName: "",
  description: "",
  discountValue: 0.0,
  minimumOrderAmount: 0.0,
  usageLimit:0,
  active: false,
};

export default function VoucherFormModal({ onClose, onSuccess, voucher}) {
  const [form, setForm] = useState(emptyForm);
  console.log(voucher);
  useEffect(() => {
    if (voucher) {
      setForm({ ...voucher });
    } else {
      setForm(emptyForm);
    }
  }, [voucher]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit voucher:", form);
    const payload = {
      ...form,
      discountValue: Number(form.discountValue),
      minimumOrderAmount: Number(form.minimumOrderAmount),
    };
    console.log("payload:", payload);
    try {
      if(voucher){
        await DiscountService.updateDiscount(voucher.id,payload);
        console.log("update");
      }else{
         await DiscountService.createDiscount(payload);
      }
      onSuccess(); // reload list
      onClose(); 
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white rounded w-[400px] p-6 translate-y-[50px]">
        <h2 className="text-lg font-semibold mb-4">Thêm mã giảm giá</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            className="w-full border p-2 rounded"
            placeholder="Mã giảm giá"
            value={form.code}
            onChange={(e) => {
              const value = e.target.value
                .replace(/\s+/g, "")
                .toUpperCase();

              setForm({ ...form, code: value });
            }}
          />
          <select
            className="w-full border p-2 rounded"
            onChange={e => setForm({ ...form, discountType: e.target.value })}
          >
            <option value="FIXED_AMOUNT">Giảm tiền cố định</option>
            <option value="PERCENTAGE">Giảm %</option>
            <option value="FREE_SHIPPING">Free ship</option>
          </select>
          <input
            className="w-full border p-2 rounded"
            placeholder="TÊN MÃ GIẢM GIÁ"
            value={form.discountName}
            onChange={(e) => {
              setForm({ ...form, discountName: e.target.value });
            }}
          />
          <input
            className="w-full border p-2 rounded"
            placeholder="Mô tả"
            value={form.description}
            onChange={(e) => {
            setForm({ ...form, description: e.target.value });
            }}
          />
         <div className="flex items-center gap-3">
            <label className=" text-sm font-medium text-gray-700">
              Số lượng sử dụng
            </label>
            <input
              type="number"
              className="flex-1 border p-2 rounded"
              value={form.usageLimit}
              onChange={(e) =>
                setForm({ ...form, usageLimit: Number(e.target.value) })
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Giá trị giảm
            </label>
            <input
              type="number"
              className="flex-1 border p-2 rounded"
              value={form.discountValue}
              onChange={(e) =>
                setForm({ ...form, discountValue: Number(e.target.value) })
              }
            />
          </div>

          {/* Đơn tối thiểu */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">
              Đơn tối thiểu
            </label>
            <input
              type="number"
              className="flex-1 border p-2 rounded"
              value={form.minimumOrderAmount}
              onChange={(e) =>
                setForm({
                  ...form,
                  minimumOrderAmount: Number(e.target.value),
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Hoạt động
            </span>

            <button
              type="button"
              onClick={() => setForm({ ...form, active: !form.active })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition
                ${form.active ? "bg-green-500" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition
                  ${form.active ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>


          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Hủy
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
