const _ = require('lodash');

module.exports.parseInput = function parseInput(data) {
    if (typeof data !== 'string') {
        return [];
    }

    const lines = data.split("\n");
    return lines.map((line) => {
        const parts = line.split(",").map(s => s.trim());
        if (parts.length < 3) {
            return null;
        }

        const type = parts[1];
        const time = _.toNumber(_.last(parts[0].split(':')));
        const data = parts.slice(2).map(_.toNumber);

        return {
            type, time, data
        }
    })
};

module.exports.processInput = function processInput(state = {}, data) {
    data.forEach(row => {
        if (row == null) {
            return;
        }
        
        if (state[row.type] == undefined) {
            state[row.type] = [];
        }

        state[row.type].push({time: row.time, value: row.data});
    });

    Object.keys(state).forEach(key => {
        state[key].sort(sortRowFn);
        state[key] = trimData(state[key]);
    });
    
    return state;
}

function sortRowFn(a, b) {
    if (a.time > b.time) {
        return 1;
    }
    if (a.time < b.time) {
        return -1;
    }
    return 0;
}

// Trim the dataset so only 100 elements remain.
function trimData(dataset) {
    if (dataset.length > 100) {
        return dataset.slice(dataset.length - 100);
    }
    return dataset;
}
