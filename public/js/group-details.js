const button = document.getElementById("pay");
const star5 = document.getElementById("star5");
const star4 = document.getElementById("star4");
const star3 = document.getElementById("star3");
const star2 = document.getElementById("star2");
const star1 = document.getElementById("star1");

const checkout = async () =>{
    const request = await fetch('/navigation/checkout-page',{method:"GET"})
    const response = await request.json();
    document.location.replace(response.url)
}
button.addEventListener("click",checkout);