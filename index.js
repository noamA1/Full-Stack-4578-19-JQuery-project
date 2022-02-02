import * as Coins from "./scripts/coins.js";
import * as Reports from "./scripts/liveReports.js";
import * as Home from "./scripts/home.js";
import * as About from "./scripts/about.js";

$(() => {
  Home.display();

  $("#nav-coins-button").click(() => {
    Coins.display();
  });

  $("#nav-reports-button").click(() => {
    const selectedCoins = Coins.selectedCoinsArray;

    Reports.display(selectedCoins);
  });

  $("#nav-home-button").click(() => {
    $("#home-container").show();
    $("#main-container").hide();
    $(".heading").hide();
    Home.display();
  });

  $("#nav-about-button").click(() => {
    About.display();
  });
});
