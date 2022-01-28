import * as Coins from "./scripts/coins.js";
import * as Reports from "./scripts/liveReports.js";
import * as Home from "./scripts/home.js";

$(() => {
  Home.display();
  // $("#main-container").css("display", "none");
  // $(".heading").css("display", "none");

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
});
