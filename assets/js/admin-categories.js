document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("category-name");
  const addBtn = document.getElementById("add-category-btn");
  const tbody = document.getElementById("categories-tbody");

  let categories = [];

function fetchCategoriesFromFirebase() {
  db.collection("categories").get()
    .then(snapshot => {
      categories = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name
      }));
      renderCategories();
      updateCategoryDropdown();
    })
    .catch(error => {
      console.error("❌ خطأ أثناء جلب التصنيفات:", error.message);
    });
}



  // 📋 عرض التصنيفات
  function renderCategories() {
    tbody.innerHTML = "";
    categories.forEach((cat, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${cat.name}</td>
        <td>
          <button class="btn btn-sm btn-primary me-1" onclick="editCategory('${cat.id}', '${cat.name}')">✏️ تعديل</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory('${cat.id}', '${cat.name}')">🗑 حذف</button>
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
  
    // ➕ إضافة إلى Firebase
    db.collection("categories").add({ name })
      .then(() => {
        alert("✅ تم إضافة التصنيف بنجاح!");
        nameInput.value = "";
        fetchCategoriesFromFirebase(); // نعيد تحميل التصنيفات من فايربيز
      })
      .catch(error => {
        alert("❌ حدث خطأ أثناء الإضافة: " + error.message);
      });
  });
  

  // 🗑 حذف تصنيف
  window.deleteCategory = function (docId, categoryName) {
    // 🔎 تحقق إذا التصنيف مرتبط بكتب
    db.collection("books").where("category", "==", categoryName).get()
      .then(snapshot => {
        if (!snapshot.empty) {
          alert("🚫 لا يمكن حذف هذا التصنيف لأنه مرتبط بكتب موجودة في المكتبة.");
          return;
        }
  
        if (confirm("⚠️ هل تريد حذف هذا التصنيف؟")) {
          db.collection("categories").doc(docId).delete()
            .then(() => {
              alert("✅ تم حذف التصنيف بنجاح!");
              fetchCategoriesFromFirebase();
            })
            .catch(error => {
              alert("❌ حدث خطأ أثناء الحذف: " + error.message);
            });
        }
      });
  };
  

  // ✏️ تعديل تصنيف
  window.editCategory = function (docId, currentName) {
    const newName = prompt("✏️ أدخل الاسم الجديد:", currentName);
  
    if (!newName || categories.some(c => c.name === newName)) {
      alert("🚫 الاسم فارغ أو موجود مسبقًا");
      return;
    }
  
    db.collection("categories").doc(docId).update({ name: newName })
      .then(() => {
        alert("✅ تم تعديل التصنيف!");
        fetchCategoriesFromFirebase();
      })
      .catch(error => {
        alert("❌ خطأ أثناء التعديل: " + error.message);
      });
  };
  

  // 🔄 تحديث القائمة المنسدلة لتصنيفات الكتب
  function updateCategoryDropdown() {
    const categorySelect = document.getElementById("book-category");
    if (!categorySelect) return;

    categorySelect.innerHTML = '<option disabled selected>اختر تصنيفًا</option>';
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.name;
      option.textContent = cat.name;
      
      categorySelect.appendChild(option);
    });
  }

  // ✅ تحميل أولي
  fetchCategoriesFromFirebase(); // بدل renderCategories()
  updateCategoryDropdown();
});
