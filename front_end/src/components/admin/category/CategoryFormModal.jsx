// src/components/admin/category/CategoryFormModal.jsx
import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CategoryInfoForm from './CategoryInfoForm';
import CategoryService from '../../../API/CategoryService';
import GenderService from '../../../API/GenderService';

// Schema validation
const categoryFormSchema = yup.object().shape({
    name: yup.string()
        .required('Tên danh mục là bắt buộc')
        .max(255, 'Tên danh mục không quá 255 ký tự'),
    slug: yup.string()
        .required('Slug là bắt buộc')
        .max(255, 'Slug không quá 255 ký tự'),
    description: yup.string()
        .max(1000, 'Mô tả không quá 1000 ký tự')
        .nullable(),
    parentId: yup.number()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable()
        .typeError('ID danh mục cha phải là số'),
    genderId: yup.number()
        .transform((value, originalValue) => (String(originalValue).trim() === '' ? null : value))
        .nullable()
        .typeError('ID giới tính phải là số'),
    active: yup.boolean().required('Trạng thái hoạt động là bắt buộc'),
});


const CategoryFormModal = ({ title, category, onSubmit, onClose, showCustomMessage }) => {
    const [allCategories, setAllCategories] = useState([]);
    const [genders, setGenders] = useState([]);

    const methods = useForm({
        resolver: yupResolver(categoryFormSchema),
        defaultValues: category ? {
            ...category,
            // Đã sửa lỗi: Truy cập trực tiếp parentId và genderId từ đối tượng category
            parentId: category.parentId || '', // Lấy trực tiếp category.parentId
            genderId: category.genderId || '', // Lấy trực tiếp category.genderId
        } : {
            name: '',
            slug: '',
            description: '',
            parentId: '',
            genderId: '',
            active: true,
        },
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesRes = await CategoryService.getAllCategories({ page: 0, size: 1000 });
                setAllCategories(categoriesRes.data.content);

                const gendersRes = await GenderService.getAllGenders();
                setGenders(gendersRes.data);

                if (category) {
                    console.log("Category object received in CategoryFormModal:", category);
                    // Đã sửa lỗi: Log trực tiếp category.parentId và category.genderId
                    console.log("Category parentId from object (direct access):", category.parentId);
                    console.log("Category genderId from object (direct access):", category.genderId);

                    reset({
                        ...category,
                        // Đã sửa lỗi: Truy cập trực tiếp parentId và genderId từ đối tượng category
                        parentId: category.parentId || '',
                        genderId: category.genderId || '',
                    });
                    console.log("Form reset with category data.");
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                showCustomMessage("Không thể tải dữ liệu cần thiết.", "error");
            }
        };
        fetchData();
    }, [category, reset, showCustomMessage]);

    const handleSubmitMainCategory = (data) => {
        // Xử lý triệt để parentId và genderId
        let finalParentId = null;
        // Nếu data.parentId không rỗng, không phải null và không phải 0, thì chuyển đổi sang số
        if (data.parentId !== '' && data.parentId !== null && data.parentId !== 0) {
            finalParentId = Number(data.parentId);
        }

        let finalGenderId = null;
        // Nếu data.genderId không rỗng, không phải null và không phải 0, thì chuyển đổi sang số
        if (data.genderId !== '' && data.genderId !== null && data.genderId !== 0) {
            finalGenderId = Number(data.genderId);
        }

        const dataToSubmit = {
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            parentId: finalParentId, // Sử dụng giá trị đã xử lý
            genderId: finalGenderId, // Sử dụng giá trị đã xử lý
            active: data.active,
        };
        console.log("Data to submit from CategoryFormModal (FINAL CHECK):", dataToSubmit);
        onSubmit(category ? category.id : null, dataToSubmit);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl overflow-y-auto max-h-[95vh] transform transition-all duration-300 scale-100 opacity-100">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{title}</h2>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleSubmitMainCategory)}>
                        <CategoryInfoForm allCategories={allCategories} genders={genders} />

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
                            >
                                {category ? 'Cập nhật' : 'Thêm danh mục'}
                            </button>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
};

export default CategoryFormModal;
