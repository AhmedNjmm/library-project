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
  const categoryInputField = document.getElementById("new-category-input");
  const addCategoryBtn = document.getElementById("add-category-btn");
  const categoryTable = document.getElementById("categories-tbody");

  function renderCategories() {
    categoryTable.innerHTML = "";
    db.collection("categories").orderBy("name").get().then(snapshot => {
      snapshot.forEach(doc => {
        const cat = doc.data();
        const id = doc.id;

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${cat.name}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteCategory('${id}')">🗑 حذف</button>
            <button class="btn btn-sm btn-primary" onclick="editCategory('${id}', '${cat.name}')">✏️ تعديل</button>
          </td>
        `;
        categoryTable.appendChild(row);
      });
    });
  }

  window.deleteCategory = function (id) {
    if (confirm("⚠️ هل تريد حذف هذا التصنيف؟")) {
      db.collection("categories").doc(id).delete().then(() => {
        alert("✅ تم حذف التصنيف");
        renderCategories();
      });
    }
  }

  window.editCategory = function (id, oldName) {
    const newName = prompt("✏️ أدخل اسم جديد للتصنيف:", oldName);
    if (newName && newName.trim() !== "") {
      db.collection("categories").doc(id).update({ name: newName.trim() }).then(() => {
        alert("✅ تم تعديل التصنيف");
        renderCategories();
      });
    }
  }

  addCategoryBtn.addEventListener("click", () => {
    const name = categoryInputField.value.trim();
    if (!name) return alert("❗ الرجاء إدخال اسم التصنيف");

    db.collection("categories").add({ name }).then(() => {
      alert("✅ تم إضافة التصنيف");
      categoryInputField.value = "";
      renderCategories();
    });
  });

  renderCategories();
});
