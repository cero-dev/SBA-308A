function addBook(title, coverID){
    const mainContainer = document.getElementById("mainContainer");
    const bookContainer = document.createElement("div")
    bookContainer.classList.add("bookContainer");

    const bookTitle = document.createElement("h3");
    const bookImage = document.createElement("img");

    bookTitle.textContent = title;

    if(coverID){
        bookImage.src = `https://covers.openlibrary.org/b/id/${coverID}-L.jpg`;
        bookImage.alt = title;
    }else {
        // if there is no cover found use a placeholder cover at the right size
        bookImage.src = "./images/demo_cover.png"; 
        bookImage.alt = "No Cover Available";
        bookImage.style.height = "500px";
        bookImage.style.width = "316px";
    }

    bookContainer.appendChild(bookTitle);
    bookContainer.appendChild(bookImage);
    mainContainer.appendChild(bookContainer);
}

function authorSearch(){
    const authorName = document.getElementById("searchInput").value
    if (authorName === "") {
        alert("Please enter an author's name.");
        return;
    }

    fetch(`https://openlibrary.org/search.json?author=${authorName}`)
        .then(response => {
            if(!response.ok){
                throw new Error ("Network response was not ok!");
            }
            return response.json();
        })
        .then(data => {
            const docs = data.docs;
            if(!docs || docs.length === 0){
                throw new Error("Author not found!")
            }

            // if by searching there are multiple potential authors,
            // only store the first element of the returned array of authors
            // instead of the entire array of authors, if it's not an array just return the author_key
            if(Array.isArray(docs[0].author_key)){
                const authorID = docs[0].author_key[0];
                const worksUrl = `https://openlibrary.org/authors/${authorID}/works.json`;
                return fetch(worksUrl);
            }else {
                const authorID = docs[0].author_key
                const worksUrl = `https://openlibrary.org/authors/${authorID}/works.json`;
                return fetch(worksUrl);
            }
        })
        .then(response => response.json())
        .then(data => {
            const works = data.entries;
            document.getElementById("mainContainer").innerHTML = "";
            for (let work of works) {
                addBook(work.title, work.covers ? work.covers[0] : null);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            alert("Author not found or an error occurred.");
        });
}

