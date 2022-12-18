const footer = $('#footer');
let url      = window.location.href;

if(url.toString().includes('chat')){
    footer.hide();
} else {
    footer.show
}
