// Firebase Firestore - Add book from Admin Panel
document.addEventListener("DOMContentLoaded", function () {
  const addBookBtn = document.getElementById("add-book-btn");
  const titleInput = document.getElementById("book-title");
  const descriptionInput = document.getElementById("book-description");
  const imageInput = document.getElementById("book-image");
  const categoryInput = document.getElementById("book-category");
  const quantityInput = document.getElementById("book-quantity");
  const suggestedCheckbox = document.getElementById("book-suggested");

  // Firestore reference
  const db = firebase.firestore();
  const booksCollection = db.collection("books");

  addBookBtn.addEventListener("click", function () {
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const image = imageInput.value.trim();
    const category = categoryInput.value;
    const quantity = parseInt(quantityInput.value);
    const suggested = suggestedCheckbox.checked;

    if (!title || !description || !image || !category || isNaN(quantity)) {
      alert("❗ الرجاء تعبئة جميع الحقول بشكل صحيح");
      return;
    }

    booksCollection.add({
      title,
      description,
      image,
      category,
      quantity,
      suggested,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      alert("✅ تم إضافة الكتاب بنجاح إلى Firebase!");
      // يمكنك بعدها إعادة تحميل الكتب تلقائياً أو تحديث الجدول
    })
    .catch(error => {
      console.error("حدث خطأ أثناء إضافة الكتاب:", error.message);
      alert("❌ فشل في إضافة الكتاب إلى قاعدة البيانات.");
    });
  });
});
