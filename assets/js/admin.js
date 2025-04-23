// ✅ admin.js
// مسؤول عن إدارة الكتب والتصنيفات + التحقق من دخول الأدمن

document.addEventListener("DOMContentLoaded", function () {
  const db = firebase.firestore();
  const auth = firebase.auth();

  // 🔐 تحقق من دخول الأدمن
  firebase.auth().onAuthStateChanged(user => {
    if (!user || user.email !== "admin@library.com") {
      window.location.replace("unauthorized.html");
    }
  });

  // ✅ عناصر HTML - الكتب
  const titleInput = document.getElementById("book-title");
  const descriptionInput = document.getElementById("book-description");
  const imageInput = document.getElementById("book-image");
  const categoryInput = document.getElementById("book-category");
  const quantityInput = document.getElementById("book-quantity");
  const suggestedCheckbox = document.getElementById("suggested-book");
  const addBtn = document.getElementById("add-book-btn");
  const booksTableBody = document.getElementById("books-tbody");

  let currentEditBookId = null;

  function renderBooks() {
    booksTableBody.innerHTML = "";
    db.collection("books").orderBy("title").get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          const book = doc.data();
          const bookId = doc.id;
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.category}</td>
            <td>${book.available || 0}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" onclick="fillForm('${bookId}')">✏️ تعديل</button>
              <button class="btn btn-sm btn-danger" onclick="deleteBook('${bookId}')">🗑 حذف</button>
            </td>
          `;
          booksTableBody.appendChild(row);
        });
      })
      .catch(err => alert("❌ خطأ أثناء جلب الكتب: " + err.message));
  }

  addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const image = imageInput.value.trim();
    const category = categoryInput.value;
    const quantity = parseInt(quantityInput.value);
    const suggested = suggestedCheckbox.checked;

    if (!title || !description || !image || !category || isNaN(quantity)) {
      return alert("❗ الرجاء تعبئة كل الحقول");
    }

    const data = { title, description, image, category, available: quantity, suggested };

    if (currentEditBookId) {
      db.collection("books").doc(currentEditBookId).update(data)
        .then(() => {
          alert("✅ تم التحديث");
          resetForm();
          renderBooks();
        });
    } else {
      db.collection("books").add(data)
        .then(() => {
          alert("📘 تم إضافة الكتاب!");
          resetForm();
          renderBooks();
        });
    }
  });

  window.fillForm = function (bookId) {
    db.collection("books").doc(bookId).get()
      .then(doc => {
        if (doc.exists) {
          const b = doc.data();
          titleInput.value = b.title;
          descriptionInput.value = b.description;
          imageInput.value = b.image;
          categoryInput.value = b.category;
          quantityInput.value = b.available;
          suggestedCheckbox.checked = b.suggested;
          currentEditBookId = bookId;
          addBtn.textContent = "💾 تحديث الكتاب";
          addBtn.classList.replace("btn-primary", "btn-success");
        }
      });
  }

  window.deleteBook = function (bookId) {
    if (confirm("⚠️ هل تريد حذف هذا الكتاب؟")) {
      db.collection("books").doc(bookId).delete()
        .then(() => {
          alert("✅ تم الحذف");
          renderBooks();
        });
    }
  }

  function resetForm() {
    titleInput.value = "";
    descriptionInput.value = "";
    imageInput.value = "";
    categoryInput.selectedIndex = 0;
    quantityInput.value = "";
    suggestedCheckbox.checked = false;
    currentEditBookId = null;
    addBtn.textContent = "📘 أضف الكتاب";
    addBtn.classList.replace("btn-success", "btn-primary");
  }

  document.getElementById("admin-logout-btn").addEventListener("click", function () {
    firebase.auth().signOut().then(() => {
      window.location.href = "admin-login.html";
    }).catch((error) => {
      alert("❌ حدث خطأ أثناء تسجيل الخروج: " + error.message);
    });
  });

  renderBooks();

  // ✅ التصنيفات
  const nameInput = document.getElementById("category-name");
  const addCategoryBtn = document.getElementById("add-category-btn");
  const tbody = document.getElementById("categories-tbody");

  let categories = [];

  function fetchCategories() {
    db.collection("categories").get()
      .then(snapshot => {
        categories = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name
        }));
        renderCategories();
      })
      .catch(err => console.error("❌ خطأ في جلب التصنيفات:", err.message));
  }

  function renderCategories() {
    tbody.innerHTML = "";
    categories.forEach(cat => {
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
  // ✅ فلترة التصنيفات حسب البحث
document.getElementById("category-search-input").addEventListener("input", function (e) {
  const searchValue = e.target.value.toLowerCase();
  const filtered = categories.filter(cat => cat.name.toLowerCase().includes(searchValue));
  tbody.innerHTML = "";
  filtered.forEach(cat => {
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
});


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

  addCategoryBtn.addEventListener("click", function () {
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

  fetchCategories();
});
