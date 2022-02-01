import * as Coins from "./coins.js";

const containerElement = $("#home-container");

const display = () => {
  $("#main-container").hide();
  containerElement.empty();
  containerElement.append(`
    <div class = "text-box">
        <h1 class = "heading-primary">
            <span class="heading-primary__main">Welcome to Crypto app</span>
            <span class="heading-primary__sub">All you need in one place</span>
        </h1>

        <a id="discover-button" class = "btn btn-action btn-action__animate" type="button">Let's discover</a>
        </div>
    `);
};

$(containerElement).on("click", "#discover-button", () => {
  console.log("clicked");
  Coins.display();
});

export { display };
