document.addEventListener("DOMContentLoaded", function () {
// 🧩 تحميل التصنيفات في القائمة
const categorySelect = document.getElementById("book-category");

function تحديث_قائمة_التصنيفات() {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];

  categorySelect.innerHTML = '<option disabled selected>اختر تصنيفًا</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
}

// ⏱️ أول مرة
تحديث_قائمة_التصنيفات();


// 🧾 زر تصدير PDF
document.getElementById("export-pdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.text("📄 تقرير الاستعارات", 20, 20);

  let y = 30;
  doc.setFontSize(10);

  // العناوين
  doc.text("📧 البريد الإلكتروني", 20, y);
  doc.text("📚 اسم الكتاب", 90, y);
  doc.text("📅 التاريخ", 160, y);
  y += 10;

  // البيانات
  borrowLog.forEach(entry => {
    doc.text(entry.email, 20, y);
    doc.text(entry.title, 90, y);
    doc.text(entry.date, 160, y);
    y += 10;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  doc.save("borrow-report.pdf");
});

// 📊 زر تصدير Excel
document.getElementById("export-excel").addEventListener("click", () => {
  const rows = borrowLog.map(entry => ({
    "📧 البريد الإلكتروني": entry.email,
    "📚 اسم الكتاب": entry.title,
    "📅 التاريخ": entry.date
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "استعارات");

  XLSX.writeFile(workbook, "borrow-report.xlsx");
});

  const tbody = document.getElementById("borrow-log-body");
  const emailFilterInput = document.getElementById("email-filter");
  const dateFilterInput = document.getElementById("date-filter");
  const statsBody = document.getElementById("user-stats-body");

  let borrowLog = [];

  // 🧠 استخراج جميع السجلات من localStorage
  for (let key in localStorage) {
    if (key.startsWith("borrowedBooks_")) {
      const email = key.replace("borrowedBooks_", "");
      const books = JSON.parse(localStorage.getItem(key));

      books.forEach(book => {
        borrowLog.push({
          email: email,
          title: book.title,
          date: book.date || "📅 غير محدد"
        });
      });
    }
  }

  // 🎯 دالة عرض السجلات مع الفلترة
  function renderLog(filterEmail = "", filterDate = "") {
    tbody.innerHTML = "";

    const filtered = borrowLog.filter(entry => {
      const matchEmail = entry.email.toLowerCase().includes(filterEmail.toLowerCase());
      const matchDate = filterDate ? entry.date === filterDate : true;
      return matchEmail && matchDate;
    });

    filtered.forEach(entry => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${entry.email}</td>
        <td>${entry.title}</td>
        <td>${entry.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  // 📊 دالة عرض عدد الكتب المستعارة لكل مستخدم
  function renderUserStats() {
    statsBody.innerHTML = "";
    const stats = {};

    borrowLog.forEach(entry => {
      stats[entry.email] = (stats[entry.email] || 0) + 1;
    });

    for (let email in stats) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${email}</td>
        <td>${stats[email]}</td>
      `;
      statsBody.appendChild(tr);
    }
  }

  // عرض أولي
  renderLog();
  renderUserStats();

  // 🎯 فلترة بالإيميل
  emailFilterInput.addEventListener("input", () => {
    const emailValue = emailFilterInput.value.trim();
    const rawDate = dateFilterInput.value;
    let filterDate = "";
    if (rawDate) {
      const parts = rawDate.split("-");
      filterDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // dd-mm-yyyy
    }

    renderLog(emailValue, filterDate);
  });

  // 🎯 فلترة بالتاريخ
  dateFilterInput.addEventListener("input", () => {
    const rawDate = dateFilterInput.value;
    let filterDate = "";
    if (rawDate) {
      const parts = rawDate.split("-");
      filterDate = `${parts[2]}-${parts[1]}-${parts[0]}`; // dd-mm-yyyy
    }

    const emailValue = emailFilterInput.value.trim();
    renderLog(emailValue, filterDate);
  });
});
