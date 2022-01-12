// import { display } from "./scripts/coins.js";
import * as Coins from "./scripts/coins.js";

$(() => {
  $("#nav-coins-button").click(() => {
    Coins.display();
  });
});
