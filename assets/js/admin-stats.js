// ✅ admin-stats.js (محدث بالكامل لـ Firebase)

document.addEventListener("DOMContentLoaded", function () {
  const db = firebase.firestore();
  const usersTbody = document.getElementById("users-tbody");
  const totalBooksSpan = document.getElementById("total-books");
  const totalCategoriesSpan = document.getElementById("total-categories");
  const totalUsersSpan = document.getElementById("total-users");

  // ✅ جلب عدد الكتب
  db.collection("books").get().then(snapshot => {
    totalBooksSpan.textContent = snapshot.size;
  });

  // ✅ جلب عدد التصنيفات
  db.collection("categories").get().then(snapshot => {
    totalCategoriesSpan.textContent = snapshot.size;
  });

  // ✅ جلب الاستعارات لكل مستخدم
  const borrowMap = {}; // { email: count }
  db.collection("borrows").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!borrowMap[data.user]) {
        borrowMap[data.user] = 0;
      }
      borrowMap[data.user]++;
    });

    // ✅ عرض المستخدمين (من قائمة المستخدمين في الاستعارات فقط)
    const uniqueEmails = Object.keys(borrowMap);
    totalUsersSpan.textContent = uniqueEmails.length;
    usersTbody.innerHTML = "";

    uniqueEmails.forEach(email => {
      const tr = document.createElement("tr");
      const type = email === "admin@library.com" ? "مشرف" : "طالب";
      tr.innerHTML = `
        <td>${email}</td>
        <td>${type}</td>
        <td>${borrowMap[email]}</td>
      `;
      usersTbody.appendChild(tr);
    });
  });

  // 📄 تصدير المستخدمين PDF
  document.getElementById("export-users-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("📄 قائمة المستخدمين", 20, 20);
    const rows = Array.from(document.querySelectorAll("#users-tbody tr")).map(tr => {
      return Array.from(tr.querySelectorAll("td")).map(td => td.innerText);
    });
    doc.autoTable({
      startY: 30,
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
    const stats = [
      ["عدد الكتب في المكتبة", totalBooksSpan.textContent],
      ["عدد التصنيفات", totalCategoriesSpan.textContent],
      ["عدد المستخدمين", totalUsersSpan.textContent],
    ];
    let y = 30;
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
