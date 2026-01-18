import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import SizeService from '../../../API/SizeService';
import ColorService from '../../../API/ColorService';
import ProductVariantService from '../../../API/ProductVariantService';

// Schema validation cho biến thể
const variantSchema = yup.object().shape({
    id: yup.number().nullable(), // ID có thể có hoặc không (cho biến thể mới)
    sizeId: yup.number().required('Size là bắt buộc').typeError('Size ID phải là số').min(1, 'Size ID không hợp lệ'),
    colorId: yup.number().required('Màu sắc là bắt buộc').typeError('Color ID phải là số').min(1, 'Color ID không hợp lệ'),
    sku: yup.string().required('SKU là bắt buộc').max(50, 'SKU không quá 50 ký tự'),
    price: yup.number()
        .required('Giá là bắt buộc')
        .typeError('Giá phải là số')
        .min(0.01, 'Giá phải lớn hơn 0'),
    stockQuantity: yup.number()
        .required('Số lượng tồn kho là bắt buộc')
        .typeError('Số lượng tồn kho phải là số')
        .min(0, 'Số lượng tồn kho không được âm'),
    weightInKg: yup.number().nullable().min(0, 'Cân nặng không được âm').typeError('Cân nặng phải là số'),
    active: yup.boolean().required(),
});

const productVariantsSchema = yup.object().shape({
    variants: yup.array().of(variantSchema).min(1, 'Phải có ít nhất một biến thể').required('Biến thể là bắt buộc'),
});


