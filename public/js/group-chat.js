(function ($) {
const socket = io('http://localhost:3000')

const mySearchForm = $('#send-container');
const message = $('#message-input');
const messageContainer = $('#message-container');

const useless = $('#useless');
const GroupId = useless.text().toString().trim();

const useless2 = $('#useless2');
const username = useless2.text().toString().trim();

const useless3 = $('#useless3');
const email = useless3.text().toString().trim();

useless.hide();
useless2.hide();
useless3.hide();

socket.emit('create-room', GroupId)

mySearchForm.submit(async (event) => {
    event.preventDefault();
    const messageText = message.val();
    mySearchForm.trigger('reset');
    message.focus();

    const messageObj = {
        username: username,
        email: email,
        message: messageText
    }
    socket.emit('send-chat-message', GroupId, messageObj)

    let requestConfig = {
        method: 'POST',
        url: '/navigation/send-message.html',
        contentType: 'application/json',
        data: JSON.stringify({
          message: messageText
        })
      };

      $.ajax(requestConfig).then(function (responseMessage) {
        let newElement = $(responseMessage);
        messageContainer.append(newElement);
    });
});

socket.on('chat-message', data => {
    const messageElement = document.createElement('div')
    messageElement.innerHTML = `<p class="text-primary fw-bold">${data.message.email}</p>
                                <p><b>Message: </b>${data.message.message}</p>`
    messageContainer.append(messageElement)
});
})(window.jQuery);