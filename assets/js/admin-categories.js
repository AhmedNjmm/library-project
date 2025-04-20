document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("category-name");
  const addBtn = document.getElementById("add-category-btn");
  const tbody = document.getElementById("categories-tbody");

  let categories = JSON.parse(localStorage.getItem("categories")) || [];

  // 📋 عرض التصنيفات
  function renderCategories() {
    tbody.innerHTML = "";
    categories.forEach((cat, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cat}</td>
        <td>
          <button class="btn btn-sm btn-primary me-1" onclick="editCategory(${index})">✏️ تعديل</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory(${index})">🗑 حذف</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // ➕ إضافة تصنيف
  addBtn.addEventListener("click", function () {
    const name = nameInput.value.trim();
    if (!name) {
      alert("❗ الرجاء كتابة اسم التصنيف");
      return;
    }

    if (categories.includes(name)) {
      alert("⚠️ التصنيف موجود مسبقًا");
      return;
    }

    categories.push(name);
    localStorage.setItem("categories", JSON.stringify(categories));
    nameInput.value = "";
    renderCategories();
    updateCategoryDropdown(); // تحديث القائمة المنسدلة مباشرة
  });

  // 🗑 حذف تصنيف
window.deleteCategory = function (index) {
  const categoryToDelete = categories[index];

  // تحقق من الكتب
  const books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
  const hasBooks = books.some(book => book.category === categoryToDelete);

  if (hasBooks) {
    alert("🚫 لا يمكن حذف هذا التصنيف لأنه مرتبط بكتب موجودة في المكتبة.");
    return;
  }

  if (confirm("هل تريد حذف هذا التصنيف؟")) {
    categories.splice(index, 1);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
    updateCategoryDropdown();
  }
};


  // ✏️ تعديل تصنيف
  window.editCategory = function (index) {
    const currentName = categories[index];
    const newName = prompt("✏️ أدخل الاسم الجديد:", currentName);

    if (!newName || categories.includes(newName)) {
      alert("🚫 الاسم فارغ أو موجود مسبقًا");
      return;
    }

    categories[index] = newName;
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategories();
    updateCategoryDropdown();
  };

  // 🔄 تحديث القائمة المنسدلة لتصنيفات الكتب
  function updateCategoryDropdown() {
    const categorySelect = document.getElementById("book-category");
    if (!categorySelect) return;

    categorySelect.innerHTML = '<option disabled selected>اختر تصنيفًا</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categorySelect.appendChild(option);
    });
  }

  // ✅ تحميل أولي
  renderCategories();
  updateCategoryDropdown();
});
