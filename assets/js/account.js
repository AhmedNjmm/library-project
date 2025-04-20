    document.addEventListener("DOMContentLoaded", function () {
  const email = localStorage.getItem("userEmail");

  if (!email) {
    console.log("🚨 لا يوجد مستخدم مسجل دخول");
    // window.location.href = "login.html"; // فعّل عند التصدير
    return;
  }

  const username = email.split("@")[0];
  document.getElementById("welcome-text").textContent = `👋 مرحبًا بك في حسابك يا ${username}!`;
  document.getElementById("email-display").textContent = `📧 البريد الإلكتروني: ${email}`;

  // 🔐 قراءة الكتب الخاصة بهذا المستخدم
  const key = `borrowedBooks_${email}`;
  const books = JSON.parse(localStorage.getItem(key)) || [];
  const list = document.getElementById("book-list");

  // 🧹 تنظيف القائمة قبل العرض
  list.innerHTML = "";

  if (books.length === 0) {
    list.innerHTML = "<li class='list-group-item text-muted text-center'>لا توجد كتب مستعارة.</li>";
  } else {
    books.forEach((bookObj, index) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-start flex-column text-start";

      const title = document.createElement("div");
      title.innerHTML = `📘 <strong>${bookObj.title}</strong>`;

      const date = document.createElement("div");
      date.className = "text-muted small mt-1";
      date.textContent = `📅 تم الاستعارة بتاريخ: ${bookObj.date}`;

      const btn = document.createElement("button");
      btn.className = "btn btn-sm btn-outline-danger align-self-end mt-2";
      btn.textContent = "إرجاع";
      btn.onclick = function () {
        returnBook(index);
      };

      li.appendChild(title);
      li.appendChild(date);
      li.appendChild(btn);
      list.appendChild(li);
    });
  }
});

// 🚪 دالة تسجيل الخروج (تحذف الإيميل فقط)
function logout() {
  localStorage.removeItem("userEmail");
  window.location.href = "login.html";
}

// 🔁 دالة إرجاع كتاب حسب المستخدم
function returnBook(index) {
  const email = localStorage.getItem("userEmail");
  const key = `borrowedBooks_${email}`;
  const books = JSON.parse(localStorage.getItem(key)) || [];
  books.splice(index, 1);
  localStorage.setItem(key, JSON.stringify(books));
  location.reload();
}
