var uri = 'https://pedro-gil-niguevara.c9users.io/';
function fillTransactionsTable(res, role) {
    var totalPayment = 0,
     totalExpense = 0,
     totalServiceFee = 0,
     totalDiff = 0;
    $("#cont-applicant-transactions").html(function() {
        var value = 
        "<table id=\"table-applicant-transactions\" class=\"table table-bordered table-hover table-striped\" cellspacing=\"0\" width=\"100%\">" +
                            "<thead>" +
                            "<tr>";
                            if (role == "su" | role == "admin") {
                                value = value + "<th>Edit</th>"; //Action
                            }
                            value = value + "<th>Transaction</th>" +
                            "<th>Type</th>" +
                            "<th>Transaction Date</th>" +
                            // "<th>Actual Cost</th>" +
                            "<th>Amount</th>" +
                            "<th>Created By</th>" +
                            "</tr>" +
                            "</thead>" +
                            "<tbody>";
        $.each(res.payments, function(d, result) {
            value = value + "<tr>";
            if (role == "su" | role == "admin") {
                value = value +
                "<td><a name='" + result.id + ":Payment:" + result.type + ":" + setToMMDDYYYY(result.transactionDate) + ":" + 
                result.amount + ":" + result.owner +
                "' href='#' data-toggle='modal' data-target='#transaction-update'><i class='fa fa-pencil-square-o'></i></a></td>";
            }
            value = value + "<td>Payment</td>";
            if (result.type !== 'Rebate')
                value = value + "<td>" + result.type + "</td>";
            else 
                value = value + "<td>" + result.type + " (" + result.center +  ")</td>";
            value = value + "<td>" + setToMMDDYYYY(result.transactionDate) + "</td>" +
            // "<td>N/A</td>" +
            "<td>" + addCommas(result.amount) + "</td>" +
            "<td>" + result.createdBy + "</td>" +
            "</tr>";
            totalPayment = totalPayment + result.amount;
        });
        $.each(res.expenses, function(d, result) {
            value = value + "<tr>";
            if (role == "su" | role == "admin") {
                value = value +
                "<td><a name='" + result.id + ":Expense:" + result.type + ":" + setToMMDDYYYY(result.transactionDate) + ":" + 
                result.amount + ":" + result.owner +
                "' href='#' data-toggle='modal' data-target='#transaction-update'><i class='fa fa-pencil-square-o'></i></a></td>";
            }
            value = value + "<td>Expense</td>" +
            "<td>" + result.type + "</td>" +
            "<td>" + setToMMDDYYYY(result.transactionDate) + "</td>" +
            //"<td>" + result.actualCost + "</td>" +
            "<td>" + addCommas(result.amount) + "</td>" +
            "<td>" + result.createdBy + "</td>" +
            "</tr>";
            totalExpense = totalExpense + result.amount;
        });
        // $.each(res.servicefees, function(d, result) {
        //     value = value + "<tr>";
        //     if (role == "su" | role == "admin") {
        //         value = value +
        //         "<td><a name='" + result.id + ":Service Fee:" + result.type + ":" + result.transactionDate + ":" + result.amount + ":" + result.owner +
        //         "' href='#' data-toggle='modal' data-target='#transaction-update'><i class='fa fa-pencil-square-o'></i></a></td>";
        //     }
        //     value = value + "<td>Service Fee</td>" +
        //     "<td>" + result.type + "</td>" +
        //     "<td>" + result.transactionDate + "</td>" +
        //     // "<td>N/A</td>" +
        //     "<td>" + result.amount + "</td>" +
        //     "<td>" + result.createdBy + "</td>" +
        //     "</tr>";
        //     totalServiceFee = totalServiceFee + result.amount;
        // });
        value = value + "</tbody>" +
                            "</table>";
        return value;
    })
    $("#applicant-transaction-summary p[name='total-payment']").text(addCommas(totalPayment));
    $("#applicant-transaction-summary p[name='total-expense']").text(addCommas(totalExpense));
    $("#applicant-transaction-summary p[name='total-difference']").text(addCommas(totalPayment - totalExpense));
    //$("#applicant-transaction-summary p[name='total-servicefee']").text(totalServiceFee);
    //IMPLEMENTED INSIDE fillTransactionsTable SO THAT IT CAN BE CALLED
    $('#table-applicant-transactions a').click(function(event){
        event.preventDefault();
        waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
        var arr = null;
        arr = $(this).attr('name').split(":");
        $("#applicant-transaction-update-message").html("");
        loadApplicantTransaction(arr);
    });
    $('#table-applicant-transactions').DataTable();
}
function loadApplicantTransaction(arr) {
    var module = 0;
    if (arr[1] === 'Payment') module = 1;
    else if (arr[1] === 'Expense') module = 2;
    else if (arr[1] === 'Service Fee') module = 3;
    $.ajax({
        url: uri + "type/get?module=" + module,
        type: "GET",
        dataType: "jsonp",
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
                $("#applicant-transaction-update select[name='type']").html("<option>(Select Type)</option>");
                $.each(res, function(d, result){
                    $("#applicant-transaction-update select[name='type']").append("<option id='" + result.module + "'>" + result.description + "</option>");
                });
                $("#applicant-transaction-update input[name='id']").val(arr[0]);
                $("#applicant-transaction-update p[name='label-transaction']").text(arr[1]);
                $("#applicant-transaction-update select[name='type']").val(arr[2]);
                $("#applicant-transaction-update input[name='transactionDate']").val(arr[3]);
                $("#applicant-transaction-update input[name='amount']").val(arr[4]);
                // if (arr[1] === 'Expense')
                // {
                //     // $('#cont-transaction-update-actualCost').html(
                //     //     "<label>Actual Cost <i class='fa fa-check'></i></label>" +
                //     //         "<input name='actualCost' class='form-control' placeholder='Actual Cost'>"
                //     //     );
                //     //$("#applicant-transaction-update input[name='actualCost']").val(arr[5] === 'undefined' ? 0 : arr[4]); 
                //     $("#applicant-transaction-update input[name='owner']").val(arr[6]);
                // }   
                // else
                // {
                //     //$('#cont-transaction-update-actualCost').html('');
                    $("#applicant-transaction-update input[name='owner']").val(arr[5]);
                // }
                
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#applicant-payment-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
}

function loadApplicantData(arr) {
    try {
        waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
            $.ajax({
                url: uri + "applicant/search?id=" + arr[1],
                type: "GET",
                dataType: "jsonp",
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
                        $("#applicant-update input[name='dateOfBirth']").val(setToMMDDYYYY(res.dateOfBirth));
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
                        $('#tab-applicant-indexCard-txListing').html(
                            "<h2>Transaction Listing</h2><a href='report/ledger?id=" + res.id + "' target='_blank'>Detailed View</a><br/><br/>");
                        $("#applicant-indexCard p[name='referenceNo']").text(res.referenceNo);
                        $("#applicant-indexCard p[name='firstName']").text(res.firstName);
                        $("#applicant-indexCard p[name='lastName']").text(res.lastName);
                        $("#applicant-indexCard p[name='dateOfBirth']").text(setToMMDDYYYY(res.dateOfBirth));
                        $("#applicant-indexCard p[name='passportNo']").text(res.passportNo);
                        //OEC
                        if (res.oec === ""  & $("#applicant-indexCard-col2 input[name='role']").val() !== "viewer") {
                            $('#cont-oec').html(
                                "<label>OEC <i class=\"fa fa-check\"></i></label>" +
                                    "<input name=\"oec\" class=\"form-control\" placeholder=\"OEC\">"
                                );
                        } else {
                            $('#cont-oec').html(
                                "<label>OEC <i class=\"fa fa-check\"></i></label>" +
                                    "<p class=\"form-control-static\">" + res.oec + "</p>" +
                                    "<input name=\"oec\" type=\"hidden\" value=\"" + res.oec + "\">"
                                );
                        }
                        //CG
                        if (res.cg === ""  & $("#applicant-indexCard-col2 input[name='role']").val() !== "viewer") {
                            $('#cont-cg').html(
                                "<label>CG <i class=\"fa fa-check\"></i></label>" +
                                    "<input name=\"cg\" class=\"form-control\" placeholder=\"CG\">"
                                );
                        } else {
                            $('#cont-cg').html(
                                "<label>CG <i class=\"fa fa-check\"></i></label>" +
                                    "<p class=\"form-control-static\">" + res.cg + "</p>" +
                                    "<input name=\"cg\" type=\"hidden\" value=\"" + res.cg + "\">"
                                );
                        }
                        //PDOS
                        if (res.pdos === ""  & $("#applicant-indexCard-col2 input[name='role']").val() !== "viewer") {
                            $('#cont-pdos').html(
                                "<label>PDOS <i class=\"fa fa-check\"></i></label>" +
                                    "<input name=\"pdos\" class=\"form-control\" placeholder=\"PDOS\">"
                                );
                        } else {
                            $('#cont-pdos').html(
                                "<label>PDOS <i class=\"fa fa-check\"></i></label>" +
                                    "<p class=\"form-control-static\">" + res.pdos + "</p>" +
                                    "<input name=\"pdos\" type=\"hidden\" value=\"" + res.pdos + "\">"
                                );
                        }
                        //Eployer
                        if (res.employer === ""  & $("#applicant-indexCard-col2 input[name='role']").val() !== "viewer") {
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
                        $("#applicant-indexCard-col2 p[name='country']").text(res.country);
                        $("#applicant-indexCard-col2 input[name='id']").val(res.id);
                        $("#applicant-transaction-create input[name='owner']").val(res.id);
                        if (res.dateDeployed === undefined & $("#applicant-indexCard-col2 input[name='role']").val() !== "viewer") {
                            $("#cont-deployment").html(
                                "<label>Deployment Date <i class=\"fa fa-check\"></i></label>" + 
                                "<div class='input-group date' id='deploymentDate-applicant-view'>" +
                                "<input name='dateDeployed' type='text' class='form-control' placeholder='Deployment Date' />" +
                                "<span class='input-group-addon'>" +
                                    "<span class='glyphicon glyphicon-calendar'>" +
                                    "</span>" +
                                "</span>" +
                                "</div>"
                                );
                            $("#indexCard-btn-update").prop('disabled', false);
                            $('#deploymentDate-applicant-view').datetimepicker({
                                viewMode: 'months',
                                format: 'MM/DD/YYYY'
                            });
                        }
                        else {
                            $("#cont-deployment").html("<label>Deployment Date <i class=\"fa fa-check\"></i></label><p name=\"dateDeployed\" class=\"form-control-static\">" + setToMMDDYYYY(res.dateDeployed) + "</p>");
                            $("#indexCard-btn-update").prop('disabled', true);
                        }
                        if (res.principal !== "" & res.principal !== "N/A" & res.principal !== "(Select Principal)") {
                            $("#cont-principal").html(
                                "<label>Principal (Tie-Up) <i class=\"fa fa-check\"></i></label>" +
                                "<p class=\"form-control-static\">" + res.principal + "</p>" +
                                "<input name=\"principal\" type=\"hidden\" value=\"" + res.principal + "\">"
                                );
                            $("#ddl-transaction").html(
                                "<option>(Select Transaction)</option>" +
                                "<option id=\"1\">Payment</option>" +
                                "<option id=\"2\">Expense</option>"
                                );
                        } else {
                            if ($("#applicant-indexCard-col2 input[name='role']").val() !== "viewer") {
                            $.ajax({
                                url: uri + "tieup/get",
                                type: "GET",
                                dataType: "jsonp",
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
                            } else {
                                $("#cont-principal").html(
                                "<label>Principal (Tie-Up) <i class=\"fa fa-check\"></i></label>" +
                                "<p class=\"form-control-static\">" + res.principal + "</p>" +
                                "<input name=\"principal\" type=\"hidden\" value=\"" + res.principal + "\">"
                                );
                            }
                        }
                        /* FILL INDEX CARD VIEW */
                        /* FILL TRANSACTIONS TABLE */
                        fillTransactionsTable(res,arr[2]);
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
    } catch (e) { alert(e); window.setTimeout(waitingDialog.hide(),2000); }
    
}


$('#table-applicant-results a').on('click', function(event){
    event.preventDefault();
    var arr = null;
    arr = $(this).attr('name').split(":");
    $("#applicant-indexCard-message").html("");
    $("#applicant-transaction-message").html("");
    loadApplicantData(arr);
});

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
   $("#applicant-indexCard-col2 input[name='oec']").val() === "" |
   $("#applicant-indexCard-col2 input[name='pdos']").val() === "" |
   $("#applicant-indexCard-col2 input[name='cg']").val() === "" |
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
                    loadApplicantData(["view", $("#applicant-indexCard-col2 input[name='id']").val(), $("#applicant-indexCard-col2 input[name='role']").val()]);
                }
            }
        }).done(function() {
            window.setTimeout(waitingDialog.hide(),2000);
        }).error(function(err){
            getInternalError('#applicant-indexCard-message');
            window.setTimeout(waitingDialog.hide(),2000);
        });
        }
});


