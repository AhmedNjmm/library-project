// ✅ admin-login.js
// التحقق من دخول الأدمن باستخدام Firebase Auth

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("admin-login-form");
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const errorMsg = document.getElementById("admin-login-error");

  const allowedAdminEmail = "admin@library.com"; // ✅ حدد الإيميل المسموح له بالدخول

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // تحقق من أن البريد يخص الأدمن فقط
    if (email !== allowedAdminEmail) {
      errorMsg.textContent = "🚫 هذا المستخدم غير مصرح له كأدمن.";
      errorMsg.classList.remove("d-none");
      errorMsg.classList.add("text-danger", "mt-2");
      return;
    }

    // تسجيل الدخول من Firebase
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        window.location.href = "admin.html";
      })
      .catch(error => {
        errorMsg.textContent = "❌ خطأ في تسجيل الدخول: " + error.message;
        errorMsg.classList.remove("d-none");
        errorMsg.classList.add("text-danger", "mt-2");
      });
  });
});
