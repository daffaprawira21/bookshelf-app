const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

function isStorageExist() /* boolean */ {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("input-book");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, cover, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    cover,
    isCompleted,
  };
}

function checkStatusBook() {
  const isCheckComplete = document.getElementById("inputBookIsComplete");
  if (isCheckComplete.checked) {
    return true;
  }
  return false;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function addBook() {
  const getTitle = document.getElementById("input-title").value;
  const getAuthor = document.getElementById("input-author").value;
  const getYear = document.getElementById("input-year").value;
  const getCover = document.getElementById("input-link").value;
  const isChecked = checkStatusBook();

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    getTitle,
    getAuthor,
    getYear,
    getCover,
    isChecked
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// button-function
function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function makeBook(bookObject) {
  const createTitle = document.createElement("h3");
  createTitle.innerText = bookObject.title;
  const createAuthor = document.createElement("p");
  createAuthor.innerText = bookObject.author;
  const createYear = document.createElement("p");
  createYear.innerText = bookObject.year;
  const containerBookDetail = document.createElement("div");
  containerBookDetail.classList.add("detail-book");
  containerBookDetail.append(createTitle, createAuthor, createYear);

  const createCover = document.createElement("img");
  createCover.src = bookObject.cover;
  const containerBookCover = document.createElement("div");
  containerBookCover.classList.add("cover");
  containerBookCover.append(createCover);

  const checkIcon = document.createElement("i");
  checkIcon.classList.add("fa-solid", "fa-check");
  const undoIcon = document.createElement("i");
  undoIcon.classList.add("fa-solid", "fa-rotate-left");
  const removeIcon = document.createElement("i");
  removeIcon.classList.add("fa-solid", "fa-trash");
  const editIcon = document.createElement("i");
  editIcon.classList.add("fa-solid", "fa-pen-to-square");

  const undoButton = document.createElement("button");
  undoButton.classList.add("btn-undo");
  undoButton.append(undoIcon);
  undoButton.addEventListener("click", function () {
    undoBookFromCompleted(bookObject.id);
  });
  const removeButton = document.createElement("button");
  removeButton.classList.add("btn-remove");
  removeButton.append(removeIcon);
  removeButton.addEventListener("click", function () {
    removeBookFromCompleted(bookObject.id);
  });
  const checkButton = document.createElement("button");
  checkButton.classList.add("btn-check");
  checkButton.append(checkIcon);
  checkButton.addEventListener("click", function () {
    addBookToCompleted(bookObject.id);
  });

  const containerButton = document.createElement("div");
  containerButton.classList.add("action");
  if (bookObject.isCompleted) {
    containerButton.append(undoButton, removeButton);
  } else {
    containerButton.append(checkButton, removeButton);
  }
  containerBookDetail.append(containerButton);

  const containerBook = document.createElement("div");
  containerBook.classList.add("card-book");
  containerBook.append(containerBookCover, containerBookDetail);
  containerBook.setAttribute("id", "book-${bookObject.id}");
  return containerBook;
}

document.addEventListener(RENDER_EVENT, function () {
  const unfinishedBook = document.getElementById("books");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("completedBook");
  finishedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) {
      unfinishedBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
