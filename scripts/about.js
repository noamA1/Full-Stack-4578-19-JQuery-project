const containerElement = $("#main-container");

const display = () => {
  //   containerElement.show();
  containerElement.empty();
  //   $(".heading").show();
  containerElement.append(`
  
    <div class = "about-text-box">
        <h1 class = "about-title"> About Me </h1>
        <p class = "about-text">
            My name is Noam amron.
            I am an industrial and management engineer, 31 years old from Jerusalem, very connected and loves the world of software and the Internet, with academic experience in programming.
            This project which is written in javascript and through jquery library, shows the virtual currencies available in the market today, more then 12 thousand different currencies, the information about the currencies I imported from https://api.coingecko.com/api/v3/coins API.
            On the site you can get information about the value of the currencies by dollar, euro and new shekel, and you can also select up to 5 coins from the list in order to get a real-time graphical view of the value of the currencies in dollars.
        </p>
        <p class = "about-footer">My email: <span class = "span-email">noam0574@gmail.com</span></p>
    </div>

    <div class = "about-image-box">
        <img src = "img/about-img.jpg" class = "about-img"/> 
    </div>
    `);
};

export { display };
