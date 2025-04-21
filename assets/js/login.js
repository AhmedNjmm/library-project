document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const errorMsg = document.getElementById("login-error");

  // 🧠  ما بتحتاج لانو اصلا هاد الملف منادي علي في اللوج ان ومهيأه هناك تهيئة Firebase

  const auth = firebase.auth();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        localStorage.setItem("userEmail", email);
        const isAdmin = (email === "admin@library.com");
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

        window.location.href = isAdmin ? "admin.html" : "index.html";
      })
      .catch(error => {
        console.error("Firebase login error:", error.message);
        errorMsg.style.display = "block";
      });
  });
});
