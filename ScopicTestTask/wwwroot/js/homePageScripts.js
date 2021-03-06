﻿$(document).ready(function () {

    $('#antiqueTable').on('click', '.bidNowBtn', function () {
        var antiqueId = $(this).data("bid_now");
        var url = '/Home/ItemDetails?antiqueId=' + antiqueId;
        window.location.href = url;
    });


    //Initialise Main Table
    var carouselIndex = 1;
    var table = $("#antiqueTable").DataTable({
        "language": {
            "info": "Showing _START_ to _END_ of _TOTAL_ antiques",
            "sLengthMenu": "Display _MENU_ antiques"
        },
        "autoWidth": false,
        pageLength: 10,
        ajax: {
            url: "/api/antique/ClientGetAllAntiques",
            dataSrc: ""
        },
        columns: [
            {
                "width": "25%",
                data: "Id",
                render: function (data, type, antique) {

                    if (antique.PhotoPaths != null && antique.PhotoPaths.length > 0) {
                        var output = '';
                        for (let i = 0; i < antique.PhotoPaths.length; i++) {
                            if (i == 0) {
                                output += `<div id="carouselExampleIndicators` + carouselIndex + `" class="carousel slide" data-ride="carousel">
                                                                       <ol class="carousel-indicators">`;
                                for (let j = 0; j < antique.PhotoPaths.length; j++) {
                                    if (j == 0)
                                        output += `<li data-target="#carouselExampleIndicators` + carouselIndex + `" data-slide-to="` + j + `" class="active"></li>`;
                                    else
                                        output += `<li data-target="#carouselExampleIndicators` + carouselIndex + `" data-slide-to="` + j + `"></li>`;
                                }

                                output += `</ol>
                                                               <div class="carousel-inner">
                                                               <div class="carousel-item active">
                                                               <img class="d-block w-100" src="` + antique.PhotoPaths[i] + `">
                                                               </div>`;
                            }
                            else {
                                output += `<div class="carousel-item">
                                                               <img class="d-block w-100" src="` + antique.PhotoPaths[i] + `">
                                                               </div>`;
                            }

                        }
                        output += `</div>
                                                       <a class="carousel-control-prev" href="#carouselExampleIndicators`+ carouselIndex + `" role="button" data-slide="prev">
                                                       <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                       <span class="sr-only">Previous</span>
                                                       </a>
                                                       <a class="carousel-control-next" href="#carouselExampleIndicators`+ carouselIndex + `" role="button" data-slide="next">
                                                       <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                       <span class="sr-only">Next</span>
                                                       </a>
                                                       </div>`;
                        ++carouselIndex;
                        return output;

                    }
                    else {
                        return "<img src='/images/antiqueDefaultImage.jpg' height='236px' width='245px' />";
                    }

                }
            },
            {
                "width": "15%",
                data: "Name"
            },
            {
                data: "Description"
            },
            {
                "width": "10%",
                data: "CurrentBid",
                render: function (data, type, antique) {
                    var price = parseInt(antique.CurrentBid) == 0 ? antique.BasePrice : antique.CurrentBid;
                    return "<i class='fa fa-usd' aria-hidden='true'></i>" + price;
                }
            },
            {
                orderable: false,
                "width": "12%",
                data: "Id",
                render: function (data) {
                    return "<button style='margin-left:13%;' class='btn btn-info btn-sm btn-flat bidNowBtn' data-bid_now='" + data + "'>Bid Now</button>";
                }
            }
        ]
    });

    //Initialise Main Table End

    table.columns().iterator('column', function (ctx, idx) {
        $(table.column(idx).header()).append('<span class="sort-icon"/>');
    });
});