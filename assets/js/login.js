document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const errorMsg = document.getElementById("login-error");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // 🧠 نسحب الحسابات من localStorage
    const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

    // 🔍 ندور على تطابق
    const matchedUser = accounts.find(acc => acc.email === email && acc.password === password);

    if (matchedUser) {
      // ✅ حفظ معلومات الدخول
      localStorage.setItem("userEmail", email);

      // 🔐 تحديد نوع الحساب
      if (email === "admin@library.com") {
        localStorage.setItem("isAdmin", "true");
        window.location.href = "admin.html"; // تحويل للأدمن
      } else {
        localStorage.setItem("isAdmin", "false");
        window.location.href = "index.html"; // تحويل للمستخدم العادي
      }
    } else {
      // ❌ عرض رسالة خطأ إذا الحساب غير موجود
      errorMsg.style.display = "block";
    }
  });
});
