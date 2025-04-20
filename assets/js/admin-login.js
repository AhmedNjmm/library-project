document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("admin-login-form");
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const errorMsg = document.getElementById("admin-login-error");

  const adminAccount = {
    email: "admin@library.com",
    password: "admin123"
  };

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === adminAccount.email && password === adminAccount.password) {
      localStorage.setItem("userEmail", email); // بنحفظه إذا بدنا نستخدمه لاحقًا
      localStorage.setItem("isAdmin", "true");
      window.location.href = "admin.html"; // ⬅️ هاي الصفحة اللي بتحوّل عليها
    } else {
      errorMsg.textContent = "❌ بيانات غير صحيحة!";
      errorMsg.classList.remove("d-none");
      errorMsg.classList.add("text-danger", "mt-2");
    }
  });
});
