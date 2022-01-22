import * as Coins from "./coins.js";
const URL = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=";
const KEY = "72d2bdd4625d390ff6f2e343418ade46259b4465e7c9cbbe4508d263dcc6db69";
const containerElement = $("#main-container");

// Initial values for the chart
let dataPoints = [],
  data = [];
let coinsArray = [];
let chart;

const options = {
  exportEnabled: true,
  animationEnabled: true,
  title: {
    text: "",
  },

  axisX: {
    title: "Time",
    labelFormatter: function (e) {
      return CanvasJS.formatDate(e.value, "HH mm");
    },
  },
  axisY: {
    title: "Coins value",
    titleFontColor: "#4F81BC",
    lineColor: "#4F81BC",
    labelFontColor: "#4F81BC",
    tickColor: "#4F81BC",
  },

  toolTip: {
    shared: true,
  },
  legend: {
    cursor: "pointer",
  },
};

const display = async (array) => {
  if (array.length === 0) {
    alert("Sorry, you must select at least one coin to display this report");
    Coins.display();
    return;
  }
  let titleText = "";
  containerElement.empty();
  coinsArray = array;

  containerElement.append(`<div id="chartContainer"></div>`);

  addData(array);
  await $.each(array, (key, value) => {
    titleText += `${value.symbol.toUpperCase()},`;
    dataPoints.push({ coinSymbol: value.symbol, points: [] });

    data.push({
      type: "line",
      name: value.symbol,
      showInLegend: true,
      dataPoints: dataPoints.find(
        (coinPoints) => coinPoints.coinSymbol === value.symbol
      ).points,
    });
  });

  titleText += ` To USD`;
  options.title.text = titleText;
  options.data = data;

  chart = new CanvasJS.Chart("chartContainer", options);

  containerElement.append(chart);
  chart.render();
  setTimeout(() => {
    addData(coinsArray);
  }, 3000);
};

const addData = async (coins) => {
  await getDataFromServer(URL, coins)
    .then((coinsData) => {
      $.each(coinsData, (key, value) => {
        dataPoints
          .find((point) => point.coinSymbol.toUpperCase() === key)
          .points.push({
            x: new Date(),
            y: value.USD,
          });

        data.find(
          (element) => element.name.toUpperCase() === key
        ).dataPoints.points = dataPoints.points;
      });
    })
    .catch((e) => {
      console.log(e);
    });
  chart.render();
};

const getDataFromServer = (url, coinsArray) => {
  let finalUrl = url;
  for (let i = 0; i < coinsArray.length; i++) {
    finalUrl += `${coinsArray[i].symbol},`;
  }
  finalUrl.substring(finalUrl.length - 1);
  finalUrl += `&tsyms=USD&api_key=${KEY}`;

  const coinsPromise = new Promise((resolve, reject) => {
    $.ajax({
      url: finalUrl,
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

export { display };
