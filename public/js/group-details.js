const button = document.getElementById("stripe");

const checkout = async () =>{
    const request = await fetch('/navigation/checkout-page',{method:"GET"})
    const response = await request.json();
    document.location.replace(response.url)
}
button.addEventListener("click",checkout);
