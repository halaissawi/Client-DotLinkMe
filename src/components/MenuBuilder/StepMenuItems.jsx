import React from "react";
import { Plus, Trash2, Utensils } from "lucide-react";

export default function StepMenuItems({ formData, updateFormData }) {
  const addCategory = () => {
    const newCategories = [
      ...(formData.categories || []),
      { id: Date.now(), name: "", items: [] },
    ];
    updateFormData({ categories: newCategories });
  };

  const removeCategory = (categoryId) => {
    const newCategories = formData.categories.filter((cat) => cat.id !== categoryId);
    updateFormData({ categories: newCategories });
  };

  const updateCategory = (categoryId, name) => {
    const newCategories = formData.categories.map((cat) =>
      cat.id === categoryId ? { ...cat, name } : cat
    );
    updateFormData({ categories: newCategories });
  };

  const addItem = (categoryId) => {
    const newCategories = formData.categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            items: [
              ...cat.items,
              { 
                id: Date.now(), 
                name: "", 
                price: "", 
                description: "",
                image: null,
                tags: []
              },
            ],
          }
        : cat
    );
    updateFormData({ categories: newCategories });
  };

  const removeItem = (categoryId, itemId) => {
    const newCategories = formData.categories.map((cat) =>
      cat.id === categoryId
        ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
        : cat
    );
    updateFormData({ categories: newCategories });
  };

  const updateItem = (categoryId, itemId, field, value) => {
    const newCategories = formData.categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId ? { ...item, [field]: value } : item
            ),
          }
        : cat
    );
    updateFormData({ categories: newCategories });
  };

  const toggleItemTag = (categoryId, itemId, tag) => {
    const newCategories = formData.categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            items: cat.items.map((item) => {
              if (item.id === itemId) {
                const tags = item.tags || [];
                const newTags = tags.includes(tag)
                  ? tags.filter(t => t !== tag)
                  : [...tags, tag];
                return { ...item, tags: newTags };
              }
              return item;
            }),
          }
        : cat
    );
    updateFormData({ categories: newCategories });
  };

  const dietaryTags = [
    { id: "vegetarian", label: "🌱 Vegetarian", color: "green" },
    { id: "vegan", label: "🥬 Vegan", color: "emerald" },
    { id: "gluten-free", label: "🌾 Gluten-Free", color: "amber" },
    { id: "spicy", label: "🌶️ Spicy", color: "red" },
    { id: "popular", label: "⭐ Popular", color: "yellow" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Items</h2>
        <p className="text-gray-600">Add your delicious dishes organized by category</p>
      </div>

      {/* Add Category Button */}
      <button
        type="button"
        onClick={addCategory}
        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-[#f2a91d] hover:bg-[#f2a91d]/5 transition-all flex items-center justify-center gap-2 font-semibold text-gray-700"
      >
        <Plus className="w-5 h-5" />
        Add Category
      </button>

      {/* Categories */}
      <div className="space-y-6">
        {formData.categories && formData.categories.map((category) => (
          <div key={category.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
            {/* Category Header */}
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={category.name || ""}
                onChange={(e) => updateCategory(category.id, e.target.value)}
                placeholder="Category name (e.g., Appetizers, Main Course)"
                className="flex-1 px-4 py-3 bg-white rounded-xl border-2 border-gray-300 focus:border-[#f2a91d] focus:ring-4 focus:ring-[#f2a91d]/10 outline-none transition-all font-bold text-lg"
              />
              <button
                type="button"
                onClick={() => addItem(category.id)}
                className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl"
                title="Add Item"
              >
                <Plus className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => removeCategory(category.id)}
                className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-xl"
                title="Remove Category"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="space-y-4">
              {category.items && category.items.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-xl border-2 border-gray-100 hover:border-[#f2a91d]/30 transition-all space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Item Name */}
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        value={item.name || ""}
                        onChange={(e) => updateItem(category.id, item.id, "name", e.target.value)}
                        placeholder="Dish name"
                        className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border-2 border-transparent focus:bg-white focus:border-[#f2a91d] outline-none transition-all font-semibold"
                      />
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price || ""}
                          onChange={(e) => updateItem(category.id, item.id, "price", e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-4 py-2.5 bg-gray-50 rounded-lg border-2 border-transparent focus:bg-white focus:border-[#f2a91d] outline-none transition-all font-bold text-[#f2a91d]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(category.id, item.id)}
                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <textarea
                    value={item.description || ""}
                    onChange={(e) => updateItem(category.id, item.id, "description", e.target.value)}
                    placeholder="Description (optional)"
                    rows={2}
                    className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border-2 border-transparent focus:bg-white focus:border-[#f2a91d] outline-none transition-all text-sm text-gray-600"
                  />

                  {/* Dietary Tags */}
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {dietaryTags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => toggleItemTag(category.id, item.id, tag.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            item.tags && item.tags.includes(tag.id)
                              ? `bg-${tag.color}-100 text-${tag.color}-700 border-2 border-${tag.color}-300`
                              : 'bg-gray-100 text-gray-600 border-2 border-transparent hover:border-gray-300'
                          }`}
                        >
                          {tag.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {(!category.items || category.items.length === 0) && (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                  <Utensils className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No items yet. Click + to add dishes</p>
                </div>
              )}
            </div>
          </div>
        ))}

        {(!formData.categories || formData.categories.length === 0) && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <Utensils className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 font-medium mb-4">No categories added yet</p>
            <button
              type="button"
              onClick={addCategory}
              className="px-6 py-3 bg-[#f2a91d] text-white rounded-xl font-semibold hover:bg-[#d89419] transition-all"
            >
              Create Your First Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
}