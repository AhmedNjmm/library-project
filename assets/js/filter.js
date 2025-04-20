document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const bookCards = document.querySelectorAll(".book-card");
  const noBooksMessage = document.getElementById("no-books");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      const category = button.getAttribute("data-category");

      // 🔵 أزِل التفعيل من كل الأزرار
      filterButtons.forEach(btn => btn.classList.remove("active"));

      // 🟦 فعّل الزر اللي تم الضغط عليه
      button.classList.add("active");

      let found = false; // بنستخدمه نعرف إذا في كتب ظاهرة

      bookCards.forEach(card => {
        if (category === "الكل") {
          card.style.display = "block";
          found = true;
        } else {
          if (card.classList.contains(category)) {
            card.style.display = "block";
            found = true;
          } else {
            card.style.display = "none";
          }
        }
      });

      // 👀 إظهار أو إخفاء الرسالة حسب النتيجة
      if (!found) {
        noBooksMessage.style.display = "block";
      } else {
        noBooksMessage.style.display = "none";
      }
    });
  });
});
