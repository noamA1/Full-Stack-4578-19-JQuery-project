// const Coins = () => {
// $(() => {
const URL = "https://api.coingecko.com/api/v3/coins";

const displayCoins = async () => {
  //   console.log("Hello World");
  //   $("main").append("New content will be in here!");
  let cardsElements = "";
  const cardsRow = document.createElement("div");
  cardsRow.classList.add("row", "row-cols-1", "row-cols-sm-2", "row-cols-md-4");
  await getCoinsList(`${URL}/list`)
    .then((data) => {
      console.log(data.length);
      for (let i = 0; i < data.length; i++) {
        cardsElements += `
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${data[i].symbol.toUpperCase()}
                    <div class="form-check form-switch card-title__switch-container">
                        <input class="form-check-input card-title__switch-input" type="checkbox" role="switch" id="card-title__switch${i}">
                    </div>
                    </h5>
                    
                    <p class="card-text">${data[i].name}</p>
                    <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
            </div>`;
      }
      $("#main-container").append(cardsElements);
    })
    .catch((e) => {
      console.log(e);
    });
};

const getCoinsList = (url) => {
  const coinsPromise = new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      success: (result) => {
        resolve(result);
      },
      error: () => {
        reject(
          `Sorry we couldn't connect to the server, please try again in a few minutes`
        );
      },
    });
  });
  return coinsPromise;
};
// });

export { displayCoins };
// };

// main-container
