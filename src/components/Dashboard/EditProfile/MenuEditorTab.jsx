import React, { useState } from "react";
import {
  UtensilsCrossed,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  GripVertical,
} from "lucide-react";
import Swal from "sweetalert2";

export default function MenuEditorTab({ profile, setProfile }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  // Ensure categories exist
  const categories = profile.profileData?.categories || [];

  const updateCategories = (newCategories) => {
    setProfile({
      ...profile,
      profileData: {
        ...profile.profileData,
        categories: newCategories,
      },
    });
  };

  const handleAddCategory = async () => {
    const { value: name } = await Swal.fire({
      title: "New Category",
      input: "text",
      inputLabel: "Category Name",
      inputPlaceholder: "e.g. Starters, Main Course",
      showCancelButton: true,
      confirmButtonColor: "#060640",
      cancelButtonColor: "#6B7280",
    });

    if (name) {
      const newCategory = {
        id: Date.now(),
        name,
        items: [],
      };
      updateCategories([...categories, newCategory]);
      setExpandedCategory(newCategory.id);
    }
  };

  const handleEditCategory = async (category) => {
    const { value: name } = await Swal.fire({
      title: "Edit Category",
      input: "text",
      inputLabel: "Category Name",
      inputValue: category.name,
      showCancelButton: true,
      confirmButtonColor: "#060640",
    });

    if (name) {
      updateCategories(
        categories.map((c) => (c.id === category.id ? { ...c, name } : c))
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This will delete all items in this category",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      updateCategories(categories.filter((c) => c.id !== categoryId));
    }
  };

  const handleAddItem = async (categoryId) => {
    const { value: formValues } = await Swal.fire({
      title: "Add Menu Item",
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Item Name">
        <input id="swal-input2" class="swal2-input" placeholder="Price (optional)">
        <textarea id="swal-input3" class="swal2-textarea" placeholder="Description (optional)"></textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#060640",
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
        ];
      },
    });

    if (formValues) {
      const [name, price, description] = formValues;
      if (!name) return;

      updateCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: [
                  ...c.items,
                  {
                    id: Date.now(),
                    name,
                    price,
                    description,
                  },
                ],
              }
            : c
        )
      );
      setExpandedCategory(categoryId); // Ensure expanded
    }
  };

  const handleEditItem = async (categoryId, item) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Item",
      html: `
        <label class="block text-left text-sm font-bold mb-1">Name</label>
        <input id="swal-input1" class="swal2-input" placeholder="Item Name" value="${item.name}">
        <label class="block text-left text-sm font-bold mb-1 mt-3">Price</label>
        <input id="swal-input2" class="swal2-input" placeholder="Price" value="${item.price || ''}">
        <label class="block text-left text-sm font-bold mb-1 mt-3">Description</label>
        <textarea id="swal-input3" class="swal2-textarea" placeholder="Description">${item.description || ''}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#060640",
      preConfirm: () => {
        return [
          document.getElementById("swal-input1").value,
          document.getElementById("swal-input2").value,
          document.getElementById("swal-input3").value,
        ];
      },
    });

    if (formValues) {
      const [name, price, description] = formValues;
      if (!name) return;

      updateCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: c.items.map((i) =>
                  i.id === item.id ? { ...i, name, price, description } : i
                ),
              }
            : c
        )
      );
    }
  };

  const handleDeleteItem = async (categoryId, itemId) => {
    const result = await Swal.fire({
      title: "Delete Item?",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      updateCategories(
        categories.map((c) =>
          c.id === categoryId
            ? {
                ...c,
                items: c.items.filter((i) => i.id !== itemId),
              }
            : c
        )
      );
    }
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-2xl p-8 space-y-6"
      style={{
        boxShadow:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
      }}
    >
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">Menu Builder</h2>
            <p className="text-sm text-gray-600">
              Manage your categories and items
            </p>
          </div>
        </div>
        <button
          onClick={handleAddCategory}
          className="btn-primary-clean px-6 py-3 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">
            Your menu is empty
          </p>
          <p className="text-gray-600 mb-6">
            Start by adding a category (e.g., Starters, Drinks)
          </p>
          <button
            onClick={handleAddCategory}
            className="btn-primary-clean px-6 py-3 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add First Category
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <div
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
              >
                <div className="flex items-center gap-3">
                  {expandedCategory === category.id ? (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  )}
                  <h3 className="font-bold text-lg text-brand-dark">
                    {category.name}
                  </h3>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-200 text-gray-700 rounded-full">
                    {category.items.length} items
                  </span>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit Category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  <button
                    onClick={() => handleAddItem(category.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Add Item
                  </button>
                </div>
              </div>

              {/* Items List */}
              {expandedCategory === category.id && (
                <div className="p-4 space-y-3 bg-white border-t border-gray-100">
                  {category.items.length === 0 ? (
                    <p className="text-sm text-gray-500 italic text-center py-4">
                      No items in this category yet.
                    </p>
                  ) : (
                    category.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-3 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {item.name}
                            </h4>
                            {item.price && (
                              <span className="font-bold text-green-600 text-sm">
                                {item.price}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-500 truncate">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditItem(category.id, item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(category.id, item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
