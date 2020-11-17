$(document).ready(function () {
    function initialiseBidHistoryTable(antiqueId) {
        var table = $("#bidHistoryTable").DataTable({
            destroy: true,
            pageLength: 10,
            "order": [[2, "asc"]],
            ajax: {
                url: "/api/BidHistory/" + antiqueId,
                dataSrc: ""
            },
            columns: [
                {
                    data: "User"
                },
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

    function uploadPhotos(input, AntiqueId, getPhotosCheck) {
        var files = input.files;
        var formData = new FormData();
        if (files.length == 0 && getPhotosCheck != null) {
            toastr.warning("You haven't selected any photos")
            return false;
        }
        for (var i = 0; i != files.length; i++) {
            formData.append("photos", files[i]);
        }
        formData.append("AntiqueId", AntiqueId);
        $.ajax({
            url: '/api/Photo/',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {

                $(".gallery").remove();
                if (getPhotosCheck != null) {
                    $("#file").val("");
                    toastr.success(data)
                    getPhotos(AntiqueId);
                    table.ajax.reload();
                }
            }
        });
    }

    //upload photos
    $(".imageUploadBtn").click(function () {
        var input = $("#file")[0];
        var antiqueId = $(this).data('antiqueid');
        uploadPhotos(input, antiqueId, true);

    });

    //my function for photos
    $(document).on('click', '#photoBtn', function (e) {
        e.preventDefault();
        var antiqueid = $(this).data('antiqueid');
        //adding antique id to the upload button
        $("#imageUploadBtn").data("antiqueid", antiqueid);
        $(".gallery").remove();
        getPhotos(antiqueid);
    });

    $(document).on('click', '.deleteImage', function (e) {
        e.preventDefault();
        var photoId = $(this).data('id');
        var antiqueId = $(this).data('antiqueid');
        $.ajax({
            type: 'DELETE',
            url: '/api/Photo/' + photoId,
            contentType: "application/json;charset=utf-8",
            success: function (response) {
                toastr.success(response)
                $(".gallery").remove();
                getPhotos(antiqueId);
                table.ajax.reload();
            }
        });
    });

    function getPhotos(antiqueId) {
        $.ajax({
            type: "GET",
            url: '/api/Photo/' + antiqueId,
            contentType: "application/json;charset=utf-8",
            success: function (photos) {
                if (photos.length > 0) {
                    $('#imageModal').prepend('<table>');
                    $('#imageModal').prepend('<tr>');
                    for (let i = 0; i < photos.length; i++) {

                        $('#imageModal').prepend('<td>');
                        $('#imageModal').prepend('<div class="gallery">\n' +
                            '                    <i class="fa fa-minus-circle minus deleteImage" style="cursor: pointer;" aria-hidden="true" data-id="' + photos[i].Id + '" data-antiqueid="' + photos[i].AntiqueId + '"></i>\n' +
                            '                   \n' +
                            '                        <img src="' + photos[i].Path + '" style="width:180px;height:110px;">\n' +
                            '                   \n' +
                            '                </div>\n');
                        $('#imageModal').prepend('<td>');
                        if (i == photos.length) {
                            $('#imageModal').prepend('</tr>');
                            break;
                        }
                        if (i != 0 && i % 3 == 0) {
                            $('#imageModal').prepend('</tr>');
                            if (i != photos.length)
                                $('#imageModal').prepend('<tr>');
                        }

                    }
                    $('#imageModal').prepend('</table><br>');
                }
            }
        });
    }

    //my function for photos End

    //Initialise Main Table
    var table = $("#antiqueTable").DataTable({
        pageLength: 25,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy' },
            { extend: 'csv' },
            { extend: 'excel', title: 'Antique list' },
            { extend: 'pdf', title: 'Antique list' },

            {
                extend: 'print',
                customize: function (win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ],
        ajax: {
            url: "/api/Antique/GetAllAntiques",
            dataSrc: ""
        },
        columns: [
            {
                data: "Id",
                render: function (data, type, antique) {
                    var imgSrc = antique.PhotoPath != null ? antique.PhotoPath : "/images/antiqueDefaultImage.jpg";
                    return "<img src='" + imgSrc + "' height='40px' width='40px' th:id=antiqueTableImg/><span class='pull-right'><a data-toggle='modal' data-antiqueid='" + data + "' href='#photo-form' id='photoBtn'><i class='fa fa-edit'></i></a></span>"
                }
            },
            {
                data: "Name"
            },
            {
                data: "Description"
            },
            {
                data: "BasePrice"
            },
            {
                data: "CurrentBid"
            },
            {
                data: "BidStartTime",
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
                data: "BidEndTime",
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
                "width": "23%",
                data: "defaultContent",
                render: function (data, type, antique) {
                    return "<button data-update_antique_id='" + antique.Id + "' class='btn btn-info btn-sm btn-flat updateBtn' data-toggle='modal' href='#updateAntique-form'><i class='fa fa-pencil' aria-hidden='true'></i>Update</button>"
                        + "&nbsp;<button data-delete_antique_id='" + antique.Id + "' class='btn btn-danger btn-sm btn-flat deleteBtn'><i class='fa fa-trash'></i>Delete</button>"
                        + "&nbsp;<button class='btn btn-primary btn-sm btn-flat historyBtn' data-antiqueid='" + antique.Id + "'><i class='fa fa-search' aria-hidden='true'></i>Bid History</button>";
                }
            }
        ]
    });

    //Initialise Main Table End


    //Show Bid History Modal
    $('#antiqueTable').on('click', '.historyBtn', function () {
        var antiqueId = $(this).data('antiqueid');
        $('#bidHistory-form').modal('toggle');
        initialiseBidHistoryTable(antiqueId);
    });
    //Show Bid History Modal End

    //Update Antique
    $("#updateAntiqueSubmit").click(function () {

        var antiqueId = $("#hdnAntiqueId").val();
        var date = new Date($("#updateBidStart").val());
        var BidStartTime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes());
        date = new Date($("#updateBidEnd").val());
        var BidEndTime = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes());
        var name = $("#updateName").val();
        var description = $("#updateDescription").val();
        var basePrice = $("#updateBasePrice").val();

        if (validateFields(name, description, basePrice, BidStartTime, BidEndTime)) {
            $('#updateAntique-form').modal('toggle');
            var updatedAntique = {
                Name: name,
                Description: description,
                BasePrice: basePrice,
                BidStartTime: BidStartTime,
                BidEndTime: BidEndTime
            };

            $.ajax({
                type: "PUT",
                url: '/api/Antique/' + antiqueId,
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(updatedAntique),
                success: function (response) {
                    toastr.success(response)
                    table.ajax.reload();
                },
                error: function () {
                    toastr.warning("There was an Error please try again")
                }
            });
        }
    });


    $('#antiqueTable').on('click', '.updateBtn', function () {
        var antiqueId = $(this).data("update_antique_id");
        $.ajax({
            type: "GET",
            url: '/api/Antique/' + antiqueId,
            contentType: "application/json;charset=utf-8",
            success: function (data) {
                $("#updateName").val(data.Name);
                $("#hdnAntiqueId").val(data.Id);
                $("#updateDescription").val(data.Description);
                $("#updateBasePrice").val(data.BasePrice);
                var date = new Date(data.BidStartTime);
                $("#updateBidStart").val(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes()));
                date = new Date(data.BidEndTime);
                $("#updateBidEnd").val(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + ((date.getMinutes() < 10 ? '0' : '') + date.getMinutes()));
            }
        });
    });

    //Update Antique End

    //Delete Antique

    $('#antiqueTable').on('click', '.deleteBtn', function () {

        var antiqueId = $(this).data("delete_antique_id");

        swal({
            title: "Are you sure that you want to delete this item?",
            text: "Once deleted, you will not be able to recover data associated with this item!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((createNew) => {
                if (createNew) {
                    $.ajax({
                        type: "DELETE",
                        url: '/api/Antique/' + antiqueId,
                        contentType: "application/json;charset=utf-8",
                        success: function (data) {
                            swal("Item successfully deleted ", {
                                icon: "success",
                            });
                            table.ajax.reload();
                        }
                    });
                }
            });
    });
    //Delete Antique End




    //Initialise Date Pickers
    var BidStart;
    var BidEnd;
    let myPickerStart = new SimplePicker(".datetimepickerStart", {
        zIndex: 10
    });
    let myPickerEnd = new SimplePicker(".datetimepickerEnd", {
        zIndex: 10
    });

    let UpdatePickerStart = new SimplePicker(".datetimepickerStartForUpdate", {
        zIndex: 10
    });
    let UpdatePickerEnd = new SimplePicker(".datetimepickerEndForUpdate", {
        zIndex: 10
    });

    $("#BidStartBtnForUpdate").click(function () {
        UpdatePickerStart.open()
        UpdatePickerStart.on('submit', function (date, readableDate) {
            BidStart = readableDate;
            $("#updateBidStart").val(readableDate);
        })
    });

    $("#BidEndBtnForUpdate").click(function () {
        UpdatePickerEnd.open()
        UpdatePickerEnd.on('submit', function (date, readableDate) {
            $("#updateBidEnd").val(readableDate);
        })
    });

    $("#BidStartBtn").click(function () {
        myPickerStart.open()
        myPickerStart.on('submit', function (date, readableDate) {
            BidStart = readableDate;
            $("#bidStart").val(readableDate);
        })
    });

    $("#BidEndBtn").click(function () {
        myPickerEnd.open()
        myPickerEnd.on('submit', function (date, readableDate) {
            BidEnd = readableDate;
            $("#bidEnd").val(readableDate);
        })
    });
    //Initialise Date Pickers End


    function resetFormFields() {
        $("#name").val("");
        $("#description").val("");
        $("#basePrice").val("");
        $("#bidStart").val("");
        $("#bidEnd").val("");
        $("#newAntiqueFile").val("");

    }


    function validateFields(name, description, basePrice, bidStart, bidEnd) {
        var startDate = new Date(BidStart);
        var endDate = new Date(BidEnd);
        if (startDate > endDate) {
            toastr.warning("Bid end date has to be after bid start date")
            return false;
        }
        if (!name || !description || !basePrice || !bidStart || !bidEnd) {
            toastr.warning("All input fields except photos are mandatory")
            return false;
        }
        if (isNaN(basePrice)) {
            toastr.warning("Base price field has to be a number")
            return false;
        }
        return true;
    }


    //New Antique
    $("#newAntiqueSubmit").click(function () {

        if (validateFields($("#name").val(), $("#description").val(), $("#basePrice").val(), BidStart, BidEnd)) {
            $('#newAntique-form').modal('toggle');
            //preparing data for photos
            var input = $("#newAntiqueFile")[0];
            //preparing data for photos-end

            var formData = {
                Name: $("#name").val(),
                Description: $("#description").val(),
                BasePrice: $("#basePrice").val(),
                BidStartTime: BidStart,
                BidEndTime: BidEnd
            };
            $.ajax({
                type: "POST",
                url: '/api/Antique/AddAntique',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(formData),
                success: function (result) {
                    uploadPhotos(input, result, null);
                    toastr.success("Antique successfully added")
                    BidStart = null;
                    BidEnd = null;
                    table.ajax.reload();
                    resetFormFields();
                },
                error: function () {
                    toastr.warning("There was an Error. Please login and try again.")
                }
            });
        }
    });
    //New Antique End
});
