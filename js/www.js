// function edit book data
function editBookData(bookId) {
  const sectionEdit = document.querySelector(".input_edit_section");
  sectionEdit.style.display = "flex";
  const editTitle = document.getElementById("inputEditTitle");
  const editAuthor = document.getElementById("inputEditAuthor");
  const editYear = document.getElementById("inputEditYear");
  const formEditData = document.getElementById("editData");
  const cancelEdit = document.getElementById("bookEditCancel");
  const SubmitEdit = document.getElementById("bookEditSubmit");

  bookTarget = findBookIndex(bookId);

  // set old value
  editTitle.setAttribute("value", books[bookTarget].title);
  editAuthor.setAttribute("value", books[bookTarget].author);
  editYear.setAttribute("value", books[bookTarget].year);

  // update data
  SubmitEdit.addEventListener("click", (e) => {
    books[bookTarget].title = editTitle.value;
    books[bookTarget].author = editAuthor.value;
    books[bookTarget].year = editYear.value;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    formEditData.reset();
    sectionEdit.style.display = "none";
    swal("Berhasil", "Data bukumu sudah berhasil diedit", "success");
  });

  cancelEdit.addEventListener("click", (e) => {
    e.preventDefault();
    sectionEdit.style.display = "none";
    formEditData.reset();
    swal("Anda membatalkan untuk mengedit data buku");
  });
}