const ProductVariantFormModal = ({ productId, onClose, showCustomMessage }) => {
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialVariantIds, setInitialVariantIds] = useState(new Set()); // Lưu trữ IDs biến thể ban đầu

    const methods = useForm({
        resolver: yupResolver(productVariantsSchema),
        defaultValues: {
            variants: [{ sizeId: '', colorId: '', sku: '', price: '', stockQuantity: '', weightInKg: '', active: true }],
        },
    });

    const { register, control, handleSubmit, reset, formState: { errors } } = methods;
    const { fields: variantFields, append: appendVariant, remove: removeVariant } = useFieldArray({
        control,
        name: "variants"
    });

    // Fetch existing variants and dropdown data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [sizeRes, colorRes] = await Promise.all([
                    SizeService.getAllSizes(),
                    ColorService.getAllColors(),
                ]);
                setSizes(sizeRes.data);
                setColors(colorRes.data);

                if (productId) {
                    const variants = await ProductVariantService.getVariantsByProductId(productId);
                    console.log("Variants fetched for product ID", productId, ":", variants);
                    if (variants && variants.length > 0) {
                        const mappedVariants = variants.map(v => ({
                            id: v.id,
                            sizeId: v.size?.id || '',
                            colorId: v.color?.id || '',
                            sku: v.sku,
                            price: v.price,
                            stockQuantity: v.stockQuantity,
                            weightInKg: v.weightInKg,
                            active: v.active,
                        }));
                        console.log("Mapped variants for form:", mappedVariants);
                        reset({ variants: mappedVariants });
                        setInitialVariantIds(new Set(mappedVariants.map(v => v.id)));
                    } else {
                        reset({
                            variants: [{ sizeId: '', colorId: '', sku: '', price: '', stockQuantity: '', weightInKg: '', active: true }],
                        });
                        setInitialVariantIds(new Set());
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu biến thể/dropdown:", error);
                showCustomMessage("Không thể tải dữ liệu biến thể hoặc tùy chọn.", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [productId, reset, showCustomMessage]);

    const onSubmitVariants = async (data) => {
        if (!productId) {
            showCustomMessage("Vui lòng tạo sản phẩm chính trước khi quản lý biến thể.", "error");
            return;
        }

        const currentVariantIds = new Set(data.variants.filter(v => v.id).map(v => v.id));
        const variantsToDelete = [...initialVariantIds].filter(id => !currentVariantIds.has(id));

        try {
            // Xóa các biến thể đã bị loại bỏ khỏi form
            for (const variantId of variantsToDelete) {
                await ProductVariantService.deleteVariant(variantId);
            }

            // Tạo hoặc cập nhật các biến thể còn lại
            for (const variant of data.variants) {
                const variantPayload = {
                    sizeId: Number(variant.sizeId),
                    colorId: Number(variant.colorId),
                    sku: variant.sku,
                    price: parseFloat(variant.price),
                    stockQuantity: parseInt(variant.stockQuantity, 10),
                    weightInKg: variant.weightInKg === '' ? null : parseFloat(variant.weightInKg), // Chuyển rỗng thành null khi gửi đi
                    active: variant.active,
                    productId: productId, // Đảm bảo productId được gửi cùng
                };

                if (variant.id) {
                    // Cập nhật biến thể hiện có
                    await ProductVariantService.updateVariant(variant.id, variantPayload);
                } else {
                    // Tạo biến thể mới
                    await ProductVariantService.createVariant(productId, variantPayload);
                }
            }

            showCustomMessage("Biến thể sản phẩm đã được cập nhật thành công!", "success");
            onClose(); // Close modal on success
        } catch (error) {
            console.error("Lỗi khi lưu biến thể:", error);
            showCustomMessage("Lỗi khi lưu biến thể. Vui lòng thử lại.", "error");
        }
    };

    if (loading) {
        return <div className="text-center py-4">Đang tải biến thể...</div>;
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-4xl overflow-y-auto max-h-[95vh] transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Quản lý biến thể sản phẩm</h2>
                {productId ? (
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmitVariants)}>
                            <div className="mt-4">
                                <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Biến thể sản phẩm <span className="text-red-500">*</span></h3>
                                {variantFields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border rounded-md bg-gray-50">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`variants[${index}].sizeId`}>
                                                Size <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id={`variants[${index}].sizeId`}
                                                {...register(`variants.${index}.sizeId`)}
                                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.sizeId ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Chọn Size</option>
                                                {sizes.map((size) => (
                                                    <option key={size.id} value={size.id}>{size.name}</option>
                                                ))}
                                            </select>
                                            {errors.variants?.[index]?.sizeId && <p className="text-red-500 text-xs mt-1">{errors.variants[index].sizeId.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`variants[${index}].colorId`}>
                                                Màu sắc <span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                id={`variants[${index}].colorId`}
                                                {...register(`variants.${index}.colorId`)}
                                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.colorId ? 'border-red-500' : 'border-gray-300'}`}
                                            >
                                                <option value="">Chọn Màu</option>
                                                {colors.map((color) => (
                                                    <option key={color.id} value={color.id}>{color.name}</option>
                                                ))}
                                            </select>
                                            {errors.variants?.[index]?.colorId && <p className="text-red-500 text-xs mt-1">{errors.variants[index].colorId.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`variants[${index}].sku`}>
                                                SKU <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id={`variants[${index}].sku`}
                                                type="text"
                                                {...register(`variants.${index}.sku`)}
                                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.sku ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="SKU"
                                            />
                                            {errors.variants?.[index]?.sku && <p className="text-red-500 text-xs mt-1">{errors.variants[index].sku.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`variants[${index}].price`}>
                                                Giá biến thể <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id={`variants[${index}].price`}
                                                type="number"
                                                step="0.01"
                                                {...register(`variants.${index}.price`)}
                                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.price ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Giá"
                                            />
                                            {errors.variants?.[index]?.price && <p className="text-red-500 text-xs mt-1">{errors.variants[index].price.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`variants[${index}].stockQuantity`}>
                                                Số lượng tồn kho <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id={`variants[${index}].stockQuantity`}
                                                type="number"
                                                {...register(`variants.${index}.stockQuantity`)}
                                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.stockQuantity ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Số lượng"
                                            />
                                            {errors.variants?.[index]?.stockQuantity && <p className="text-red-500 text-xs mt-1">{errors.variants[index].stockQuantity.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor={`variants[${index}].weightInKg`}>
                                                Cân nặng (kg)
                                            </label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                {...register(`variants.${index}.weightInKg`)}
                                                className={`shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.variants?.[index]?.weightInKg ? 'border-red-500' : 'border-gray-300'}`}
                                                placeholder="Cân nặng"
                                            />
                                            {errors.variants?.[index]?.weightInKg && <p className="text-red-500 text-xs mt-1">{errors.variants[index].weightInKg.message}</p>}
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    {...register(`variants.${index}.active`)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <span className="ml-2 text-gray-700">Hoạt động</span>
                                            </label>
                                        </div>
                                        {variantFields.length > 1 && (
                                            <div className="md:col-span-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                >
                                                    Xóa biến thể
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => appendVariant({ sizeId: '', colorId: '', sku: '', price: '', stockQuantity: '', weightInKg: '', active: true })}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
                                >
                                    Thêm biến thể
                                </button>
                                {errors.variants && <p className="text-red-500 text-xs mt-1">{errors.variants.message}</p>}
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Lưu biến thể
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                ) : (
                    <p className="text-center text-gray-600">Vui lòng chọn một sản phẩm để quản lý biến thể.</p>
                )}
            </div>
        </div>
    );
};

export default ProductVariantFormModal;
