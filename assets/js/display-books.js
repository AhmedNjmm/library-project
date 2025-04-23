// ✅ عرض الكتب في صفحة books.html من Firestore
const db = firebase.firestore();

const booksRow = document.getElementById("books-row");
const categoryFilters = document.getElementById("category-filters");
let allBooks = [];

// 🔄 تحميل الكتب من Firestore
function loadBooksFromFirestore() {
  db.collection("books").orderBy("title").get().then(snapshot => {
    allBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderBooks("All");
    generateCategoryButtons();
  });
}

// 📋 عرض الكتب بناءً على التصنيف
function renderBooks(category = "All") {
  booksRow.innerHTML = "";

  const filteredBooks = category === "All" ? allBooks : allBooks.filter(book => book.category === category);

  if (filteredBooks.length === 0) {
    document.getElementById("no-books").style.display = "block";
    return;
  } else {
    document.getElementById("no-books").style.display = "none";
  }

  filteredBooks.forEach(book => {
    const col = document.createElement("div");
    col.className = "col";
    col.innerHTML = `
      <div class="card shadow-sm">
        <img src="${book.image}" class="card-img-top" alt="cover" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text text-muted">📦 ${book.available} نسخة</p>
          <a href="book-details.html?id=${book.id}" class="btn btn-primary w-100">📖 تفاصيل</a>
        </div>
      </div>
    `;
    booksRow.appendChild(col);
  });
}

// 🔘 توليد أزرار التصنيفات
function generateCategoryButtons() {
  db.collection("categories").get().then(snapshot => {
    categoryFilters.innerHTML = '<button class="btn btn-outline-primary filter-btn" data-category="All">📚 الكل</button>';
    snapshot.forEach(doc => {
      const name = doc.data().name;
      const btn = document.createElement("button");
      btn.className = "btn btn-outline-primary filter-btn";
      btn.setAttribute("data-category", name);
      btn.textContent = name;
      categoryFilters.appendChild(btn);
    });
  });
}

// 🖱️ التعامل مع الفلاتر
categoryFilters.addEventListener("click", e => {
  if (e.target.classList.contains("filter-btn")) {
    const selected = e.target.getAttribute("data-category");
    renderBooks(selected);
  }
});

loadBooksFromFirestore();
