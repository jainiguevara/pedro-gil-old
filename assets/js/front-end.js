var uri = 'https://pedro-gil-niguevara.c9users.io/';
$('#table-applicant-results a').on('click', function(event){
    event.preventDefault();
    waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    var arr = null;
    arr = $(this).attr('name').split(":");
    //var data = { id : arr[1] };
    $.ajax({
        url: uri + "applicant/search?id=" + arr[1],
        type: "GET",
        //data: data,pa
        success: function applicantSearched(res) {
            if (arr[0] === 'update') {
                if (res.error) getInternalError("'#applicant-update-message'");
                $("#applicant-update input[name='referenceNo']").val(res.referenceNo);
                $("#applicant-update input[name='firstName']").val(res.firstName);
                $("#applicant-update input[name='lastName']").val(res.lastName);
                $("#applicant-update input[name='dateOfBirth']").val(res.dateOfBirth);
                $("#applicant-update input[name='passportNo']").val(res.passportNo);
                $("#applicant-update input[name='oec']").val(res.oec);
                $("#applicant-update input[name='cg']").val(res.cg);
                $("#applicant-update input[name='pdos']").val(res.pdos);
                $("#applicant-update select[name='principal']").val(res.principal);
                $("#applicant-update input[name='employer']").val(res.employer);
                $("#applicant-update select[name='country']").val(res.country);
                $("#applicant-update input[name='id']").val(res.id);
            } else if (arr[0] === 'view') {
                if (res.error) getInternalError("'#applicant-view-message'");
                $("#applicant-indexCard p[name='referenceNo']").text(res.referenceNo);
                $("#applicant-indexCard p[name='firstName']").text(res.firstName);
                $("#applicant-indexCard p[name='lastName']").text(res.lastName);
                $("#applicant-indexCard p[name='dateOfBirth']").text(res.dateOfBirth);
                $("#applicant-indexCard p[name='passportNo']").text(res.passportNo);
                $("#applicant-indexCard p[name='oec']").text(res.oec);
                $("#applicant-indexCard p[name='cg']").text(res.cg);
                $("#applicant-indexCard p[name='pdos']").text(res.pdos);
                $("#applicant-indexCard p[name='principal']").text(res.principal);
                $("#applicant-indexCard p[name='employer']").text(res.employer);
                $("#applicant-indexCard p[name='country']").text(res.country);
                $("#applicant-indexCard input[name='id']").val(res.id);
            }
            //alert(JSON.stringify(res));
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        if (arr[0] === 'update') getInternalError('#applicant-update-message');
        else if (arr[0] === 'view') getInternalError('#applicant-view-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});

// $('#applicant-search').on("click", 'a', function(event) {
//   event.preventDefault();
//   $('#applicant-btn-search').submit();
// });
// $('#applicant-search').submit(function(event) {
//   event.preventDefault();
//   var data = $('#applicant-search').serialize();
//     $.ajax({
//         url: uri + "applicant/search",
//         // headers: {
//         //     "Authorization": id + ":" + key
//         // },
//         type: "GET",
//         data: data,
//         success: function applicantSearched(res) {
//             $('#table-applicant-results').DataTable();
//             var table = "";
//             $.each(res, function(d, result){
//                 table = table + "<tr>"
//                       + "<td>"
//                         + "<a href='#tab-applicant-update' role='tab' data-toggle='tab'><i class='fa fa-pencil-square-o'></i></a>&nbsp;&nbsp;|&nbsp;&nbsp;"
//                         + "<a href='#tab-applicant-indexCard' role='tab' data-toggle='tab'><i class='fa fa-folder-open'></i></i></a>"
//                       +  "</td>"
//                       + "<td>" + result.referenceNo + "</td>"
//                       + "<td>" + result.firstName + "</td>"
//                       + "<td>" + result.lastName + "</td>"
//                       + "<td>" + result.dateOfBirth + "</td>"
//                       + "<td>" + result.passportNo + "</td>"
//                     + "</tr>" 
//             });
//             $("#table-applicant-results tbody").html(table);
//         },
//         statusCode:  {
//             404: function (content) { alert(content.message.value); },
//             403: function (content) { alert(content.message.value); },
//             500: function (content) { alert(content.message.value); }
//         },
//         error: function (res) {
//             alert(JSON.stringify(res));
//         }
//     });
// });

$('#applicant-create').on("submit", function(event) {
  event.preventDefault();
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
   var data = $('#applicant-create').serialize();
    $.ajax({
        url: uri + "applicant/create",
        // headers: {
        //     "Authorization": id + ":" + key
        // },
        type: "POST",
        data: data,
        success: function (res) {
            if (res.error)
            {  
                $('#applicant-create-message').html(function createMessage(){
                    var message = "";
                    if (res.invalidAttributes.passportNo[0].rule === 'unique')
                        message = message + "<div class=\"alert alert-warning\"><big name=\"result\"><b>Warning!</b> "+ res.invalidAttributes.passportNo[0].message + " <i class=\"fa fa-hand-paper-o\"></i></big></div>";
                    else
                        message = message + "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    return message;
                });
                return;
            } else {
                $('#applicant-create-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Applicant created! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
                $('#applicant-create-btn-reset').click();
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#applicant-create-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});

$('#applicant-update').on("submit", function(event) {
  event.preventDefault();
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
   var data = $('#applicant-update').serialize();
   console.log(data);
    $.ajax({
        url: uri + "applicant/update",
        // headers: {
        //     "id": data.id
        // },
        type: "POST",
        data: data,
        success: function (res) {
            if (res.error)
            {  
                $('#applicant-update-message').html(function createMessage(){
                    var message = "";
                    if (res.invalidAttributes.passportNo[0].rule === 'unique')
                        message = message + "<div class=\"alert alert-warning\"><big name=\"result\"><b>Warning!</b> "+ res.invalidAttributes.passportNo[0].message + " <i class=\"fa fa-hand-paper-o\"></i></big></div>";
                    else
                        message = message + "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    return message;
                });
                return;
            } else {
                $('#applicant-update-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Applicant updated! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#applicant-update-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });;
});

$('#applicant-indexCard').on("submit", function(event) {
  event.preventDefault();
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
   var data = $('#applicant-indexCard').serialize();
   console.log(data);
    $.ajax({
        url: uri + "applicant/deploy",
        type: "POST",
        data: data,
        success: function (res) {
            if (res.error)
            {  
                $('#applicant-indexCard-message').html(function createMessage(){
                    var message = "";
                    if (res.invalidAttributes.passportNo[0].rule === 'unique')
                        message = message + "<div class=\"alert alert-warning\"><big name=\"result\"><b>Warning!</b> "+ res.invalidAttributes.passportNo[0].message + " <i class=\"fa fa-hand-paper-o\"></i></big></div>";
                    else
                        message = message + "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    return message;
                });
                return;
            } else {
                $('#applicant-indexCard-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Applicant updated! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#applicant-indexCard-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });;
});

function getInternalError(object) {
    return $(object).html(function createMessage(){
        var message = "";
                            message = message + "<div class=\"alert alert-danger\">" +
                                                "<big name=\"result\"><b>Oops!</b> Something went wrong. "+
                                                "You may contact your administrator and try again. Hang in there! "+
                                                "<i class=\"fa fa-thumbs-o-up\"></i></big></div>";
        return message;
    });
}

//INITIALIZE DATA TABLE MODULE
$('#table-applicant-results').DataTable();