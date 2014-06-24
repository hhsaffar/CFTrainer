
function getLessSolvedProblemsForHandle(handle, solvedUpperBound) {

    // if data is already in data storage read data from storage otherwise ajax

    var problems = loadProblems();

    getProblemData().success(function (problemsRawData) {
        var problems = getAllProblems(problemsRawData);
        //saveProblems(problems);
        problems = filterProblemsBySolvedUpperBound(problems, solvedUpperBound);
        getUserSubmissionsData(handle).success(function (submissionsRawData) {
            var finalProblems = filterProblemsBySubmissions(problems, submissionsRawData);
            drawTable(finalProblems);
        });
    });

}




function filterProblemsBySubmissions(problems, submissionsRawData) {

    problems.sort(function (obj1, obj2) {
        if (obj1.contestId == obj2.contestId) return (obj1.index).localeCompare(obj2.index);
        else return (obj2.solvedCount - obj1.solvedCount);
    });

    var solved = {};

    for (var i = 0; i < submissionsRawData.result.length; i++)
        if (submissionsRawData.result[i].verdict == 'OK')
            solved[submissionsRawData.result[i].problem.contestId + submissionsRawData.result[i].problem.index] = true;

    result = [];
    var k = 0;
    for (var i = 0; i < problems.length; i++) {
        if (solved[problems[i].contestId + problems[i].index] == null || solved[problems[i].contestId + problems[i].index] != true)
            result.push(problems[i]);
    }


    return result.sort(function (obj1, obj2) {
        if (obj1.contestId == obj2.contestId) return (obj1.index).localeCompare(obj2.index);
        else return (obj2.solvedCount - obj1.solvedCount);
    });

}


function filterProblemsBySolvedUpperBound(problems, solvedUpperBound) {

    var result = [];
    problems.sort(function (obj1, obj2) {
        return obj1.solvedCount - obj2.solvedCount;
    });

    for (var i = 0; i < problems.length; i++) {
        if (problems[i].solvedCount < solvedUpperBound) result.push(problems[i]);
    }
    return result;
}