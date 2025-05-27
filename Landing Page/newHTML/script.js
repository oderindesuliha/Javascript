const bookList = document.getElementsByClassName("title");

// const isArray = Array.isArray(Array.from(bookList));
// console.log(isArray);
//
// let arr = Array.from(bookList);
//
// arr.forEach((element)=> {
//     console.log(element);
// })
// // bookList.forEach(book => {})

//const bookList = document.getElementsByClassName("title");

// // bookList.addEventListener("click", (event) => {
//     console.log(event);
//     // const deletion = event.target.parentElement.remove();
//     if (event.target.textContent === "delete") {
//         const li= event.target.parentElement;
//         bookList.removeChild(li);
//
//     }
// })
addBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    console.log(event);
})