const button = document.getElementById("stripe");
// const stripe = require("stripe")('sk_test_51MAdqdGXsyLIL2myfowY9UaAZt0rMOB9Z7A26k5yxVMMjLPunw4OTm8ZZMYp9HzvuOLUyBQPMd1NiMZqFd0Jr4Ci00chGfRsuW')

const checkout = async () =>{
    const request = await fetch('/navigation/checkout-page',{method:"GET"})
    const response = await request.json();
    document.location.replace(response.url)
    console.log(response)
}
button.addEventListener("click",checkout);
