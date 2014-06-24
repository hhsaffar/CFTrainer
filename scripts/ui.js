
function drawTable(data) {

    for (var i = 0; i < data.length; i++) {
        drawRow(data[i]);
    }
}

function drawRow(rowData) {
    var row = $("<tr />")
    $("#tblProblems").append(row); 
    row.append($("<td>" + "<a href='http://codeforces.com/problemset/problem/" + rowData.contestId + "/" + rowData.index + "'>" + rowData.contestId + rowData.index + "</a>" + "</td>"));
    row.append($("<td>" + "<a href='http://codeforces.com/problemset/problem/" + rowData.contestId + "/" + rowData.index + "'>" + rowData.name + "</a>" + "</td>"));
    row.append($("<td>" + "<a href='http://codeforces.com/problemset/status/" + rowData.contestId + "/problem/" + rowData.index + "'>" + rowData.solvedCount + "</a>" + "</td>"));
}


function btnFillTable_onclick() {
    var handle = $("#txtHandle").val();
    var solvedUpperBound = parseInt($("#txtSolved_By_LEq").val(), 10);

    //var problems = getLessSolvedProblemsForHandle(handle, solvedUpperBound);

    var context = {
        handle: handle,
        solvedUpperBound: solvedUpperBound
    };
    getLessSolvedProblemsForHandle(handle, solvedUpperBound);
}

$(window).load(function () {
    $(document).ready(function () {
        $("#btnFillTable").click(btnFillTable_onclick);
    });
});