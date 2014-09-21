
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

    getLessSolvedProblemsForHandleWithSolvedStatus(handle, solvedUpperBound, $("#ddlTags").val()).done(function (problems) {
        $('#numberOfSolvedProblemsInRange').text('Number of solved problems in range: ' + countProblemsWithSolvedStatusThatAreSolved(problems) + " Average difficulty problems: " + calculateAverageDifficulty(problems).toFixed(2) +
            " Average difficulty of solved problems: " + calculateAverageDifficultyOfSolved(problems).toFixed(2));
        problems = filterProblemsWithSolvedStatus(problems, !$('#chkShowSolvedProblems').is(":checked"));
        drawTable(problems);

    });
}

function lnkReloadProblemSet_onclick() {

    var handle = $("#txtHandle").val();
    var solvedUpperBound = parseInt($("#txtSolved_By_LEq").val(), 10);

    saveProblems(null);

    getLessSolvedProblemsForHandleWithSolvedStatus(handle, solvedUpperBound, $("#ddlTags").val()).done(function (problems) {
        $('#numberOfSolvedProblemsInRange').text('Number of solved problems in range: ' + countProblemsWithSolvedStatusThatAreSolved(problems) + " Average difficulty problems: " + calculateAverageDifficulty(problems).toFixed(2) +
            " Average difficulty of solved problems: " + calculateAverageDifficultyOfSolved(problems).toFixed(2));
        problems = filterProblemsWithSolvedStatus(problems, !$('#chkShowSolvedProblems').is(":checked"));
        drawTable(problems);

    });
    return false;
}

$(window).load(function () {
    $(document).ready(function () {
        $("#btnFillTable").click(btnFillTable_onclick);
        $("#lnkReloadProblemSet").click(lnkReloadProblemSet_onclick);
        deferredCalculateTagsDifficulty().done(function (tagsDifficultyTable) {

            var tagDifficultyList = [];

            for (var tagName in tagsDifficultyTable) {
                if (tagsDifficultyTable.hasOwnProperty(tagName)) {
                    var temp = new Object();
                    temp.key = tagName;
                    temp.val = tagsDifficultyTable[tagName];
                    tagDifficultyList.push(temp);
                }
            }

            tagDifficultyList.sort(function (a, b) { return b.val - a.val; }); // Desc.

            
            var options = $("#ddlTags");
            $.each(tagDifficultyList, function () {
                options.append($("<option />").val(this.key).text(this.key + "/" + this.val.toFixed(2)));
            });

        });
    });
});