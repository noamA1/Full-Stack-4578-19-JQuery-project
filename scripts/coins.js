const URL = "https://api.coingecko.com/api/v3/coins";
const coinsCardContainerElement = $("#main-container");
const serchButtonElement = $(".nav-form__search-coin-button");
let selectedCoinsArray = [],
  coinsArray = [];

const display = async () => {
  coinsCardContainerElement.show();
  coinsCardContainerElement.empty();
  $("#home-container").hide();
  $(".heading").show();
  createSpinner(coinsCardContainerElement);
  await getDataFromServer(`${URL}/list`)
    .then((data) => {
      coinsArray = [...data];
      displayCoins(coinsArray);
      // $(".spinner").hide();
    })
    .catch((e) => {
      $("html")
        .prepend(`<div class="alert alert-warning d-flex align-items-center alert-dismissible fade show" role="alert">
      <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
        <use xlink:href="#exclamation-triangle-fill"/>
      </svg>
      <div> ${e}</div>
    </div>`);
    });
  $(".spinner").remove();
};
const displayCoins = (coinsToDisplay) => {
  let cardsElements;

  coinsCardContainerElement.empty();
  cardsElements = createCardsElements(coinsToDisplay);
  coinsCardContainerElement.append(cardsElements);
};

const createCardsElements = (coinsArrayForCards) => {
  let cards = "";

  for (let i = 0; i < 100; i++) {
    cards += `<div class="card">
                <div class="card-body">
                    <h5 class="card-title">${coinsArrayForCards[
                      i
                    ].symbol.toUpperCase()}</h5>
                    <div class="form-check form-switch card-title__switch-container">
                        <input class="form-check-input card-title__switch-input" type="checkbox" role="switch" id="coin-switch-${
                          coinsArrayForCards[i].id
                        }" ${
      checkIfSelected(coinsArrayForCards[i].id) ? "checked" : ""
    }>
                    </div>
                    <p class="card-text">${coinsArrayForCards[i].name}</p>
                    <a data-bs-toggle="collapse" href="#collapse-coin-info-${
                      coinsArrayForCards[i].id
                    }" 
                    role="button" class="btn btn-action card__more-info-button" id = "${
                      coinsArrayForCards[i].id
                    }">More info</a>
                    
                    <div class="collapse" id="collapse-coin-info-${
                      coinsArrayForCards[i].id
                    }"></div>
                </div>
            </div>`;
  }
  return cards;
};

const createSpinner = (elementToAppend) => {
  elementToAppend.append(`
  <div class="spinner d-flex justify-content-center">
  <span class="spinner-text">Loading...</span>
    <div class="spinner-border" role="status">
      </div>
  </div>`);
};

const checkIfSelected = (coinId) => {
  const isSelected = selectedCoinsArray.find(
    (selectedCoin) => selectedCoin.id === coinId
  )
    ? true
    : false;
  return isSelected;
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
    const infoContainer = $(`#collapse-coin-info-${coinId}`);
    infoContainer.empty();
    let coinInfo = {};

    if (sessionStorage.getItem(`${coinId}`)) {
      coinInfo = JSON.parse(sessionStorage.getItem(`${coinId}`));
    } else {
      createSpinner(infoContainer);
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

    $(".spinner").remove();
    toggleCoinInfo(infoContainer, coinInfo);
  }
);

const toggleCoinInfo = (containerElement, coinObject) => {
  // $(".spinner").hide();
  containerElement.append(`
      <div class = "card__coin-info-image">
          <img src = "${coinObject.img}"/>
      </div>
      <ul class = "list-group list-group-flush card__coin-info-list">
          <li class = "list-group-item card__coin-info-list-item"> In dollars: ${coinObject.usd} &#36;</li>
          <li class = "list-group-item card__coin-info-list-item"> In new israeli shekel: ${coinObject.nis} &#8362;</li>
          <li class = "list-group-item card__coin-info-list-item"> In euro: ${coinObject.eur} &#8364;</li>
      </ul>
  `);
};

const saveInSessionStorage = (objectToSave, coinObjId) => {
  sessionStorage.setItem(`${coinObjId}`, JSON.stringify(objectToSave));
  setTimeout(() => {
    sessionStorage.removeItem(`${coinObjId}`);
  }, 4000);
};

// serch coin logic
serchButtonElement.click((event) => {
  event.preventDefault();
  const serchKeyWord = $(".nav-form__search-coin-input").val();
  console.log(`${serchKeyWord.toLowerCase()}`);
  const filteredCoinsArray = coinsArray.filter((coin) => {
    if (coin.id.includes(serchKeyWord.toLowerCase())) {
      return coin;
    }
  });
  console.log(filteredCoinsArray);
  displayCoins(filteredCoinsArray);
});

// selected coins and display modal

$(coinsCardContainerElement).on(
  "click",
  ".card-title__switch-input",
  (event) => {
    const coinSwitchElement = event.currentTarget;
    changeSelectedCoins(coinSwitchElement, false);
  }
);

const showCoinsModal = () => {
  let selectedCoinsStr = "";
  const modalBodyElement = $(".modal-body");
  modalBodyElement.empty();
  for (let i = 0; i < selectedCoinsArray.length - 1; i++) {
    selectedCoinsStr += `
    <div class = "modal__selected-coin">
        <p>${selectedCoinsArray[i].symbol.toUpperCase()}</p>
        <div class="form-check form-switch modal__switch-container">
            <input class="form-check-input modal__switch-input" type="checkbox" checked role="switch" id="coin-switch-${
              selectedCoinsArray[i].id
            }">
        </div>
    </div>`;
  }

  modalBodyElement.append(selectedCoinsStr);

  $("#coins-modal").modal("show");
};
$("#coins-modal").on("click", ".modal__switch-input", (event) => {
  changeSelectedCoins(event.currentTarget, true);
});

$(".modal__close-button").click(() => {
  const lastCoin = selectedCoinsArray.pop();
  $(coinsCardContainerElement).find(
    `#coin-switch-${lastCoin.id}`
  )[0].checked = false;
});

const changeSelectedCoins = (coinSwitchElement, isFromModal) => {
  const coinId = coinSwitchElement.id.substr(12);
  const coinToAddOrRemove = coinsArray.find((coin) => coin.id === coinId);

  if (!isFromModal) {
    if (coinSwitchElement.checked) {
      selectedCoinsArray.push(coinToAddOrRemove);

      if (selectedCoinsArray.length >= 6) {
        showCoinsModal();
      }
    } else {
      selectedCoinsArray.splice(
        $.inArray(coinToAddOrRemove, selectedCoinsArray),
        1
      );
    }
  } else {
    selectedCoinsArray.splice(
      $.inArray(coinToAddOrRemove, selectedCoinsArray),
      1
    );

    $(coinsCardContainerElement).find(
      `#coin-switch-${coinId}`
    )[0].checked = false;

    $("#coins-modal").modal("hide");
  }
};

export { display, selectedCoinsArray, createSpinner };
