var uri = 'https://pedro-gil-niguevara.c9users.io/';
function fillTransactionsTable(res) {
    var totalPayment = 0,
     totalExpense = 0,
     totalServiceFee = 0;
    $("#cont-applicant-transactions").html(function() {
        var value = 
        "<table id=\"table-applicant-transactions\" class=\"table table-bordered table-hover table-striped\" cellspacing=\"0\" width=\"100%\">" +
                            "<thead>" +
                            "<tr>" +
                            "<th>Transaction</th>" +
                            "<th>Type</th>" +
                            "<th>Amount</th>" +
                            "<th>Created By</th>" +
                            "</tr>" +
                            "</thead>" +
                            "<tbody>";
        $.each(res.payments, function(d, result) {
            value = value + "<tr>" +
            "<td>Payment</td>" +
            "<td>" + result.type + "</td>" +
            "<td>" + result.amount + "</td>" +
            "<td>" + result.createdBy + "</td>" +
            "</tr>";
            totalPayment = totalPayment + result.amount;
        });
        $.each(res.expenses, function(d, result) {
            value = value + "<tr>" +
            "<td>Expense</td>" +
            "<td>" + result.type + "</td>" +
            "<td>" + result.amount + "</td>" +
            "<td>" + result.createdBy + "</td>" +
            "</tr>";
            totalExpense = totalExpense + result.amount;
        });
        $.each(res.servicefees, function(d, result) {
            value = value + "<tr>" +
            "<td>Service Fee</td>" +
            "<td>" + result.type + "</td>" +
            "<td>" + result.amount + "</td>" +
            "<td>" + result.createdBy + "</td>" +
            "</tr>";
            totalServiceFee = totalServiceFee + result.amount;
        });
        value = value + "</tbody>" +
                            "</table>";
        return value;
    })
    $("#applicant-transaction-summary p[name='total-payment']").text(totalPayment);
    $("#applicant-transaction-summary p[name='total-expense']").text(totalExpense);
    $("#applicant-transaction-summary p[name='total-servicefee']").text(totalServiceFee);
    $('#table-applicant-transactions').DataTable();
}
function loadApplicantData(arr) {
    waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    $.ajax({
        url: uri + "applicant/search?id=" + arr[1],
        type: "GET",
        success: function applicantSearched(res) {
            if (arr[0] === 'update') {
                if (res.error) { 
                    getInternalError('#applicant-update-message'); 
                    window.setTimeout(waitingDialog.hide(),2000);
                    return; 
                }
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
                if (res.error) { 
                    getInternalError('#applicant-view-message'); 
                    window.setTimeout(waitingDialog.hide(),2000);
                    return; 
                }
                /* FILL INDEX CARD VIEW */
                $("#applicant-indexCard p[name='referenceNo']").text(res.referenceNo);
                $("#applicant-indexCard p[name='firstName']").text(res.firstName);
                $("#applicant-indexCard p[name='lastName']").text(res.lastName);
                $("#applicant-indexCard p[name='dateOfBirth']").text(res.dateOfBirth);
                $("#applicant-indexCard p[name='passportNo']").text(res.passportNo);
                $("#applicant-indexCard p[name='oec']").text(res.oec);
                $("#applicant-indexCard-col2 p[name='cg']").text(res.cg);
                $("#applicant-indexCard-col2 p[name='pdos']").text(res.pdos);
                if (res.employer === "") {
                    $('#cont-employer').html(
                        "<label>Employer <i class=\"fa fa-check\"></i></label>" +
                            "<input name=\"employer\" class=\"form-control\" placeholder=\"Employer\">"
                        );
                } else {
                    //$("#applicant-indexCard-col2 p[name='principal']").text();
                    $('#cont-employer').html(
                        "<label>Employer <i class=\"fa fa-check\"></i></label>" +
                            "<p class=\"form-control-static\">" + res.employer + "</p>" +
                            "<input name=\"employer\" type=\"hidden\" value=\"" + res.employer + "\">"
                        );
                }
                $("#applicant-indexCard-col2 p[name='employer']").text(res.employer);
                $("#applicant-indexCard-col2 p[name='country']").text(res.country);
                $("#applicant-indexCard-col2 input[name='id']").val(res.id);
                $("#applicant-transaction-create input[name='owner']").val(res.id);
                if (res.dateDeployed === undefined) {
                    $("#cont-deployment").html("<label>Deployment Date <i class=\"fa fa-check\"></i></label><input name=\"dateDeployed\" class=\"form-control\" placeholder=\"Deployment Date\">");
                    $("#indexCard-btn-update").prop('disabled', false);
                }
                else {
                    $("#cont-deployment").html("<label>Deployment Date <i class=\"fa fa-check\"></i></label><p name=\"dateDeployed\" class=\"form-control-static\">" + res.dateDeployed + "</p>");
                    $("#indexCard-btn-update").prop('disabled', true);
                }
                if (res.principal !== "" | res.principal !== "N/A") {
                    $("#cont-principal").html(
                        "<label>Principal (Tie-Up) <i class=\"fa fa-check\"></i></label>" +
                        "<p class=\"form-control-static\">" + res.principal + "</p>" +
                        "<input name=\"principal\" type=\"hidden\" value=\"" + res.principal + "\">"
                        );
                    $("#ddl-transaction").html(
                        "<option>(Select Transaction)</option>" +
                        "<option id=\"1\">Payment</option>" +
                        "<option id=\"2\">Expense</option>" +
                        "<option id=\"3\">Service Fee</option>"
                        );
                } else {
                    $.ajax({
                        url: uri + "tieup/get",
                        type: "GET",
                        //data: data,
                        success: function (res) {
                            if (res.error) { alert (JSON.stringify(res)); }
                            var value = "<label>Principal (Tie-Up) <i class=\"fa fa-check\"></i></label>";
                            value = value + "<select name=\"principal\" class=\"form-control\">";
                            value = value + "<option id=\"\">(Select Principal)</option>";
                            value = value + "<option id=\"\">N/A</option>";
                            $.each(res, function(d, result) {
                                value = value + "<option id=\"" + result.id + "\">" + result.name + "</option>";
                            });
                            value = value + "</select>";
                            $("#cont-principal").html(value);
                            $("#ddl-transaction").html(
                            "<option>(Select Transaction)</option>" +
                            "<option id=\"1\">Payment</option>" +
                            "<option id=\"2\">Expense</option>"
                            );
                    }});
                }
                /* FILL INDEX CARD VIEW */
                /* FILL TRANSACTIONS TABLE */
                fillTransactionsTable(res);
                /* FILL TRANSACTIONS TABLE */
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        if (arr[0] === 'update') getInternalError('#applicant-update-message');
        else if (arr[0] === 'view') getInternalError('#applicant-view-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
}
$('#table-applicant-results a').on('click', function(event){
    event.preventDefault();
    var arr = null;
    arr = $(this).attr('name').split(":");
    $("#applicant-indexCard-message").html("");
    $("#applicant-transaction-message").html("");
    loadApplicantData(arr);
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
  if ($('#applicant-create-ddl-principal option:selected').val() === '(Select Principal)') {
        getValidationError('#applicant-create-message');
        return;
   }
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

$('#applicant-indexCard-col2').on("submit", function(event) {
  event.preventDefault();
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
   var data = $('#applicant-indexCard-col2').serialize();
   if ($("#applicant-indexCard-col2 input[name='employer']").val() === "" | 
   $("#applicant-indexCard-col2 input[name='dateDeployed']").val() === "" | 
   $("#applicant-indexCard-col2 select[name='principal']").val() === "(Select Principal)") {
       getValidationError('#applicant-indexCard-message');
       window.setTimeout(waitingDialog.hide(),2000);
    } else {
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
                    loadApplicantData(["view", $("#applicant-indexCard-col2 input[name='id']").val()]);
                }
            }
        }).done(function() {
            window.setTimeout(waitingDialog.hide(),2000);
        }).error(function(err){
            getInternalError('#applicant-indexCard-message');
            window.setTimeout(waitingDialog.hide(),2000);
        });;
        }
});

$('#ddl-transaction').change(function(event) {
  event.preventDefault();
  var module = $('#ddl-transaction option:selected').attr("id");
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    $.ajax({
        url: uri + "type/get?module=" + module,
        type: "GET",
        //data: type,
        success: function (res) {
            if (res.error)
            { 
                $('#applicant-transaction-message').html(function createPayment(){
                    var message = "";
                    message = "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    return message;
                });
                return;
            } else {
                //POPULATE TYPE AND ID
                $("#ddl-transaction-type").html("<option>(Select Type)</option>");
                $.each(res, function(d, result){
                    $("#ddl-transaction-type").append("<option id='" + result.module + "'>" + result.description + "</option>");
                });
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#applicant-payment-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});

$('#applicant-transaction-create').on("submit", function(event) {
  event.preventDefault();
  
  var command = ["payment/create", "expense/create", "servicefee/create"];
   var module = $('#ddl-transaction option:selected').attr("id");
   var data = $('#applicant-transaction-create').serialize();
   
   if ($('#ddl-transaction option:selected').val() === '(Select Transaction)' &
   $('#ddl-transaction-type option:selected').val() === '(Select Type)') {
        getValidationError('#applicant-transaction-message');
        return;
   }
   waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    $.ajax({
        url: uri + command[module - 1],//"payment/create",
        type: "POST",
        data : data,
        success: function (res) {
            if (res.error)
            { 
                getValidationError('#applicant-transaction-message');
                return;
            } else {
                $('#applicant-transaction-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">" + $('#ddl-transaction').val() + " Transaction created! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
                $('#applicant-transaction-btn-reset').click(function() {
                    $('#applicant-transaction-message').html('');
                });
                loadApplicantData(["view", $("#applicant-transaction-create input[name='owner']").val()]);
                $('#applicant-transaction-btn-reset').click();
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#applicant-payment-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
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
function getValidationError(object) {
    return $(object).html(function createMessage(){
        var message = "";
        message = "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
        return message;
    });
}
//INITIALIZE DATA TABLE MODULE
$('#table-applicant-results').DataTable();