import { db } from './firebase-config.js';
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("add-book-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const title = document.getElementById("book-title").value;
    const image = document.getElementById("book-image").value;
    const category = document.getElementById("book-category").value;
    const description = document.getElementById("book-description").value;
    const quantity = parseInt(document.getElementById("book-quantity").value);
    const isSuggested = document.getElementById("book-suggested").checked;

    try {
      await addDoc(collection(db, "books"), {
        title,
        image,
        category,
        description,
        available: quantity,
        suggested: isSuggested,
        createdAt: new Date()
      });

      alert("📚 تم إضافة الكتاب بنجاح!");
      form.reset();
    } catch (error) {
      console.error("❌ خطأ أثناء الإضافة:", error);
      alert("حدث خطأ أثناء إضافة الكتاب.");
    }
  });
});
