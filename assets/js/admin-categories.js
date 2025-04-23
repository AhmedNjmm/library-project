// ✅ admin-categories.js
// إدارة التصنيفات بشكل كامل مع Firestore

document.addEventListener("DOMContentLoaded", function () {
  const db = firebase.firestore();
  const nameInput = document.getElementById("category-name");
  const addBtn = document.getElementById("add-category-btn");
  const tbody = document.getElementById("categories-tbody");
  const categoryDropdown = document.getElementById("book-category");

  let categories = [];

  // ✅ تحميل التصنيفات من Firestore
  function fetchCategories() {
    db.collection("categories").get()
      .then(snapshot => {
        categories = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        renderCategories();
        updateCategoryDropdown();
      })
      .catch(err => console.error("❌ خطأ في جلب التصنيفات:", err.message));
  }

  // ✅ عرض التصنيفات في الجدول
  function renderCategories() {
    tbody.innerHTML = "";
    categories.forEach(cat => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cat.name}</td>
        <td>
          <button class="btn btn-sm btn-primary me-1" onclick="editCategory(\"${cat.id}\", \"${cat.name}\")">✏️ تعديل</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory(\"${cat.id}\", \"${cat.name}\")">🗑 حذف</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // ✅ تحديث القائمة المنسدلة في نموذج الكتاب
  function updateCategoryDropdown() {
    if (!categoryDropdown) return;
    categoryDropdown.innerHTML = '<option disabled selected>اختر تصنيفًا</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      categoryDropdown.appendChild(option);
    });
  }

  // ✅ إضافة تصنيف جديد
  addBtn.addEventListener("click", function () {
    const name = nameInput.value.trim();
    if (!name) return alert("❗ الرجاء كتابة اسم التصنيف");
    if (categories.some(cat => cat.name === name)) return alert("⚠️ التصنيف موجود مسبقًا");

    db.collection("categories").add({ name })
      .then(() => {
        alert("✅ تم إضافة التصنيف");
        nameInput.value = "";
        fetchCategories();
      })
      .catch(err => alert("❌ خطأ أثناء الإضافة: " + err.message));
  });

  // ✅ حذف تصنيف مع التحقق من الارتباط بكتب
  window.deleteCategory = function (docId, categoryName) {
    db.collection("books").where("category", "==", categoryName).get()
      .then(snapshot => {
        if (!snapshot.empty) return alert("🚫 لا يمكن حذف هذا التصنيف لأنه مرتبط بكتب.");

        if (confirm("⚠️ هل تريد حذف هذا التصنيف؟")) {
          db.collection("categories").doc(docId).delete()
            .then(() => {
              alert("✅ تم الحذف");
              fetchCategories();
            })
            .catch(err => alert("❌ خطأ أثناء الحذف: " + err.message));
        }
      });
  }

  // ✅ تعديل اسم تصنيف
  window.editCategory = function (docId, currentName) {
    const newName = prompt("✏️ أدخل الاسم الجديد:", currentName);
    if (!newName || categories.some(c => c.name === newName)) return alert("🚫 الاسم فارغ أو موجود مسبقًا");

    db.collection("categories").doc(docId).update({ name: newName })
      .then(() => {
        alert("✅ تم التعديل");
        fetchCategories();
      })
      .catch(err => alert("❌ خطأ أثناء التعديل: " + err.message));
  }

  // 🚀 بدء التحميل
  fetchCategories();
});
