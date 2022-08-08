let myBookmarks = [];
// const inputEl = document.getElementById("input-el");
// window.alert(inputEl)
const searchBtn = document.getElementById("search-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const markerFromLocalStorage = JSON.parse( localStorage.getItem("myBookmarks") );
const tabBtn = document.getElementById("tab-btn");
// const searchEL = inputEl;
// const searchResults = document.getElementById("search-results");
// const searchEL = 'Hi';
// window.alert(searchEL);

if  (markerFromLocalStorage) {
    myBookmarks = markerFromLocalStorage; //array of bookmarked item
    render(myBookmarks);
}

tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){ //web api to get details of tab
        myBookmarks.push(tabs[0].url);
        localStorage.setItem("myBookmarks", JSON.stringify(myBookmarks) );
        render(myBookmarks);
    });
});

function render (marker) { //create list with elements in bookmark
    let listItems = "";
    for (let i = 0; i < marker.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${marker[i]}'>
                    ${marker[i]}
                </a>
            </li>
        `;
    }
    ulEl.innerHTML = listItems;
}

deleteBtn.addEventListener("dblclick", function() {
    localStorage.clear();
    myBookmarks = [];
    render(myBookmarks);
});

searchBtn.addEventListener("click", function() {
    let inputEl = document.getElementById("input-el").value;
   let searchEL = inputEl;
    // window.alert(searchEL);
    chrome.history.search({text: searchEL}, function(data) {
        let callHistory = (hisData) => {
            let urlString = "";
            for (let i = 0; i < hisData.length; i++) {
                urlString += `
                <li style="margin-left:100px">
                <a target='_blank' href='${hisData[i].url}'>
                    ${hisData[i].url}
                 </a>
                 </li>
                `; 
            }
            return urlString;
        };
        let writehTML = `
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Search Result</title>
        <style>
        div {
            text-align: centre;
            margin-left: 100px;
        }
        #heading {
            margin-left: 50px;
            text-align: centre;
            font-size: 50px;
            color: red;
        }
        </style>
       </head>
    <body>
        <h1 id="heading">21st Century Bookmark History Search</h1>
        <div>
            ${callHistory(data)}
        </div>
    </body>
        `;
        let opened = window.open("");
        opened.document.write(writehTML);
    });
});