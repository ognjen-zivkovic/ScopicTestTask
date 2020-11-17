"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/bidamounthub").build();



connection.on("ReceiveMessage", function (message) {
    $(".product-main-price").html('$' + message + ',00 <small class="text-muted">Current Highest Bid</small>');
    $("input[name = 'demo1']").trigger('touchspin.destroy');
    $("input[name = 'demo1']").TouchSpin({
        initval: parseInt(message) + 1,
        max: 1000000000,
        min: parseInt(message) + 1,
        buttondown_class: 'btn btn-white',
        buttonup_class: 'btn btn-white'

    });
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

function sendMessage(message) {
    connection.invoke("SendMessage", message).catch(function (err) {
        return console.error(err.toString());
    });

}