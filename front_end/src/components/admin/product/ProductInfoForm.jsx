import React from 'react';
import {useFormContext} from 'react-hook-form';

const ProductInfoForm = ({brands, categories, genders}) => {
  const {register, formState: {errors}, watch} = useFormContext(); // Thêm watch để theo dõi giá trị categoryIds

  const watchedCategoryIds = watch('categoryIds'); // Theo dõi giá trị của categoryIds

  return (
      <>
        <h3 className="text-2xl font-semibold mb-4 text-gray-700 border-b pb-2">Thông tin sản phẩm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Tên sản phẩm */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
              Tên sản phẩm: <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                id="name"
                {...register('name')}
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập tên sản phẩm"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          {/* Slug */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="slug">
              Slug: <span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                id="slug"
                {...register('slug')}
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.slug ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Nhập slug (ví dụ: san-pham-moi)"
            />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>
          {/* Giá gốc */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="basePrice">
              Giá gốc: <span className="text-red-500">*</span>
            </label>
            <input
                type="number"
                id="basePrice"
                step="0.01"
                {...register('basePrice')}
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.basePrice ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ví dụ: 99.99"
            />
            {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
          </div>
          {/* Thương hiệu */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="brandId">
              Thương hiệu: <span className="text-red-500">*</span>
            </label>
            <select
                id="brandId"
                {...register('brandId')}
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.brandId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
              ))}
            </select>
            {errors.brandId && <p className="text-red-500 text-xs mt-1">{errors.brandId.message}</p>}
          </div>
          {/* Giới tính */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="genderId">
              Giới tính: <span className="text-red-500">*</span>
            </label>
            <select
                id="genderId"
                {...register('genderId')}
                className={`shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${errors.genderId ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Chọn giới tính</option>
              {genders.map((gender) => (
                  <option key={gender.id} value={gender.id}>
                    {gender.name}
                  </option>
              ))}
            </select>
            {errors.genderId && <p className="text-red-500 text-xs mt-1">{errors.genderId.message}</p>}
          </div>
          {/* Danh mục (Sử dụng Checkbox) */}
          <div>
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Danh mục (chọn nhiều): <span className="text-red-500">*</span>
            </label>
            <div
                className={`border rounded-lg p-3 max-h-40 overflow-y-auto ${errors.categoryIds ? 'border-red-500' : 'border-gray-300'}`}>
              {categories.length > 0 ? (
                  categories.map((category) => {
                    const isChecked = watchedCategoryIds?.includes(String(category.id)); // <-- THAY ĐỔI TẠI ĐÂY
                    return (
                        <div key={category.id} className="flex items-center mb-2">
                          <input
                              type="checkbox"
                              id={`category-${category.id}`}
                              value={category.id} // Giá trị của checkbox vẫn là số, không sao
                              {...register('categoryIds')}
                              checked={isChecked}
                              className="form-checkbox h-4 w-4 text-blue-600 rounded"
                          />
                          <label htmlFor={`category-${category.id}`} className="ml-2 text-gray-700 text-sm">
                            {category.name}
                          </label>
                        </div>
                    );
                  })
              ) : (
                  <p className="text-gray-500 text-sm">Không có danh mục nào để chọn.</p>
              )}
            </div>
            {errors.categoryIds && <p className="text-red-500 text-xs mt-1">{errors.categoryIds.message}</p>}
          </div>
        </div>

        {/* Mô tả sản phẩm */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="description">
            Mô tả:
          </label>
          <textarea
              id="description"
              {...register('description')}
              rows="5"
              className="shadow-sm appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 border-gray-300"
              placeholder="Nhập mô tả chi tiết sản phẩm"
          ></textarea>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Checkbox Nổi bật */}
        <div className="flex items-center mb-4">
          <input
              type="checkbox"
              id="featured"
              {...register('featured')}
              className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label className="text-gray-700 text-base font-semibold" htmlFor="featured">
            Sản phẩm nổi bật
          </label>
        </div>

        {/* Checkbox Hoạt động */}
        <div className="flex items-center mb-8">
          <input
              type="checkbox"
              id="active"
              {...register('active')}
              className="mr-2 h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label className="text-gray-700 text-base font-semibold" htmlFor="active">
            Sản phẩm hoạt động
          </label>
        </div>
      </>
  );
};

export default ProductInfoForm;
