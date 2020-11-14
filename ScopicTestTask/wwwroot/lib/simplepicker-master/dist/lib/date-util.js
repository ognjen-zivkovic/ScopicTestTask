"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTimeFromInputElement = exports.getDisplayDate = exports.scrapeNextMonth = exports.scrapePreviousMonth = exports.scrapeMonth = exports.days = exports.months = exports.monthTracker = void 0;
;
exports.monthTracker = {
    years: {}
};
exports.months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
exports.days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];
function fill(arr, upto) {
    var temp = [];
    arr = temp.concat(arr);
    for (var i = 0; i < upto; i++) {
        arr[i] = undefined;
    }
    return arr;
}
// builds the calender for one month given a date
// which is end, start or in middle of the month
function scrapeMonth(date) {
    var originalDate = new Date(date.getTime());
    var year = date.getFullYear();
    var month = date.getMonth();
    var data = {
        date: originalDate,
        month: undefined
    };
    exports.monthTracker.current = new Date(date.getTime());
    exports.monthTracker.current.setDate(1);
    exports.monthTracker.years[year] = exports.monthTracker.years[year] || {};
    if (exports.monthTracker.years[year][month] !== undefined) {
        data.month = exports.monthTracker.years[year][month];
        return data;
    }
    date = new Date(date.getTime());
    date.setDate(1);
    exports.monthTracker.years[year][month] = [];
    var tracker = exports.monthTracker.years[year][month];
    var rowTracker = 0;
    while (date.getMonth() === month) {
        var _date = date.getDate();
        var day = date.getDay();
        if (_date === 1) {
            tracker[rowTracker] = fill([], day);
        }
        tracker[rowTracker] = tracker[rowTracker] || [];
        tracker[rowTracker][day] = _date;
        if (day === 6) {
            rowTracker++;
        }
        date.setDate(date.getDate() + 1);
    }
    var lastRow = 5;
    if (tracker[5] === undefined) {
        lastRow = 4;
        tracker[5] = fill([], 7);
    }
    var lastRowLength = tracker[lastRow].length;
    if (lastRowLength < 7) {
        var filled = tracker[lastRow].concat(fill([], 7 - lastRowLength));
        tracker[lastRow] = filled;
    }
    data.month = tracker;
    return data;
}
exports.scrapeMonth = scrapeMonth;
function scrapePreviousMonth() {
    var date = exports.monthTracker.current;
    if (!date) {
        throw Error('scrapePrevoisMonth called without setting monthTracker.current!');
    }
    date.setMonth(date.getMonth() - 1);
    return scrapeMonth(date);
}
exports.scrapePreviousMonth = scrapePreviousMonth;
function scrapeNextMonth() {
    var date = exports.monthTracker.current;
    if (!date) {
        throw Error('scrapePrevoisMonth called without setting monthTracker.current!');
    }
    date.setMonth(date.getMonth() + 1);
    return scrapeMonth(date);
}
exports.scrapeNextMonth = scrapeNextMonth;
var dateEndings = {
    st: [1, 21, 31],
    nd: [2, 22],
    rd: [3, 23]
};
function getDisplayDate(_date) {
    var date = _date.getDate();
    if (dateEndings.st.indexOf(date) !== -1) {
        return date + 'st';
    }
    if (dateEndings.nd.indexOf(date) !== -1) {
        return date + 'nd';
    }
    if (dateEndings.rd.indexOf(date) !== -1) {
        return date + 'rd';
    }
    return date + 'th';
}
exports.getDisplayDate = getDisplayDate;
function formatTimeFromInputElement(input) {
    var timeString = '';
    var _a = input.split(':'), hour = _a[0], minute = _a[1];
    hour = +hour;
    var isPM = hour >= 12;
    if (isPM && hour > 12) {
        hour = hour - 12;
    }
    if (!isPM && hour === 0) {
        hour = 12;
    }
    timeString += hour < 10 ? '0' + hour : hour;
    timeString += ':' + minute + ' ';
    timeString += isPM ? 'PM' : 'AM';
    return timeString;
}
exports.formatTimeFromInputElement = formatTimeFromInputElement;
