document.addEventListener("DOMContentLoaded", function () {
  const allBooks = JSON.parse(localStorage.getItem("libraryBooks")) || [];
  const email = localStorage.getItem("userEmail");
  const userKey = `borrowedBooks_${email}`;
  const userBooks = JSON.parse(localStorage.getItem(userKey)) || [];
  const container = document.getElementById("books-row");

  function renderBooks(filteredBooks) {
    container.innerHTML = "";

    if (filteredBooks.length === 0) {
      container.innerHTML = `
        <div class="col">
          <div class="alert alert-warning text-center">🚫 لا توجد كتب في هذا التصنيف.</div>
        </div>
      `;
      return;
    }

    filteredBooks.forEach(book => {
      const col = document.createElement("div");
      col.className = "col";

      const isBorrowed = userBooks.some(b => b.title === book.title);

      let buttonsHTML = "";

      if (isBorrowed) {
        buttonsHTML = `
          <button class="btn btn-secondary w-100 mb-2" disabled>✅ مستعار</button>
          <button class="btn btn-danger w-100" onclick="returnBook('${book.title}')">🔁 إرجاع</button>
        `;
      } else if (book.available > 0) {
        buttonsHTML = `
          <button class="btn btn-success w-100" onclick="borrowBook('${book.title}')">📚 استعارة</button>
        `;
      } else {
        buttonsHTML = `
          <button class="btn btn-secondary w-100" disabled>🚫 غير متاح</button>
        `;
      }

      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${book.image}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${book.title}">
          <div class="card-body d-flex flex-column justify-content-between">
            <h5 class="card-title">${book.title}</h5>
            <p class="card-text">📦 النسخ المتاحة: <strong>${book.available}</strong></p>
            ${buttonsHTML}
            <a href="book-details.html?title=${encodeURIComponent(book.title)}" class="btn btn-outline-primary mt-2">📖 تفاصيل</a>
          </div>
        </div>
      `;

      container.appendChild(col);
    });
  }

  // عرض كل الكتب أول مرة
  renderBooks(allBooks);

  // البحث
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = allBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm)
    );
    renderBooks(filtered);
  });

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = allBooks.filter(book =>
      book.title.toLowerCase().includes(searchTerm)
    );
    renderBooks(filtered);
  });

  // 🔄 توليد أزرار التصنيفات تلقائيًا
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const filtersContainer = document.getElementById("category-filters");

  filtersContainer.innerHTML = ''; // نفرغ الموجود أولاً

  const allBtn = document.createElement("button");
  allBtn.className = "btn btn-outline-primary filter-btn";
  allBtn.dataset.category = "All";
  allBtn.textContent = "📚 الكل";
  filtersContainer.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "btn btn-outline-primary filter-btn";
    btn.dataset.category = cat;
    btn.textContent = cat;
    filtersContainer.appendChild(btn);
  });

  // 🧠 ربط أزرار الفلترة
  function setupFilterButtons() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const category = btn.dataset.category;
        if (category === "All") {
          renderBooks(allBooks);
        } else {
          const filtered = allBooks.filter(book => book.category === category);
          renderBooks(filtered);
        }
      });
    });
  }

  setupFilterButtons();
});
