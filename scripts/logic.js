
function deferredCalculateTagsDifficulty() {

    var deferred = $.Deferred();

    getAllProblems().done(function (problems){
        var ans = calculateTagsDifficulty(problems);
        deferred.resolve(ans);

    });

    return deferred;
}


function calculateTagsDifficulty(problems) {

    tagCnt = {};
    tagDifficulty = {};

    for (var i = 0; i < problems.length; i++) {
        for (var j = 0; j < problems[i].tags.length; j++) {
            if (tagCnt.hasOwnProperty(problems[i].tags[j])) {
                tagCnt[problems[i].tags[j]]++;
                tagDifficulty[problems[i].tags[j]] += calculateDifficulty(problems[i].solvedCount);
            }
            else {
                tagCnt[problems[i].tags[j]] = 1;
                tagDifficulty[problems[i].tags[j]] = calculateDifficulty(problems[i].solvedCount);
            }
        }
    }

    ans = {};

    for (var tagName in tagCnt) {
        if (tagCnt.hasOwnProperty(tagName)) {
            if (tagCnt[tagName] >= 50)
                ans[tagName] = tagDifficulty[tagName] / tagCnt[tagName];
        }
    }

    return ans;
}

function calculateAverageDifficulty(problems) {

    var sum = 0;
    for (var i = 0; i < problems.length; i++) {
        sum += calculateDifficulty(problems[i].solvedCount);
    }
    return sum / problems.length;
}

function calculateAverageDifficultyOfSolved(problems) {

    var sum = 0;
    var cnt = 0;
    for (var i = 0; i < problems.length; i++) {
        if (problems[i].isSolvedByUser) {
            sum += calculateDifficulty(problems[i].solvedCount);
            cnt++;
        }
    }
    return sum / cnt;
}



function calculateDifficulty(solvedByCount) {
    return 10000 / (1 + solvedByCount);
}

function getLessSolvedProblemsForHandleWithSolvedStatus(handle, solvedUpperBound,tag) {

    var deferred = $.Deferred();

    getAllProblems().done(function (problems) {
        problems = filterProblemsBySolvedUpperBound(problems, solvedUpperBound);
        problems = filterProblemsByTag(problems, tag);
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


function filterProblemsByTag(problems, tag) {
    
    if (tag == null || tag == "")
        return problems;

    result = [];
    for (var i = 0; i < problems.length; i++) {
        for (var j = 0; j < problems[i].tags.length; j++) {
            if (problems[i].tags[j] == tag) {
                result.push(problems[i]);
                break;
            }
        }
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