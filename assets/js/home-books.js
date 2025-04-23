document.addEventListener("DOMContentLoaded", function () {
  const db = firebase.firestore();
  const container = document.getElementById("suggested-books");
  container.innerHTML = "";

  db.collection("books").where("suggested", "==", true).get()
    .then(snapshot => {
      if (snapshot.empty) {
        container.innerHTML = `<p class="text-center text-muted">لا توجد كتب مقترحة حالياً.</p>`;
        return;
      }

      snapshot.forEach(doc => {
        const book = doc.data();

        const col = document.createElement("div");
        col.className = "col";

        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img src="${book.image}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${book.title}">
            <div class="card-body text-center">
              <h5 class="card-title">${book.title}</h5>
              <p class="card-text">📦 النسخ المتاحة: <strong>${book.available}</strong></p>
              <a href="book-details.html?title=${encodeURIComponent(book.title)}" class="btn btn-primary">📖 تفاصيل الكتاب</a>
            </div>
          </div>
        `;
        container.appendChild(col);
      });
    })
    .catch(error => {
      container.innerHTML = `<p class="text-danger text-center">❌ حدث خطأ أثناء تحميل الكتب: ${error.message}</p>`;
      console.error("❌ Error getting suggested books:", error);
    });
});
