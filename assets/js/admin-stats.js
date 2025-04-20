document.addEventListener("DOMContentLoaded", function () {
  const usersTbody = document.getElementById("users-tbody");

  const accounts = JSON.parse(localStorage.getItem("accounts")) || [];
  const borrowLog = [];

  // 🔍 جلب بيانات الاستعارات
  for (let key in localStorage) {
    if (key.startsWith("borrowedBooks_")) {
      const email = key.replace("borrowedBooks_", "");
      const books = JSON.parse(localStorage.getItem(key)) || [];
      borrowLog.push({ email, count: books.length });
    }
  }

  // 🗺️ خريطة عدد الاستعارات لكل مستخدم
  const borrowMap = {};
  borrowLog.forEach(entry => {
    borrowMap[entry.email] = entry.count;
  });

  // 👤 عرض المستخدمين
  accounts.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.email}</td>
      <td>${user.email === "admin@library.com" ? "مشرف" : "طالب"}</td>
      <td>${borrowMap[user.email] || 0}</td>
    `;
    usersTbody.appendChild(tr);
  });

  // 📊 عرض الإحصائيات
  const totalBooksSpan = document.getElementById("total-books");
  const totalCategoriesSpan = document.getElementById("total-categories");
  const totalUsersSpan = document.getElementById("total-users");

  const books = JSON.parse(localStorage.getItem("libraryBooks")) || [];
  const categories = JSON.parse(localStorage.getItem("categories")) || [];

  totalBooksSpan.textContent = books.length;
  totalCategoriesSpan.textContent = categories.length;
  totalUsersSpan.textContent = accounts.length;

  // 📄 تصدير المستخدمين PDF
  document.getElementById("export-users-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("📄 قائمة المستخدمين", 20, 20);
    let y = 30;

    const rows = Array.from(document.querySelectorAll("#users-tbody tr")).map(tr => {
      return Array.from(tr.querySelectorAll("td")).map(td => td.innerText);
    });

    doc.autoTable({
      startY: y,
      head: [["البريد الإلكتروني", "نوع الحساب", "عدد الكتب"]],
      body: rows,
    });

    doc.save("users-report.pdf");
  });

  // 📊 تصدير المستخدمين Excel
  document.getElementById("export-users-excel").addEventListener("click", () => {
    const rows = Array.from(document.querySelectorAll("#users-tbody tr")).map(tr => {
      const cells = tr.querySelectorAll("td");
      return {
        "📧 البريد الإلكتروني": cells[0].innerText,
        "👤 نوع الحساب": cells[1].innerText,
        "📚 عدد الكتب": cells[2].innerText
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "المستخدمين");
    XLSX.writeFile(wb, "users-report.xlsx");
  });

  // 📈 تصدير الإحصائيات PDF
  document.getElementById("export-stats-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("📈 إحصائيات عامة", 20, 20);

    let y = 30;
    const stats = [
      ["عدد الكتب في المكتبة", totalBooksSpan.textContent],
      ["عدد التصنيفات", totalCategoriesSpan.textContent],
      ["عدد المستخدمين", totalUsersSpan.textContent],
    ];

    stats.forEach(([label, value]) => {
      doc.text(`${label}: ${value}`, 20, y);
      y += 10;
    });

    doc.save("stats-report.pdf");
  });

  // 📈 تصدير الإحصائيات Excel
  document.getElementById("export-stats-excel").addEventListener("click", () => {
    const rows = [{
      "📘 عدد الكتب": totalBooksSpan.textContent,
      "🧩 عدد التصنيفات": totalCategoriesSpan.textContent,
      "👥 عدد المستخدمين": totalUsersSpan.textContent
    }];

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "الإحصائيات");
    XLSX.writeFile(wb, "stats-report.xlsx");
  });
});
