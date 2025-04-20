function borrowBook(bookTitle) {
  const email = localStorage.getItem("userEmail");
  if (!email) {
    alert("❗ يجب تسجيل الدخول أولاً.");
    return;
  }

  const key = `borrowedBooks_${email}`;
  let borrowedBooks = JSON.parse(localStorage.getItem(key)) || [];

  const alreadyBorrowed = borrowedBooks.some(book => book.title === bookTitle);
  if (alreadyBorrowed) {
    alert("📚 لقد استعرت هذا الكتاب مسبقًا.");
    return;
  }

  const books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
  const book = books.find(b => b.title === bookTitle);

  if (!book || book.available <= 0) {
    alert("🚫 لا توجد نسخ متاحة.");
    return;
  }

  // خصم نسخة
  book.available -= 1;

  // حفظ مع التاريخ
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, "0")}-${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;

  borrowedBooks.push({ title: bookTitle, date: date });

  localStorage.setItem("libraryBooks", JSON.stringify(books));
  localStorage.setItem(key, JSON.stringify(borrowedBooks));

  alert(`✅ تم استعارة: ${bookTitle}`);
  location.reload();
}

function returnBook(bookTitle) {
  const email = localStorage.getItem("userEmail");
  const key = `borrowedBooks_${email}`;
  let borrowedBooks = JSON.parse(localStorage.getItem(key)) || [];

  // إزالة الكتاب من قائمة الاستعارات
  borrowedBooks = borrowedBooks.filter(book => book.title !== bookTitle);
  localStorage.setItem(key, JSON.stringify(borrowedBooks));

  // زيادة نسخة الكتاب
  const books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
  const book = books.find(b => b.title === bookTitle);
  if (book) {
    book.available += 1;
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }

  alert(`📤 تم إرجاع: ${bookTitle}`);
  location.reload();
}
