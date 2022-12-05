const button = document.getElementById("stripe");

const mySearchForm = $('#group-chat');

const groupChatId = $('#group-chat-id')

const groupId = "1";

const checkout = async () =>{
    const request = await fetch('/navigation/checkout-page',{method:"GET"})
    const response = await request.json();
    document.location.replace(response.url)
}
button.addEventListener("click",checkout);

mySearchForm.submit(async (event) => {
    event.preventDefault();
    const id = groupChatId.text().toString().trim();
    mySearchForm.attr('action', '/navigation/chat/' + id);
    event.target.submit();
    // console.log(id)
});
