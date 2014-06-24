
function drawTable(data) {
    $('#tblProblems tbody').remove();
    //$('#tblProblems tbody').
    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}

function drawRow(rowData) {
    var row = null;
    if (rowData.isSolvedByUser)
        row = $("<tr class=\"solved\"/>");
    else
        row = $("<tr />");

    $("#tblProblems").append(row);
    row.append($("<td>" + "<a href='http://codeforces.com/problemset/problem/" + rowData.contestId + "/" + rowData.index + "'>" + rowData.contestId + rowData.index + "</a>" + "</td>"));
    row.append($("<td>" + "<a href='http://codeforces.com/problemset/problem/" + rowData.contestId + "/" + rowData.index + "'>" + rowData.name + "</a>" + "</td>"));
    row.append($("<td>" + "<a href='http://codeforces.com/problemset/status/" + rowData.contestId + "/problem/" + rowData.index + "'>" + rowData.solvedCount + "</a>" + "</td>"));
}


function btnFillTable_onclick() {
    var handle = $("#txtHandle").val();
    var solvedUpperBound = parseInt($("#txtSolved_By_LEq").val(), 10);

    getLessSolvedProblemsForHandleWithSolvedStatus(handle, solvedUpperBound).done(function (problems) {
        $('#numberOfSolvedProblemsInRange').text('Number of solved problems in range: '+countProblemsWithSolvedStatusThatAreSolved(problems));
        problems = filterProblemsWithSolvedStatus(problems, !$('#chkShowSolvedProblems').is(":checked"));
        drawTable(problems);

    });
}

function lnkReloadProblemSet_onclick() {

    var handle = $("#txtHandle").val();
    var solvedUpperBound = parseInt($("#txtSolved_By_LEq").val(), 10);

    saveProblems(null);
    getLessSolvedProblemsForHandleWithSolvedStatus(handle, solvedUpperBound).done(function (problems) {
        $('#numberOfSolvedProblemsInRange').text('Number of solved problems in range: ' + countProblemsWithSolvedStatusThatAreSolved(problems));
        problems = filterProblemsWithSolvedStatus(problems, !$('#chkShowSolvedProblems').is(":checked"));
        drawTable(problems);
    });
    return false;
}

$(window).load(function () {
    $(document).ready(function () {
        $("#btnFillTable").click(btnFillTable_onclick);
        $("#lnkReloadProblemSet").click(lnkReloadProblemSet_onclick);
    });
});