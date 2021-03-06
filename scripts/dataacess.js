// JScript source code

function getAllProblems() {
    var deferred = $.Deferred();
    
    var problems = loadProblems();

    if (problems != null)
        deferred.resolve(problems);
    else {
        getProblemRawData().success(function (problemsRawData) {
            problems = processProblemsRawData(problemsRawData);
            saveProblems(problems);
            deferred.resolve(problems);
        });
    }

    return deferred;
}

function processProblemsRawData(data) {
    var result = [];
    var problems = data.result.problems;
    var stats = data.result.problemStatistics;

    problems.sort(function (obj1, obj2) {
        if (obj1.contestId == obj2.contestId) return (obj1.index).localeCompare(obj2.index);
        else return (obj1.contestId - obj2.contestId)
    });
    stats.sort(function (obj1, obj2) {
        if (obj1.contestId == obj2.contestId) return (obj1.index).localeCompare(obj2.index);
        else return (obj1.contestId - obj2.contestId)
    });



    for (var i = 0; i < problems.length; i++) {
        if (problems[i].contestId == stats[i].contestId && problems[i].index == stats[i].index) {
            result.push({
                contestId: problems[i].contestId,
                index: problems[i].index,
                name: problems[i].name,
                url: 'http://codeforces.com/problemset/problem/' + problems[i].contestId + '/' + problems[i].index,
                solvedCount: stats[i].solvedCount,
                tags:problems[i].tags
            });
        } else {
            throw "Not same problems at index " + i;
        }
    }

    return result;
}



function getUserSubmissionsData(handle) {
    //'http://codeforces.com/api/user.status?handle=' + handle + '&from=1

    var deferred = $.Deferred();

    myGetJSONData('http://codeforces.com/api/user.status?handle=' + handle + '&from=1').success(function (submissionsRawData) {
        submissionsData = submissionsRawData.result; 
        deferred.resolve(submissionsData);
    });

    return deferred;
}

function getProblemRawData() {
    return myGetJSONData('http://codeforces.com/api/problemset.problems');
}

function saveProblems(problems) {
    var dataToStore = JSON.stringify(problems);
    localStorage.setItem('problems', dataToStore);
}

function loadProblems() {
    return localData = JSON.parse(localStorage.getItem('problems'));
}

function myGetJSONData(myUrl) {
    return $.ajax({
        url: myUrl,
        type: "GET",
        dataType: "JSONP",
        jsonp: 'jsonp',
        jsonpCallback: 'doSomeThing'
    });
}