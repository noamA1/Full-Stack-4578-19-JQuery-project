const URL = "https://api.coingecko.com/api/v3/coins";
const coinsCardContainerElement = $("#main-container");
let selectedCoinsCounter = 0;

const displayCoins = async () => {
  let cardsElements;

  coinsCardContainerElement.empty();
  await getDataFromServer(`${URL}/list`)
    .then((data) => {
      cardsElements = createCardsElements(data);
      coinsCardContainerElement.append(cardsElements);
    })
    .catch((e) => {
      console.log(e);
    });
};

const createCardsElements = (coinsArray) => {
  let cards = "";
  for (let i = 0; i < 100; i++) {
    cards += `<div class="card">
                <div class="card-body">
                    <h5 class="card-title">${coinsArray[
                      i
                    ].symbol.toUpperCase()}</h5>
                    <div class="form-check form-switch card-title__switch-container">
                        <input class="form-check-input card-title__switch-input" type="checkbox" role="switch" id="card-title__switch${i}">
                    </div>
                    <p class="card-text">${coinsArray[i].name}</p>
                    <button class="btn btn-primary card__more-info-button" id = "${
                      coinsArray[i].id
                    }">More info</button>
                    <div class = "card__coin-info-container" id = "coin-info-${
                      coinsArray[i].id
                    }" ></div>
                </div>
            </div>`;
  }
  return cards;
};

const getDataFromServer = (url) => {
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

coinsCardContainerElement.on(
  "click",
  ".card__more-info-button",
  async (event) => {
    const coinId = event.currentTarget.id;
    const infoContainer = $(`#coin-info-${coinId}`);
    infoContainer.empty();
    let coinInfo = {};

    if (sessionStorage.getItem(`${coinId}`)) {
      coinInfo = JSON.parse(sessionStorage.getItem(`${coinId}`));
    } else {
      await getDataFromServer(`${URL}/${coinId}`).then((info) => {
        coinInfo = {
          img: info.image.small,
          usd: info.market_data.current_price.usd,
          nis: info.market_data.current_price.ils,
          eur: info.market_data.current_price.eur,
        };
        saveInSessionStorage(coinInfo, coinId);
      });
    }
    toggleCoinInfo(infoContainer, coinInfo);
  }
);

const toggleCoinInfo = (containerElement, coinObject) => {
  containerElement.append(`
      <div class = "card__coin-info-image">
          <img src = "${coinObject.img}"/>
      </div>
      <ul class = "card__coin-info-list">
          <li class = "card__coin-info-list-item"> Price in dollars: ${coinObject.usd} &#36;</li>
          <li class = "card__coin-info-list-item"> Price in new israeli shekel: ${coinObject.nis} &#8362;</li>
          <li class = "card__coin-info-list-item"> Price in euro: ${coinObject.eur} &#8364;</li>
      </ul>
  `);
  containerElement.slideToggle(2000);
};

const saveInSessionStorage = (objectToSave, coinObjId) => {
  sessionStorage.setItem(`${coinObjId}`, JSON.stringify(objectToSave));
  setTimeout(() => {
    sessionStorage.removeItem(`${coinObjId}`);
  }, 12000);
};

export { displayCoins };
