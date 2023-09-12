const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";
const searchFormSubmit = document.getElementById("searchBook");
const inputSearchTitle = document.getElementById("search-input");

// check web storage browser support
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// Load DOM content
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("input-book");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
    submitForm.reset();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Search book
inputSearchTitle.addEventListener("keyup", function (event) {
  event.preventDefault();
  searchBook();
});
searchFormSubmit.addEventListener("submit", function (event) {
  event.preventDefault();
  searchBook();
});
function searchBook() {
  const searchTitle = document
    .getElementById("search-input")
    .value.toLowerCase();
  const unfinishedBook = document.getElementById("books");
  unfinishedBook.innerHTML = "";
  const finishedBook = document.getElementById("completedBook");
  finishedBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.title.toLowerCase().includes(searchTitle)) {
      if (searchTitle == "") {
        document.dispatchEvent(new Event(RENDER_EVENT));
        return;
      } else if (!bookItem.isCompleted) {
        unfinishedBook.append(bookElement);
      } else {
        finishedBook.append(bookElement);
      }
    }
  }
}

// Load data from local
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

// Generate id
function generateId() {
  return +new Date();
}

// Create book object
function generateBookObject(
  id,
  title,
  author,
  year,
  page,
  language,
  cover,
  isCompleted
) {
  return {
    id,
    title,
    author,
    year,
    page,
    language,
    cover,
    isCompleted,
  };
}

// Check book status
function checkStatusBook() {
  const isCheckComplete = document.getElementById("inputBookIsComplete");
  if (isCheckComplete.checked) {
    return true;
  }
  return false;
}

// Save data to local
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

// Adding book
function addBook() {
  const getTitle = document.getElementById("input-title").value;
  const getAuthor = document.getElementById("input-author").value;
  const getYear = document.getElementById("input-year").value;
  const getPage = document.getElementById("input-page").value;
  const getlanguage = document.getElementById("input-language").value;
  const getCover = document.getElementById("input-link").value;
  const isChecked = checkStatusBook();

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    getTitle,
    getAuthor,
    getYear,
    getPage,
    getlanguage,
    getCover,
    isChecked
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  swal({
    position: "bottom-end",
    type: "success",
    title: "Your book has been saved",
    background: "black",
    showConfirmButton: false,
    timer: 1500,
  });
}

// Find books[] id
function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id == bookId) {
      return bookItem;
    }
  }
  return null;
}

// find books[] index
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// Button function
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
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
function editBook(bookId) {
  bookTarget = findBookIndex(bookId);
  const sectionEdit = document.querySelector(".edit-book");
  sectionEdit.style.display = "flex";
  const editTitle = document.getElementById("edit-title");
  const editAuthor = document.getElementById("edit-author");
  const editYear = document.getElementById("edit-year");
  const editPage = document.getElementById("edit-page");
  const editLanguage = document.getElementById("edit-language");
  const editCover = document.getElementById("edit-cover");
  // const formEditBook = document.getElementById("edit-book");
  const cancelEdit = document.getElementById("cancel-edit");
  const saveEdit = document.getElementById("save-edit");

  editTitle.setAttribute("value", books[bookTarget].title);
  editAuthor.setAttribute("value", books[bookTarget].author);
  editYear.setAttribute("value", books[bookTarget].year);
  editPage.setAttribute("value", books[bookTarget].page);
  editLanguage.setAttribute("value", books[bookTarget].language);
  editCover.setAttribute("value", books[bookTarget].cover);

  saveEdit.addEventListener("click", function (event) {
    event.preventDefault();
    books[bookTarget].title = editTitle.value;
    books[bookTarget].author = editAuthor.value;
    books[bookTarget].year = editYear.value;
    books[bookTarget].page = editPage.value;
    books[bookTarget].language = editLanguage.value;
    books[bookTarget].cover = editCover.value;

    swal({
      position: "bottom-end",
      type: "success",
      title: "Your book has been saved",
      background: "black",
      showConfirmButton: false,
      timer: 1500,
    });

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    sectionEdit.style.display = "none";
  });

  cancelEdit.addEventListener("click", function (event) {
    event.preventDefault();
    // formEditBook.reset();
    sectionEdit.style.display = "none";
  });
}

// Create html element to show a book list
function makeBook(bookObject) {
  const createTitle = document.createElement("h3");
  createTitle.innerText = bookObject.title;
  const createAuthor = document.createElement("p");
  createAuthor.innerText = `Author : ${bookObject.author}`;
  const createYear = document.createElement("p");
  createYear.innerText = `Year : ${bookObject.year}`;
  const createPage = document.createElement("p");
  createPage.innerText = `Page : ${bookObject.page}`;
  const createLanguage = document.createElement("p");
  createLanguage.innerText = `Language : ${bookObject.language}`;
  const containerBookDetail = document.createElement("div");
  containerBookDetail.classList.add("detail-book");
  containerBookDetail.append(
    createTitle,
    createAuthor,
    createYear,
    createPage,
    createLanguage
  );

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
  const editButton = document.createElement("button");
  editButton.classList.add("btn-edit");
  editButton.append(editIcon);
  editButton.addEventListener("click", function () {
    editBook(bookObject.id);
  });

  const containerButton = document.createElement("div");
  containerButton.classList.add("action");
  if (bookObject.isCompleted) {
    containerButton.append(undoButton, editButton, removeButton);
  } else {
    containerButton.append(checkButton, editButton, removeButton);
  }
  containerBookDetail.append(containerButton);

  const containerBook = document.createElement("div");
  containerBook.classList.add("card-book");
  containerBook.append(containerBookCover, containerBookDetail);
  containerBook.setAttribute("id", "book-${bookObject.id}");
  return containerBook;
}

// Custom render event
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

// Custom saved event
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
