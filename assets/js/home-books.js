document.addEventListener("DOMContentLoaded", function () {
  const allBooks = JSON.parse(localStorage.getItem("libraryBooks")) || [];

  // نعرض أول 3 كتب فقط ككتب مقترحة
  const suggested = allBooks.filter(book => book.suggested === true);
 //هون بتختتار شو الكتاب اللي يظهر في المقترح

  const container = document.getElementById("suggested-books");
  container.innerHTML = "";

  suggested.forEach(book => {
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
});