$('#ddl-transaction').change(function(event) {
  event.preventDefault();
  var module = $('#ddl-transaction option:selected').attr("id");
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    $.ajax({
        url: uri + "type/get?module=" + module,
        type: "GET",
        dataType: "jsonp",
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
                // if (module === "2") {
                //     $('#cont-transaction-actualCost').html("<label>Actual Cost</label><input name='actualCost' class='form-control' placeholder='Actual Cost'>");   
                // } else {
                //     $('#cont-transaction-actualCost').html("");
                // }
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#applicant-payment-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});


$('#ddl-transaction-type').change(function(event) {
  event.preventDefault();
  var type = $('#ddl-transaction-type option:selected').val();
  
  //REBATE REFERENCE
  if (type === "Rebate")
  {
         waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
        $.ajax({
            url: uri + "center/get",
            type: "GET",
            dataType: "jsonp",
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
                    //POPULATE CENTER
                    $('#cont-transaction-center').html(
                      "<label>Medical/Training Center</i></label>" +
                                        "<select id='ddl-center' name='center' class='form-control'>" +
                                            "<option>(Select Center)</option>"
                    );
                    $.each(res, function(d, result){
                        $("#ddl-center").append("<option>" + result.name + "</option>");
                    });
                    $('#cont-transaction-center').append("</select>");
                }
            }
        }).done(function() {
            window.setTimeout(waitingDialog.hide(),2000);
        }).error(function(err){
            getInternalError('#applicant-payment-message');
            window.setTimeout(waitingDialog.hide(),2000);
        });
  } else {
      $('#cont-transaction-center').html('');
  }
  //
});

$('#applicant-transaction-create').on("submit", function(event) {
  event.preventDefault();
  
  var command = ["payment/create", "expense/create", "servicefee/create"];
   var module = $('#ddl-transaction option:selected').attr("id");
   var data = $('#applicant-transaction-create').serialize();
   
   if ($('#ddl-transaction option:selected').val() === '(Select Transaction)' |
   $('#ddl-transaction-type option:selected').val() === '(Select Type)') {
        getValidationError('#applicant-transaction-message');
        return;
   }
   waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    $.ajax({
        url: uri + command[module - 1],//"payment/create",
        type: "POST",
        data : data,
        success: function (res, error) {
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
                loadApplicantData(["view", $("#applicant-transaction-create input[name='owner']").val(), $("#applicant-transaction-create input[name='role']").val()]);
                $('#applicant-transaction-btn-reset').click();
            }
        },
        error: function getError(res) {
            getInternalError('#applicant-transaction-message');
            return;
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#applicant-payment-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});


$('#applicant-transaction-btn-reset').click(function() {
    $('#applicant-transaction-message').html('');
});


$('#applicant-transaction-update').on("submit", function(event) {
  event.preventDefault();
  var command = ["payment/update", "expense/update", "servicefee/update"];
  var module = 0;//$("#applicant-transaction-update p[name='label-transaction'] option:selected").attr("id");
  switch ($("#applicant-transaction-update p[name='label-transaction']").text()) {
      case "Payment": module = 1; break;
      case "Expense":  module = 2; break;
      case "ServiceFee":  module = 3; break;
  };
  if ($("#chkbx-void").is(":checked"))
        $("#applicant-transaction-update input[name='status']").val(0);
    else
        $("#applicant-transaction-update input[name='status']").val(1);
  var data = $('#applicant-transaction-update').serialize();
  if ($("#applicant-transaction-update select[name='type'] option:selected").val() === '(Select Type)' & 
  $("#applicant-transaction-update input[name='amount']").val() === '') {
        getValidationError('#applicant-transaction-update-message');
        return;
  }
//   if (module === "2") {
//       if ($("#applicant-transaction-update input[name='actualCost']").val() === '') {
//         getValidationError('#applicant-transaction-update-message');
//         return;
//       }
//   }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    $.ajax({
        url: uri + command[module - 1],
        type: "POST",
        data : data,
        success: function (res) {
            if (res.error)
            { 
                getValidationError('#applicant-transaction-update-message');
                return;
            } else {
                $('#applicant-transaction-update-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">" + $("#applicant-transaction-update p[name='label-transaction']").text() + " Transaction updated! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
                $("#applicant-transaction-update input[name='close']").click(function() {
                    $('#applicant-transaction-update-message').html('');
                });
                loadApplicantData(["view", $("#applicant-transaction-update input[name='owner']").val(), $("#applicant-transaction-update input[name='role']").val()]);
            }
        }
    }).done(function() {
        waitingDialog.hide();
    }).error(function(err){
        getInternalError('#applicant-transaction-update-message');
        waitingDialog.hide();
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

//ADMIN
//USER MAINTENANCE
function loadUserData(arr) {
    try {
        waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
            $.ajax({
                url: uri + "user/search?id=" + arr[1],
                type: "GET",
                dataType: "jsonp",
                success: function userSearched(res) {
                    if (arr[0] === 'update') {
                        if (res.error) { 
                            getInternalError('#user-update-message'); 
                            window.setTimeout(waitingDialog.hide(),2000);
                            return; 
                        }
                        $("#user-update p[name='username']").text(res.username);
                        $("#user-update input[name='firstName']").val(res.firstName);
                        $("#user-update input[name='lastName']").val(res.lastName);
                        $("#user-update input[name='dateOfBirth']").val(setToMMDDYYYY(res.dateOfBirth));
                        $("#user-update p[name='email']").text(res.email);
                        $("#user-update select[name='role']").val(res.role);
                        $("#user-update input[name='id']").val(res.id);
                        $("#user-update input[name='status']").val(res.status);
                        $("#user-reset input[name='id']").val(res.id);
                        $("#user-reset input[name='status']").val(res.status);
                        if (res.status === 0)
                         $("#chkbx-status").prop('checked', true); 
                    } else if (arr[0] === 'view') {
                        if (res.error) { 
                            getInternalError('#user-view-message'); 
                            window.setTimeout(waitingDialog.hide(),2000);
                            return; 
                        }
                        /* FILL INDEX CARD VIEW */
                        $("#user-view p[name='username']").text(res.username);
                        $("#user-view p[name='firstName']").text(res.firstName);
                        $("#user-view p[name='lastName']").text(res.lastName);
                        $("#user-view p[name='dateOfBirth']").text(setToMMDDYYYY(res.dateOfBirth));
                        $("#user-view p[name='email']").text(res.email);
                        $("#user-view p[name='role']").val(res.role);
                        $("#user-view-col2 input[name='id']").val(res.id);
                        $("#user-transaction-create input[name='owner']").val(res.id);
                        
                        /* FILL INDEX CARD VIEW */
                        /* FILL TRANSACTIONS TABLE */
                        // fillTransactionsTable(res);
                        /* FILL TRANSACTIONS TABLE */
                    }
                }
            }).done(function() {
                window.setTimeout(waitingDialog.hide(),2000);
            }).error(function(err){
                if (arr[0] === 'update') getInternalError('#user-update-message');
                else if (arr[0] === 'view') getInternalError('#user-view-message');
                window.setTimeout(waitingDialog.hide(),2000);
            });
    } catch (e) { alert(e); window.setTimeout(waitingDialog.hide(),2000); }
    
}

$('#table-user-results a').on('click', function(event){
    event.preventDefault();
    var arr = null;
    arr = $(this).attr('name').split(":");
    $("#user-view-message").html("");
    loadUserData(arr);
});

$('#user-create').on("submit", function(event) {
  event.preventDefault();
  if ($("#user-create select[name='role'] option:selected").val() === '(Select Role)') {
        getValidationError('#user-create-message');
        return;
   }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
  $("#user-create input[name='password']").val($("#user-create input[name='username']").val());
   var data = $('#user-create').serialize();
    $.ajax({
        url: uri + "user/create",
        type: "POST",
        data: data,
        success: function (res) {
            
            if (res.error)
            {  
                $('#user-create-message').html(function createMessage(){
                    var message = "";
                    if (res.error === "E_VALIDATION") 
                        message = message + "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    else {
                        if (res.invalidAttributes.username[0].rule === 'unique')
                            message = message + "<div class=\"alert alert-warning\"><big name=\"result\"><b>Warning!</b> "+ res.invalidAttributes.username[0].message + " <i class=\"fa fa-hand-paper-o\"></i></big></div>";
                        else if (res.invalidAttributes.email[0].rule === 'unique')
                         message = message + "<div class=\"alert alert-warning\"><big name=\"result\"><b>Warning!</b> "+ res.invalidAttributes.email[0].message + " <i class=\"fa fa-hand-paper-o\"></i></big></div>";
                    }
                    return message;
                });
                return;
            } else {
                $('#user-create-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">User created! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
                $('#user-create-btn-reset').click();
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#user-create-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});

$('#user-update').on("submit", function(event) {
  event.preventDefault();
  if ($("#user-update input[name='role'] option:selected").val() === '(Select Role)') {
        getValidationError('#user-update-message');
        return;
   }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    if ($("#chkbx-status").is(":checked"))
        $("#user-update input[name='status']").val(0);
    else
        $("#user-update input[name='status']").val(1);
    var data = $('#user-update').serialize();
    $.ajax({
        url: uri + "user/update",
        type: "POST",
        data: data,
        success: function (res) {
            if (res.error)
            {  
                $('#user-update-message').html(function createMessage(){
                    var message = "";
                    message = "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    return message;
                });
                return;
            } else {
                $('#user-update-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">User updated! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#user-update-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });;
});

$('#user-reset').on("submit", function(event) {
  event.preventDefault();
  if ($("#user-reset input[name='password']").val() === "" | $("#user-reset input[name='password2']").val() === "") {
        $('#user-reset-message').html(function createMessage(){
            var message = "";
            message = "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> You need to input a new and confirm password.</big></div>";
            return message;
        });
        window.setTimeout(waitingDialog.hide(),2000);
        return;
  }
  if ($("#user-reset input[name='password']").val() !== $("#user-reset input[name='password2']").val()) {
        $('#user-reset-message').html(function createMessage(){
            var message = "";
            message = "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> Password confirmation must match the new password.</i>.</big></div>";
            return message;
        });
        window.setTimeout(waitingDialog.hide(),2000);
        return;
  }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    var data = $('#user-reset').serialize();
    $.ajax({
        url: uri + "user/changePassword",
        type: "POST",
        data: data,
        success: function (res) {
            if (res.error)
            {  
                $('#user-reset-message').html(function createMessage(){
                    var message = "";
                    message = "<div class=\"alert alert-danger\"><big name=\"result\"><b>Oops!</b> You need to input a valid password. With 8 minimum characters.</big></div>";
                    return message;
                });
                return;
            } else {
                $('#user-reset-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">User password updated! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#user-reset-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });;
});
//USER MAINTENANCE

//CENTER MAINTENANCE
function loadCenterData(arr) {
    try {
        waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
            $.ajax({
                url: uri + "center/search?id=" + arr[1],
                type: "GET",
                dataType: "jsonp",
                success: function centerSearched(res) {
                    if (arr[0] === 'update') {
                        if (res.error) { 
                            getInternalError('#center-update-message'); 
                            window.setTimeout(waitingDialog.hide(),2000);
                            return; 
                        }
                        $("#center-update input[name='name']").val(res.name);
                        $("#center-update input[name='id']").val(res.id);
                        if (res.status === 0)
                         $("#chkbx-center-status").prop('checked', true); 
                    } 
                }
            }).done(function() {
                window.setTimeout(waitingDialog.hide(),2000);
            }).error(function(err){
                if (arr[0] === 'update') getInternalError('#center-update-message');
                window.setTimeout(waitingDialog.hide(),2000);
            });
    } catch (e) { alert(e); window.setTimeout(waitingDialog.hide(),2000); }
    
}

$('#table-center-results a').on('click', function(event){
    event.preventDefault();
    var arr = null;
    arr = $(this).attr('name').split(":");
    $("#center-view-message").html("");
    loadCenterData(arr);
});

$('#center-create').on("submit", function(event) {
  event.preventDefault();
  if ($("#center-create input[name='name']").val() === '') {
        getValidationError('#center-create-message');
        return;
  }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
   var data = $('#center-create').serialize();
    $.ajax({
        url: uri + "center/create",
        type: "POST",
        data: data,
        success: function (res) {
            
            if (res.error)
            {  
                $('#center-create-message').html(function createMessage(){
                    var message = "";
                    if (res.error === "E_VALIDATION") 
                        message = message + "<div class=\"alert alert-danger\"><big name=\"result\">" + 
                        "<b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    else {
                        if (res.invalidAttributes.name[0].rule === 'unique')
                            message = message + "<div class=\"alert alert-warning\"><big name=\"result\"><b>Warning!</b> "+ 
                            res.invalidAttributes.username[0].message + " <i class=\"fa fa-hand-paper-o\"></i></big></div>";
                    }
                    return message;
                });
                return;
            } else {
                $('#center-create-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Center created! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
                $('#center-create-btn-reset').click();
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#center-create-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});

$('#center-update').on("submit", function(event) {
  event.preventDefault();
  if ($("#center-update input[name='name']").val() === '') {
    getValidationError('#center-create-message');
    return;
  }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    if ($("#chkbx-center-status").is(":checked"))
        $("#center-update input[name='status']").val(0);
    else
        $("#center-update input[name='status']").val(1);
    var data = $('#center-update').serialize();
    $.ajax({
        url: uri + "center/update",
        type: "POST",
        data: data,
        success: function (res) {
            if (res.error)
            {  
                $('#center-update-message').html(function createMessage(){
                    var message = "";
                    message = "<div class=\"alert alert-danger\"><big name=\"result\">" + 
                    "<b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    return message;
                });
                return;
            } else {
                $('#center-update-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Center updated! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#center-update-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });;
});
//CENTER MAINTENANCE

//COUNTRY MAINTENANCE
function loadCountryData(arr) {
    try {
        waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
            $.ajax({
                url: uri + "country/search?id=" + arr[1],
                type: "GET",
                dataType: "jsonp",
                success: function countrySearched(res) {
                    if (arr[0] === 'update') {
                        if (res.error) { 
                            getInternalError('#country-update-message'); 
                            window.setTimeout(waitingDialog.hide(),2000);
                            return; 
                        }
                        $("#country-update input[name='name']").val(res.name);
                        $("#country-update input[name='id']").val(res.id);
                        if (res.status === 0)
                         $("#chkbx-country-status").prop('checked', true); 
                    } 
                }
            }).done(function() {
                window.setTimeout(waitingDialog.hide(),2000);
            }).error(function(err){
                if (arr[0] === 'update') getInternalError('#country-update-message');
                window.setTimeout(waitingDialog.hide(),2000);
            });
    } catch (e) { alert(e); window.setTimeout(waitingDialog.hide(),2000); }
    
}

$('#table-country-results a').on('click', function(event){
    event.preventDefault();
    var arr = null;
    arr = $(this).attr('name').split(":");
    $("#country-view-message").html("");
    loadCountryData(arr);
});

$('#country-create').on("submit", function(event) {
  event.preventDefault();
  if ($("#country-create input[name='name']").val() === '') {
        getValidationError('#country-create-message');
        return;
  }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
   var data = $('#country-create').serialize();
    $.ajax({
        url: uri + "country/create",
        type: "POST",
        data: data,
        success: function (res) {
            
            if (res.error)
            {  
                $('#country-create-message').html(function createMessage(){
                    var message = "";
                    console.log(res);
                    if (res.error === "E_VALIDATION") 
                        message = message + "<div class=\"alert alert-danger\"><big name=\"result\">" + 
                        "<b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    else {
                        if (res.invalidAttributes.name[0].rule === 'unique')
                            message = message + "<div class=\"alert alert-warning\"><big name=\"result\"><b>Warning!</b> "+ 
                            res.invalidAttributes.username[0].message + " <i class=\"fa fa-hand-paper-o\"></i></big></div>";
                    }
                    return message;
                });
                return;
            } else {
                $('#country-create-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Country created! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
                $('#country-create-btn-reset').click();
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#country-create-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});

$('#country-update').on("submit", function(event) {
  event.preventDefault();
  if ($("#country-update input[name='name']").val() === '') {
    getValidationError('#country-create-message');
    return;
  }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    if ($("#chkbx-country-status").is(":checked"))
        $("#country-update input[name='status']").val(0);
    else
        $("#country-update input[name='status']").val(1);
    var data = $('#country-update').serialize();
    $.ajax({
        url: uri + "country/update",
        type: "POST",
        data: data,
        success: function (res) {
            if (res.error)
            {  
                console.log('update error : ' + res)
                $('#country-update-message').html(function createMessage(){
                    var message = "";
                    message = "<div class=\"alert alert-danger\"><big name=\"result\">" + 
                    "<b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    return message;
                });
                return;
            } else {
                $('#country-update-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Country updated! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#country-update-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });;
});
//COUNTRY MAINTENANCE

//TIEUP MAINTENANCE
function loadTieupData(arr) {
    try {
        waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
            $.ajax({
                url: uri + "tieup/search?id=" + arr[1],
                type: "GET",
                dataType: "jsonp",
                success: function tieupSearched(res) {
                    if (arr[0] === 'update') {
                        if (res.error) { 
                            getInternalError('#tieup-update-message'); 
                            window.setTimeout(waitingDialog.hide(),2000);
                            return; 
                        }
                        $("#tieup-update input[name='name']").val(res.name);
                        $("#tieup-update input[name='id']").val(res.id);
                        if (res.status === 0)
                         $("#chkbx-tieup-status").prop('checked', true); 
                    } 
                }
            }).done(function() {
                window.setTimeout(waitingDialog.hide(),2000);
            }).error(function(err){
                if (arr[0] === 'update') getInternalError('#tieup-update-message');
                window.setTimeout(waitingDialog.hide(),2000);
            });
    } catch (e) { alert(e); window.setTimeout(waitingDialog.hide(),2000); }
}

$('#table-tieup-results a').on('click', function(event){
    event.preventDefault();
    var arr = null;
    arr = $(this).attr('name').split(":");
    $("#tieup-view-message").html("");
    loadTieupData(arr);
});

$('#tieup-create').on("submit", function(event) {
  event.preventDefault();
  if ($("#tieup-create input[name='name']").val() === '') {
        getValidationError('#tieup-create-message');
        return;
  }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
   var data = $('#tieup-create').serialize();
    $.ajax({
        url: uri + "tieup/create",
        type: "POST",
        data: data,
        success: function (res) {
            
            if (res.error)
            {  
                $('#tieup-create-message').html(function createMessage(){
                    var message = "";
                    console.log(res);
                    if (res.error === "E_VALIDATION") 
                        message = message + "<div class=\"alert alert-danger\"><big name=\"result\">" + 
                        "<b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    else {
                        if (res.invalidAttributes.name[0].rule === 'unique')
                            message = message + "<div class=\"alert alert-warning\"><big name=\"result\"><b>Warning!</b> "+ 
                            res.invalidAttributes.username[0].message + " <i class=\"fa fa-hand-paper-o\"></i></big></div>";
                    }
                    return message;
                });
                return;
            } else {
                $('#tieup-create-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Tieup created! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
                $('#tieup-create-btn-reset').click();
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#tieup-create-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});

$('#tieup-update').on("submit", function(event) {
  event.preventDefault();
  if ($("#tieup-update input[name='name']").val() === '') {
    getValidationError('#tieup-create-message');
    return;
  }
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    if ($("#chkbx-tieup-status").is(":checked"))
        $("#tieup-update input[name='status']").val(0);
    else
        $("#tieup-update input[name='status']").val(1);
    var data = $('#tieup-update').serialize();
    $.ajax({
        url: uri + "tieup/update",
        type: "POST",
        data: data,
        success: function (res) {
            if (res.error)
            {
                $('#tieup-update-message').html(function createMessage(){
                    var message = "";
                    message = "<div class=\"alert alert-danger\"><big name=\"result\">" + 
                    "<b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    return message;
                });
                return;
            } else {
                $('#tieup-update-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Tieup updated! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#tieup-update-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });;
});
//TIEUP MAINTENANCE

//TYPE MAINTENANCE
function loadTypeData(arr) {
    try {
        waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
            $.ajax({
                url: uri + "type/search?id=" + arr[1],
                type: "GET",
                dataType: "jsonp",
                success: function typeSearched(res) {
                    if (arr[0] === 'update') {
                        if (res.error) { 
                            getInternalError('#type-update-message'); 
                            window.setTimeout(waitingDialog.hide(),2000);
                            return; 
                        }
                        $("#type-update input[name='description']").val(res.description);
                        $("#type-update input[name='id']").val(res.id);
                        if (res.status === 0)
                         $("#chkbx-type-status").prop('checked', true);
                        $("#type-update input[name='module']").val(res.module);
                        if (res.module === 1)
                            $('#ddlModule-update').val('Payment');
                        else if (res.module === 2)
                            $('#ddlModule-update').val('Expense');
                    } 
                }
            }).done(function() {
                window.setTimeout(waitingDialog.hide(),2000);
            }).error(function(err){
                if (arr[0] === 'update') getInternalError('#type-update-message');
                window.setTimeout(waitingDialog.hide(),2000);
            });
    } catch (e) { alert(e); window.setTimeout(waitingDialog.hide(),2000); }
}

$('#table-type-results a').on('click', function(event){
    event.preventDefault();
    var arr = null;
    arr = $(this).attr('name').split(":");
    $("#type-view-message").html("");
    loadTypeData(arr);
});

$('#type-create').on("submit", function(event) {
  event.preventDefault();
  if ($("#type-create input[name='name']").val() === '') {
        getValidationError('#type-create-message');
        return;
  }
  if ($('#ddlModule-create option:selected').val() === '(Select Module)') {
        getValidationError('#applicant-create-message');
        return;
  }
  $("#type-create input[name='module']").val($('#ddlModule-create option:selected').attr("id"));
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
   var data = $('#type-create').serialize();
    $.ajax({
        url: uri + "type/create",
        type: "POST",
        data: data,
        success: function (res) {
            
            if (res.error)
            {  
                $('#type-create-message').html(function createMessage(){
                    var message = "";
                    console.log(res);
                    if (res.error === "E_VALIDATION") 
                        message = message + "<div class=\"alert alert-danger\"><big name=\"result\">" + 
                        "<b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    else {
                        if (res.invalidAttributes.name[0].rule === 'unique')
                            message = message + "<div class=\"alert alert-warning\"><big name=\"result\"><b>Warning!</b> "+ 
                            res.invalidAttributes.username[0].message + " <i class=\"fa fa-hand-paper-o\"></i></big></div>";
                    }
                    return message;
                });
                return;
            } else {
                $('#type-create-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Type created! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
                $('#type-create-btn-reset').click();
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#type-create-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });
});

$('#type-update').on("submit", function(event) {
  event.preventDefault();
  if ($("#type-update input[name='description']").val() === '') {
    getValidationError('#type-message');
    return;
  }
  if ($('#ddlModule-update option:selected').val() === '(Select Module)') {
        getValidationError('#type-update-message');
        return;
  }
  $("#type-update input[name='module']").val($('#ddlModule-update option:selected').attr("id"));
  waitingDialog.show('Please wait...', { dialogSize: 'sm', progressType: 'success' });
    if ($("#chkbx-type-status").is(":checked"))
        $("#type-update input[name='status']").val(0);
    else
        $("#type-update input[name='status']").val(1);
    var data = $('#type-update').serialize();
    $.ajax({
        url: uri + "type/update",
        type: "POST",
        data: data,
        success: function (res) {
            if (res.error)
            {
                $('#type-update-message').html(function createMessage(){
                    var message = "";
                    message = "<div class=\"alert alert-danger\"><big name=\"result\">" + 
                    "<b>Oops!</b> You need to input valid data in the fields marked with <i class=\"fa fa-check\"></i>.</big></div>";
                    return message;
                });
                return;
            } else {
                $('#type-update-message').html(function createMessage(){
                var message = "<div class=\"alert alert-success\">" +
                    "<big name=\"result\">Type updated! <i class=\"fa fa-thumbs-o-up\"></i></big></div>";
                return message;
                });
            }
        }
    }).done(function() {
        window.setTimeout(waitingDialog.hide(),2000);
    }).error(function(err){
        getInternalError('#type-update-message');
        window.setTimeout(waitingDialog.hide(),2000);
    });;
});
//TYPE MAINTENANCE

function setToMMDDYYYY(date) 
{
    if (typeof date === 'undefined')
    return "";
    else {
        var date = new Date(date),
            yr = date.getFullYear(),
            month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1),
            day = date.getDate()  < 10 ? '0' + date.getDate()  : date.getDate();
        return month + '-' + day + '-' + yr;
    }
}

function addCommas(nStr)
{
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function setToHHMMSS(date) {
    var date = new Date(date),
        hh = date.getHours(),
        ss = date.getMinutes(),
        mm = date.getSeconds();
    return hh + ':' + mm + ':' + ss;
}

$('#dateOfBirth-user-create').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#dateOfBirth-applicant-create').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#dateOfBirth-applicant-update').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#transaction-date-create').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#transaction-date-update').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#report-expense-start').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#report-expense-end').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#report-collection-start').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#report-collection-end').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#report-deployment-start').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$('#report-deployment-end').datetimepicker({
    viewMode: 'months',
    format: 'MM/DD/YYYY'
});

$("#button-export-collection").click(function (e) {
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#export-report-collection').html()));
    e.preventDefault();
});

$("#button-export-payment").click(function (e) {
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#export-report-payment').html()));
    e.preventDefault();
});

$("#button-export-deployment").click(function (e) {
    window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#export-report-deployment').html()));
    e.preventDefault();
});

//INITIALIZE DATA TABLE MODULE
$('#table-applicant-results').DataTable();
$('#table-user-results').DataTable();
$('#table-center-results').DataTable();
$('#table-country-results').DataTable();
$('#table-tieup-results').DataTable();
$('#table-type-results').DataTable();