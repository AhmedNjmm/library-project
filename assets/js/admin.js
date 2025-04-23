// ✅ admin.js
// مسؤول عن إدارة الكتب + التحقق من دخول الأدمن

document.addEventListener("DOMContentLoaded", function () {
  const db = firebase.firestore();
  const auth = firebase.auth();

  // 🔐 تحقق من دخول الأدمن
  auth.onAuthStateChanged(user => {
    if (!user || user.email !== "admin@library.com") {
      alert("🚫 لا تملك صلاحية الوصول إلى هذه الصفحة");
      window.location.href = "admin-login.html";
    }
  });

  // ✅ عناصر HTML
  const titleInput = document.getElementById("book-title");
  const descriptionInput = document.getElementById("book-description");
  const imageInput = document.getElementById("book-image");
  const categoryInput = document.getElementById("book-category");
  const quantityInput = document.getElementById("book-quantity");
  const suggestedCheckbox = document.getElementById("suggested-book");
  const addBtn = document.getElementById("add-book-btn");
  const booksTableBody = document.getElementById("books-tbody");

  let currentEditBookId = null;

  // ✅ عرض الكتب من Firestore
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
              <button class="btn btn-sm btn-warning me-1" onclick="fillForm(\"${bookId}\")">✏️ تعديل</button>
              <button class="btn btn-sm btn-danger" onclick="deleteBook(\"${bookId}\")">🗑 حذف</button>
            </td>
          `;
          booksTableBody.appendChild(row);
        });
      })
      .catch(err => alert("❌ خطأ أثناء جلب الكتب: " + err.message));
  }

  // ✅ إضافة أو تحديث كتاب
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

  // ✅ تعبئة النموذج لتعديل كتاب
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

  // ✅ حذف كتاب
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

  renderBooks();
});
