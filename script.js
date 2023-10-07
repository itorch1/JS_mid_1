const alert = document.getElementById('alert');
const books = document.getElementById('books').querySelector('tbody');
const form = document.querySelector('form');

let timeOut;

// Book Class
class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

    static toBookArray(objArr) {
        const bookArr = objArr.reduce( (books, obj) => {
            books.push(new Book(obj.title, obj.author, obj.isbn));
            return books;
         }, []);
            
        // const bookArr = [];
        // objArr.forEach( obj => {
        //     bookArr.push(new Book(obj.title, obj.author, obj.isbn))
        // } );
        return bookArr;
    }
}

// UI Class
class UI{
    static showAlert(text, color) {
        alert.innerText = text;
        alert.style.opacity = 1;
        alert.style.transform = 'translateX(0)';
        alert.style.backgroundColor = color;
        if (timeOut)
            clearTimeout(timeOut);
        timeOut = setTimeout( () => { 
            alert.style.opacity = 0;
            alert.style.transform = 'translateX(-100%)'
        }, 3000 );
    }

    static displayBooks() {
        const storedBooks = Store.getBooks();

        storedBooks.forEach( book => UI.addBook(book) );
    }

    static addBook(book) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td class="isbn">${book.isbn}</td>
            <td><button type="button">X</button></td>
        `;
        books.appendChild(row);

        UI.clearFields();
    }

    static removeBook(bookEl) {
        bookEl.remove();
    }

    static clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// Store Class
class Store{
    static getBooks() {
        let books = [];
        if (localStorage.getItem('books')) {
            books.push(...JSON.parse(localStorage.getItem('books')));
            console.log(books)
        }

        books = Book.toBookArray(books);

        console.log('Getting books ... ', books)

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));

        console.log(books)
    }

    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach( (book, index) => {
            if (book.isbn === isbn)
                books.splice(index, 1);
        });

        localStorage.setItem('books', JSON.stringify(books));

        console.log(books)
    }
}

// Event: Display books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Add a book
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill out all the fields', 'rgb(250, 65, 41)');
        return;
    }

    const book = new Book(title, author, isbn);

    Store.addBook(book);
    UI.addBook(book);

    UI.showAlert('Book was added!', 'rgb(66, 139, 66)');

})

// Remove a book
books.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        Store.removeBook(e.target.parentElement.previousElementSibling.innerText);
        UI.removeBook(e.target.parentElement.parentElement);

        UI.showAlert('Book was removed!', 'rgb(66, 139, 66)');
    }
})