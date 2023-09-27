const xhr = new XMLHttpRequest();
const wrapper = document.querySelector(".wrapper");
const resultW = document.querySelector(".result_weather");
const btnSearch = document.querySelector("#btnSearch");
const movieValue = document.querySelector("#film");
const cardsMovie = document.querySelector(".cards_movie");
const btnsContainer = document.querySelector(".pagination");

let apiKey = "c62aa12d";

btnSearch.onclick = () => {
  const paginationCon = document.querySelector(".pagination");
  const moveSearch = document.querySelector("#movieSearch");
  const searchType = moveSearch.value.toLowerCase();
  console.log(searchType);
  let requestUrl =
    "http://www.omdbapi.com/?s=" +
    `${movieValue.value}` +
    `&plot=full` +
    `&type=${searchType}` +
    "&apikey=" +
    apiKey;
  xhr.open("GET", requestUrl);
  xhr.onload = function () {
    console.log(xhr.response);
    let filmBack = JSON.parse(xhr.response);
    console.log(filmBack);
    const searchData = filmBack.Search;
    cardsMovie.innerHTML = "";
    if (!searchData) {
      console.log("Ничего не найдено");
    } else {
      displayItems(1);
      // pagination
      function displayItems(pageN) {
        const start = (pageN - 1) * 3;
        const end = pageN * 3;
        const itemstoDisplay = searchData.slice(start, end);
        console.log(itemstoDisplay);
        for (let i = 0; i < itemstoDisplay.length; i++) {
          const card_div = document.createElement("div");
          card_div.classList.add("card_film");
          const { Poster, Title, Type, Year, imdbID } = itemstoDisplay[i];
          card_div.innerHTML = ` <div class="poster"><img src="${Poster}" alt="image"></div>
                    <div class="card_description">
                        <p class="type_card">${Type}</p>
                        <p class="title_card">${Title}</p>
                        <p class="year_card">${Year}</p>
                        <button id="details-${imdbID}" class="details">Details</button>
                    </div>`;
          cardsMovie.insertAdjacentElement("afterbegin", card_div);
        }
        //Details
        let filmInfo = document.querySelector(".film_info");
        let detailsBtn = document.querySelectorAll(".details");

        detailsBtn.forEach((i) => {
          i.addEventListener("click", (e) => {
            const movieTitle =
              e.currentTarget.previousElementSibling.previousElementSibling
                .textContent;
            const btnID = e.currentTarget.id.slice(8);
            let requestUrlFull =
              "http://www.omdbapi.com/?i=" +
              `${btnID}` +
              "&apikey=" +
              apiKey;
            xhr.open("GET", requestUrlFull);
            xhr.onload = function () {
              let newInfo = JSON.parse(xhr.response);
              // let movie = itemstoDisplay.find((j) => btnID == j.imdbID);
              const {
                Poster,
                Title,
                Type,
                Year,
                Actors,
                Awards,
                Genre,
                Released,
                Country,
                Director,
                Writer,
              } = newInfo;
              console.log(newInfo);
              filmInfo.style.display = "block";
              filmInfo.innerHTML = `<h4>Film Info:</h4>
            <div class="inner_film">
                <div class="film_banner">
                    <img  class="poster"src="${Poster}" alt="image">
                </div>
                <div class="film_description">
                    <ul class="film_about">
                        <li class="title_desk">Title:<span>${Title}</span></li>
                        <li class="realised_desk">Realised:<span>${Released}</span></li>
                        <li class="genre_desk">Genre:<span>${Genre}</span></li>
                        <li class="country_desk">Country:<span>${Country}</span></li>
                        <li class="director_desk">Director:<span>${Director}</span></li>
                        <li class="writer_desk">Writer:<span>${Writer}</span></li>
                        <li class="actors_desk">Actors:<span>${Actors}</span></li>
                        <li class="awards_desk">Awards:<span>$${Awards}</span></li>
                    </ul>
                </div>
            </div>`;
            };
            xhr.send();
          });
        });
      }
      function displayPagination(pag) {
        for (let i = 1; i <= Math.ceil(searchData.length / 3); i++) {
          pag.innerHTML += `<button class="page_btn" data-color="false" data-page=${i}>${i}</button>`;
        }
      }
      paginationCon.innerHTML = "";
      displayPagination(paginationCon);
      let btnPag = document.querySelectorAll(".page_btn");
      btnPag[0].dataset.color = true;
      btnPag[0].style.background = "red";
      paginationCon.addEventListener("click", (event) => {
        if (event.target.classList.contains("page_btn")) {
          const pageNumber = parseInt(event.target.getAttribute("data-page"));
          cardsMovie.innerHTML = "";
          btnPag.forEach((i) => {
            i.dataset.color = false;
            i.style.background = "#fff";
          });
          event.target.dataset.color = true;
          event.target.style.background = "red";
          displayItems(pageNumber);
        }
      });
    }
  };
  xhr.send();
};
