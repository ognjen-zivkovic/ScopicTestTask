$(document).ready(function () {

    var antiqueId = $("#antiqueIdInput").val();
    function initialiseTouchSpin(value) {
        $("input[name = 'demo1']").TouchSpin({
            initval: value + 1,
            max: 1000000000,
            min: value + 1,
            buttondown_class: 'btn btn-white',
            buttonup_class: 'btn btn-white'

        });
    }
    function initialiseBidHistoryTable(antiqueId) {
        var table = $("#bidHistoryTable").DataTable({
            destroy: true,
            pageLength: 10,
            ajax: {
                url: "/api/BidHistory/" + antiqueId,
                dataSrc: ""
            },
            columns: [
                {
                    data: "BidTime",
                    render: function (data) {

                        var date = new Date(data);
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        var day = date.getDate();
                        var hour = date.getHours();
                        var minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
                        return year + "/" + month + "/" + day + " " + hour + ":" + minute;
                    }
                },
                {
                    data: "BidAmount"
                }
            ]
        });
    }

    $("#historyBtn").click(function () {
        var antiqueId = $(this).data("antiqueid");
        $('#bidHistory-form').modal('toggle');
        initialiseBidHistoryTable(antiqueId);
    });

    $("#submitBtn").click(function () {
        var message = $("#touchSpin").val();
        var data = {
            AntiqueId: parseInt($(this).data("antiqueid")),
            BidAmount: parseInt($("#touchSpin").val())
        };
        $.ajax({
            url: '/api/BidHistory/',
            type: 'POST',
            contentType: "application/json;charset=utf-8",
            data: JSON.stringify(data),
            statusCode: {
                2: function (response) {
                    toastr.warning("Bid time has elapsed")
                },
                1: function (response) {
                    toastr.warning("Your bid is already the highest one")
                }
            },
            success: function (data) {
                toastr.success("Bid placed successfully");
                $(".product-main-price").html('$' + data + ',00 <small class="text-muted">Current Highest Bid</small>')
                $("input[name = 'demo1']").trigger('touchspin.destroy');
                initialiseTouchSpin(data);
                //signalR send message after submit                   
                sendMessage(message);
                //signalR send message after submit end
            },
            error: function () {
            }
        });
    });


    function countDownTimer(BidEnd) {
        const second = 1000,
            minute = second * 60,
            hour = minute * 60,
            day = hour * 24;

        let countDown = new Date(BidEnd).getTime(),
            x = setInterval(function () {

                let now = new Date().getTime(),
                    distance = countDown - now;
                var days = Math.floor(distance / (day))
                var hours = Math.floor((distance % (day)) / (hour));
                var minutes = Math.floor((distance % (hour)) / (minute));
                var seconds = Math.floor((distance % (minute)) / second);
                $("#days").html(days),
                    $("#hours").html(hours),
                    $("#minutes").html(minutes),
                    $("#seconds").html(seconds);
                if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
                    clearInterval(x);
                }

            }, 0)
    }


    var carouselIndex = 1;
    $.ajax({
        url: '/api/Antique/ClientGetAntiqueById/' + antiqueId,
        type: 'GET',
        contentType: "application/json;charset=utf-8",
        success: function (antique) {
            var output = '';
            if (antique.PhotoPaths != null) {

                for (let i = 0; i < antique.PhotoPaths.length; i++) {
                    $(".antique-images").append(`<div>
                                                         <div class="image">
                                                         <img src='`+ antique.PhotoPaths[i] + `'></img>
                                                         </div>
                                                         </div>`);
                }
            }
            else {
                return "<img src='/images/antiqueDefaultImage.jpg' height='40px' width='40px' />";
            }
            var price = antique.CurrentBid == 0 ? antique.BasePrice : antique.CurrentBid;
            $(".product-main-price").html('$' + price + ',00 <small class="text-muted">Current Highest Bid</small>');
            $(".antiqueName").html(antique.Name);
            $(".descriptionBox").html(antique.Description);
            $('.antique-images').slick({
                dots: true
            });
            countDownTimer(antique.BidEnd);

            initialiseTouchSpin(price);
            $("#touchSpin").removeClass("form-control");

            $("#submitBtn").data("antiqueid", antique.Id);
            $("#historyBtn").data("antiqueid", antique.Id);
        }

    });
});
