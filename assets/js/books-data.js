/*const booksData = [
  {
    title: "Clean Code",
    available: 3,
    image: "111.jpg",
    category: "Programming"
  },
  {
    title: "Design Patterns",
    available: 2,
    image: "222.jpg",
    category: "Programming"
  },
  {
    title: "JavaScript: The Good Parts",
    available: 4,
    image: "333.jpg",
    category: "Programming"
  },
  {
    title: "Algorithms",
    available: 1,
    image: "444.jpg",
    category: "Algorithms"
  },
  {
    title: "Introduction to AI",
    available: 5,
    image: "555.jpg",
    category: "AI"
  }
];

// نخزنهم مرة واحدة فقط
if (!localStorage.getItem("libraryBooks")) {
  localStorage.setItem("libraryBooks", JSON.stringify(booksData));
}
/*