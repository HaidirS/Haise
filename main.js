let books = [];
const STORAGE_KEY = "BOOKSHELF_APPS";

// Event saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("bookForm");
  const search = document.getElementById("searchBook");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
  });

  search.addEventListener("submit", function (e) {
    e.preventDefault();
    searchBook();
  });

  if (isStorageExist()) {
    loadBooksFromStorage();
  }
});

// Fungsi buat ID unik
function generateId() {
  return +new Date();
}

// Buat object buku
function generateBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

// Tambah buku baru
function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const id = generateId();
  const bookObject = generateBookObject(id, title, author, year, isComplete);
  books.push(bookObject);
  saveBooks();
  renderBooks();
  document.getElementById("bookForm").reset();
}

// Tampilkan semua buku
function renderBooks(filter = "") {
  const incomplete = document.getElementById("incompleteBookList");
  const complete = document.getElementById("completeBookList");
  incomplete.innerHTML = "";
  complete.innerHTML = "";

  for (const book of books) {
    if (book.title.toLowerCase().includes(filter.toLowerCase())) {
      const bookEl = createBookElement(book);
      if (book.isComplete) {
        complete.appendChild(bookEl);
      } else {
        incomplete.appendChild(bookEl);
      }
    }
  }
}

// Buat elemen HTML buku
function createBookElement(book) {
  const title = document.createElement("h3");
  title.innerText = book.title;
  title.setAttribute("data-testid", "bookItemTitle");

  const author = document.createElement("p");
  author.innerText = `Penulis: ${book.author}`;
  author.setAttribute("data-testid", "bookItemAuthor");

  const year = document.createElement("p");
  year.innerText = `Tahun: ${book.year}`;
  year.setAttribute("data-testid", "bookItemYear");

  const switchBtn = document.createElement("button");
  switchBtn.innerText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  switchBtn.setAttribute("data-testid", "bookItemIsCompleteButton");
  switchBtn.addEventListener("click", () => {
    book.isComplete = !book.isComplete;
    saveBooks();
    renderBooks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Hapus Buku";
  deleteBtn.setAttribute("data-testid", "bookItemDeleteButton");
  deleteBtn.addEventListener("click", () => {
    books = books.filter((b) => b.id !== book.id);
    saveBooks();
    renderBooks();
  });

  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit Buku";
  editBtn.setAttribute("data-testid", "bookItemEditButton");
  editBtn.addEventListener("click", () => {
    const newTitle = prompt("Judul baru:", book.title);
    const newAuthor = prompt("Penulis baru:", book.author);
    const newYear = prompt("Tahun baru:", book.year);
    if (newTitle && newAuthor && newYear) {
      book.title = newTitle;
      book.author = newAuthor;
      book.year = Number(newYear);
      saveBooks();
      renderBooks();
    }
  });

  const actionDiv = document.createElement("div");
  actionDiv.append(switchBtn, deleteBtn, editBtn);

  const container = document.createElement("div");
  container.setAttribute("data-bookid", book.id);
  container.setAttribute("data-testid", "bookItem");
  container.append(title, author, year, actionDiv);

  return container;
}

// Simpan ke localStorage
function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Load data dari localStorage
function loadBooksFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    books = JSON.parse(data);
    renderBooks();
  }
}

// Cek dukungan localStorage
function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser tidak mendukung localStorage");
    return false;
  }
  return true;
}

// Fungsi pencarian buku
function searchBook() {
  const query = document.getElementById("searchBookTitle").value;
  renderBooks(query);
}
