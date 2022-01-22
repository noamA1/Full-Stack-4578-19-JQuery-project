import * as Coins from "./scripts/coins.js";
import * as Reports from "./scripts/liveReports.js";

$(() => {
  $("#nav-coins-button").click(() => {
    Coins.display();
  });
  $("#nav-reports-button").click(() => {
    const selectedCoins = Coins.selectedCoinsArray;

    Reports.display(selectedCoins);
  });
});
