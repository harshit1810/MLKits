var finalDataset = [];
Array.prototype.last = function () {
    return this[this.length - 1];
};
function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
    finalDataset.push([dropPosition, bounciness, size, bucketLabel]);
}
function runAnalysis() {
    var dataSets = splitDataset(finalDataset);
    var trainingData = dataSets[1];
    /** generate multiple k values */
    var KValues = function (numberOfKValues) {
        var arr = [];
        while (arr.length <= numberOfKValues) {
            var random = getRandomValueIncluseive(1, 15);
            if (arr.indexOf() === -1) {
                arr.push(random);
            }
        }
        return arr;
    }(5);


    /** calculate accuracy for different k values */
    KValues.forEach(function (_k) {
        var results = function (testData) {
            var _results = [];
            testData.forEach(function (td) {
                var _bucket = KNN(_k, trainingData, getFeatures(td));
                _results.push([_bucket, td.last()]);
            });
            return _results;
        }(dataSets[0]);
        console.log('K = ' + _k + ', accuracy = ' + getAccuracy(results));
    });
}
/**
 * predicts the bucket where the ball will fall for the provided predictionPoint
 * @param {number[]} trainingData the training data
 * @param {number[]} testFeatures the features in test data
 */
function KNN(K, trainingData, testFeatures) {
    const kData = trainingData
        .map(function (_d) {
            return [
                getDistance(getFeatures(_d), testFeatures),
                _d.last()
            ];
        })
        .sort(function (_d, _e) {
            if (_d[0] < _e[0]) {
                return -1;
            }
            if (_e[0] < _d[0]) {
                return 1;
            }
            return 0;
        })
        .slice(0, K);
    return function (arr) {
        const obj = {};
        arr.forEach(function (elem) {
            if (obj.hasOwnProperty(elem[1])) {
                obj[elem[1]] += 1;
            } else {
                obj[elem[1]] = 1
            }
        });
        var maxCountBucket = 0;
        for (const key in obj) {
            if (obj[key] > maxCountBucket) {
                maxCountBucket = key;
            }
        }
        return parseInt(maxCountBucket, 10);
    }(kData);
}
/**
 * calculates distance between all features 
 * @param {number[]} features 
 * @param {number[]} testFeatures
 * @return {number} distance
 */
function getDistance(features, testFeatures) {
    var sum = 0;
    features.forEach(function () {
        sum += Math.pow(arguments[0] - testFeatures[arguments[1]], 2);
    });
    return Math.sqrt(sum);
}
/**
 * 
 * @param {number[][]} data 
 */
function splitDataset(data) {
    if (data && data.length === 0) {
        return [[], []];
    }
    var newData = data.map(function (d) {
        return d.slice();
    });
    var min = 0;
    var limit = Math.round(newData.length * 0.8);
    var max = newData.length - 1;
    var testData = [];
    var trainingData = [];
    var randomValues = [];

    while (testData.length <= limit) {
        var random = getRandomValueIncluseive(min, max);
        if (randomValues.indexOf(random) === -1) {
            randomValues.push(random);
            testData.push(newData[random]);
        }
    }
    newData.forEach(function (data, idx) {
        if (randomValues.indexOf(idx) === -1) {
            trainingData.push(data);
        }
    });
    return [testData, trainingData];
}
function getAccuracy(results) {
    var exactMatch = 0;
    results.forEach(function (r) {
        exactMatch = r[0] == r[1] ? exactMatch + 1 : exactMatch;
    });
    return (exactMatch * 100) / results.length;
}
function getRandomValueIncluseive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * 
 * @param {number[]} dataset 
 * @return {number[]} a array of feature values
 */
function getFeatures(dataset) {
    if (!dataset) {
        return [];
    }
    return Array.prototype.slice.call(dataset, 0, dataset.length - 1);
}