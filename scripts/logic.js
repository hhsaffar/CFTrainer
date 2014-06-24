
function getLessSolvedProblemsForHandleWithSolvedStatus(handle, solvedUpperBound) {

    var deferred = $.Deferred();

    var problems = loadProblems();

    getAllProblems().done(function (problems) {
        problems = filterProblemsBySolvedUpperBound(problems, solvedUpperBound);
        getUserSubmissionsData(handle).done(function (submissionsData) {
            var finalProblems = updateProblemsSolvedStatus(problems, submissionsData);
            deferred.resolve(finalProblems);
        });
    });

    return deferred;
}


function countProblemsWithSolvedStatusThatAreSolved(problems) {
    var t = 0;
    for (var i = 0; i < problems.length; i++) {
        if (problems[i].isSolvedByUser)
            t++;
    }
    return t;
}


function filterProblemsWithSolvedStatus(problems,omitSolvedOnes) {
    result = [];
    for (var i = 0; i < problems.length; i++) {
        if (!(omitSolvedOnes && problems[i].isSolvedByUser == true))
            result.push(problems[i]);
    }
    return result;
}

function updateProblemsSolvedStatus(problems, submissionsData) {

    problems.sort(function (obj1, obj2) {
        if (obj1.contestId == obj2.contestId) return (obj1.index).localeCompare(obj2.index);
        else return (obj2.solvedCount - obj1.solvedCount);
    });

    var solved = {};

    for (var i = 0; i < submissionsData.length; i++)
        if (submissionsData[i].verdict == 'OK')
            solved[submissionsData[i].problem.contestId + submissionsData[i].problem.index] = true;

    //result = [];
    //var k = 0;
    for (var i = 0; i < problems.length; i++) {
        if (solved[problems[i].contestId + problems[i].index] == null || solved[problems[i].contestId + problems[i].index] != true) {
            problems[i].isSolvedByUser = false;
        }
        else {
            problems[i].isSolvedByUser = true;
        }

    }


    return problems.sort(function (obj1, obj2) {
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