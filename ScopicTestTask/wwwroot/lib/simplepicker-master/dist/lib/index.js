"use strict";
var dateUtil = require("./date-util");
var template_1 = require("./template");
var today = new Date();
var SimplePicker = /** @class */ (function () {
    function SimplePicker(arg1, arg2) {
        var el = undefined;
        var opts = arg2;
        if (typeof arg1 === 'string') {
            var element = document.querySelector(arg1);
            if (element !== null) {
                el = element;
            }
            else {
                throw new Error('Invalid selector passed to SimplePicker!');
            }
        }
        else if (arg1 instanceof HTMLElement) {
            el = arg1;
        }
        else if (typeof arg1 === 'object') {
            opts = arg1;
        }
        if (!el) {
            el = document.querySelector('body');
        }
        if (!opts) {
            opts = {};
        }
        this.selectedDate = new Date();
        this.injectTemplate(el);
        this.init(el, opts);
        this.initListeners();
        this._eventHandlers = {};
        this._validOnListeners = [
            'submit',
            'close',
        ];
    }
    // We use $, $$ as helper method to conviently select
    // element we need for simplepicker.
    // Also, Limit the query to the wrapper class to avoid
    // selecting elements on the other instance.
    SimplePicker.prototype.initElMethod = function (el) {
        this.$ = function (sel) { return el.querySelector(sel); };
        this.$$ = function (sel) { return el.querySelectorAll(sel); };
    };
    SimplePicker.prototype.init = function (el, opts) {
        this.$simplepickerWrapper = el.querySelector('.simplepicker-wrapper');
        this.initElMethod(this.$simplepickerWrapper);
        var _a = this, $ = _a.$, $$ = _a.$$;
        this.$simplepicker = $('.simpilepicker-date-picker');
        this.$trs = $$('.simplepicker-calender tbody tr');
        this.$tds = $$('.simplepicker-calender tbody td');
        this.$headerMonthAndYear = $('.simplepicker-month-and-year');
        this.$monthAndYear = $('.simplepicker-selected-date');
        this.$date = $('.simplepicker-date');
        this.$day = $('.simplepicker-day-header');
        this.$time = $('.simplepicker-time');
        this.$timeInput = $('.simplepicker-time-section input');
        this.$timeSectionIcon = $('.simplepicker-icon-time');
        this.$cancel = $('.simplepicker-cancel-btn');
        this.$ok = $('.simplepicker-ok-btn');
        this.$displayDateElements = [
            this.$day,
            this.$headerMonthAndYear,
            this.$date
        ];
        this.$time.classList.add('simplepicker-fade');
        this.render(dateUtil.scrapeMonth(today));
        opts = opts || {};
        this.opts = opts;
        this.reset(today);
        if (opts.zIndex !== undefined) {
            this.$simplepickerWrapper.style.zIndex = opts.zIndex.toString();
        }
        if (opts.disableTimeSection) {
            this.disableTimeSection();
        }
        if (opts.compactMode) {
            this.compactMode();
        }
    };
    // Reset by selecting current date.
    SimplePicker.prototype.reset = function (newDate) {
        var date = newDate || new Date();
        this.render(dateUtil.scrapeMonth(date));
        // The timeFull variable below will be formatted as HH:mm:ss.
        // Using regular experssion we remove the :ss parts.
        var timeFull = date.toTimeString().split(" ")[0];
        var time = timeFull.replace(/\:\d\d$/, "");
        this.$timeInput.value = time;
        this.$time.innerText = dateUtil.formatTimeFromInputElement(time);
        var dateString = date.getDate().toString();
        var $dateEl = this.findElementWithDate(dateString);
        if (!$dateEl.classList.contains('active')) {
            this.selectDateElement($dateEl);
            this.updateDateComponents(date);
        }
    };
    SimplePicker.prototype.compactMode = function () {
        var $date = this.$date;
        $date.style.display = 'none';
    };
    SimplePicker.prototype.disableTimeSection = function () {
        var $timeSectionIcon = this.$timeSectionIcon;
        $timeSectionIcon.style.visibility = 'hidden';
    };
    SimplePicker.prototype.enableTimeSection = function () {
        var $timeSectionIcon = this.$timeSectionIcon;
        $timeSectionIcon.style.visibility = 'visible';
    };
    SimplePicker.prototype.injectTemplate = function (el) {
        var $template = document.createElement('template');
        $template.innerHTML = template_1.htmlTemplate;
        el.appendChild($template.content.cloneNode(true));
    };
    SimplePicker.prototype.clearRows = function () {
        this.$tds.forEach(function (td) {
            td.innerHTML = '';
            td.classList.remove('active');
        });
    };
    SimplePicker.prototype.updateDateComponents = function (date) {
        var day = dateUtil.days[date.getDay()];
        var month = dateUtil.months[date.getMonth()];
        var year = date.getFullYear();
        var monthAndYear = month + ' ' + year;
        this.$headerMonthAndYear.innerHTML = monthAndYear;
        this.$monthAndYear.innerHTML = monthAndYear;
        this.$day.innerHTML = day;
        this.$date.innerHTML = dateUtil.getDisplayDate(date);
    };
    SimplePicker.prototype.render = function (data) {
        var _a = this, $$ = _a.$$, $trs = _a.$trs;
        var month = data.month, date = data.date;
        this.clearRows();
        month.forEach(function (week, index) {
            var $tds = $trs[index].children;
            week.forEach(function (day, index) {
                var td = $tds[index];
                if (!day) {
                    td.setAttribute('data-empty', '');
                    return;
                }
                td.removeAttribute('data-empty');
                td.innerHTML = day;
            });
        });
        var $lastRowDates = $$('table tbody tr:last-child td');
        var lasRowIsEmpty = true;
        $lastRowDates.forEach(function (date) {
            if (date.dataset.empty === undefined) {
                lasRowIsEmpty = false;
            }
        });
        // hide last row if it's empty to avoid
        // extra spacing due to last row
        var $lastRow = $lastRowDates[0].parentElement;
        if (lasRowIsEmpty && $lastRow) {
            $lastRow.style.display = 'none';
        }
        else {
            $lastRow.style.display = 'table-row';
        }
        this.updateDateComponents(date);
    };
    SimplePicker.prototype.updateSelectedDate = function (el) {
        var _a = this, $monthAndYear = _a.$monthAndYear, $time = _a.$time, $date = _a.$date;
        var day;
        if (el) {
            day = el.innerHTML.trim();
        }
        else {
            day = this.$date.innerHTML.replace(/[a-z]+/, '');
        }
        var _b = $monthAndYear.innerHTML.split(' '), monthName = _b[0], year = _b[1];
        var month = dateUtil.months.indexOf(monthName);
        var timeComponents = $time.innerHTML.split(':');
        var hours = +timeComponents[0];
        var _c = timeComponents[1].split(' '), minutes = _c[0], meridium = _c[1];
        if (meridium === 'AM' && hours == 12) {
            hours = 0;
        }
        if (meridium === 'PM' && hours < 12) {
            hours += 12;
        }
        var date = new Date(+year, +month, +day, +hours, +minutes);
        this.selectedDate = date;
        var _date = day + ' ';
        _date += $monthAndYear.innerHTML.trim() + ' ';
        _date += $time.innerHTML.trim();
        this.readableDate = _date.replace(/^\d+/, date.getDate().toString());
    };
    SimplePicker.prototype.selectDateElement = function (el) {
        var alreadyActive = this.$('.simplepicker-calender tbody .active');
        el.classList.add('active');
        if (alreadyActive) {
            alreadyActive.classList.remove('active');
        }
        this.updateSelectedDate(el);
        this.updateDateComponents(this.selectedDate);
    };
    SimplePicker.prototype.findElementWithDate = function (date, returnLastIfNotFound) {
        if (returnLastIfNotFound === void 0) { returnLastIfNotFound = false; }
        var $tds = this.$tds;
        var el, lastTd;
        $tds.forEach(function (td) {
            var content = td.innerHTML.trim();
            if (content === date) {
                el = td;
            }
            if (content !== '') {
                lastTd = td;
            }
        });
        if (el === undefined && returnLastIfNotFound) {
            el = lastTd;
        }
        return el;
    };
    SimplePicker.prototype.handleIconButtonClick = function (el) {
        var $ = this.$;
        var baseClass = 'simplepicker-icon-';
        var nextIcon = baseClass + 'next';
        var previousIcon = baseClass + 'previous';
        var calenderIcon = baseClass + 'calender';
        var timeIcon = baseClass + 'time';
        if (el.classList.contains(calenderIcon)) {
            var $timeIcon = $('.' + timeIcon);
            var $timeSection = $('.simplepicker-time-section');
            var $calenderSection = $('.simplepicker-calender-section');
            $calenderSection.style.display = 'block';
            $timeSection.style.display = 'none';
            $timeIcon.classList.remove('active');
            el.classList.add('active');
            this.toogleDisplayFade();
            return;
        }
        if (el.classList.contains(timeIcon)) {
            var $calenderIcon = $('.' + calenderIcon);
            var $calenderSection = $('.simplepicker-calender-section');
            var $timeSection = $('.simplepicker-time-section');
            $timeSection.style.display = 'block';
            $calenderSection.style.display = 'none';
            $calenderIcon.classList.remove('active');
            el.classList.add('active');
            this.toogleDisplayFade();
            return;
        }
        var selectedDate;
        var $active = $('.simplepicker-calender td.active');
        if ($active) {
            selectedDate = $active.innerHTML.trim();
        }
        if (el.classList.contains(nextIcon)) {
            this.render(dateUtil.scrapeNextMonth());
        }
        if (el.classList.contains(previousIcon)) {
            this.render(dateUtil.scrapePreviousMonth());
        }
        if (selectedDate) {
            var $dateTd = this.findElementWithDate(selectedDate, true);
            this.selectDateElement($dateTd);
        }
    };
    SimplePicker.prototype.initListeners = function () {
        var _a = this, $simplepicker = _a.$simplepicker, $timeInput = _a.$timeInput, $ok = _a.$ok, $cancel = _a.$cancel, $simplepickerWrapper = _a.$simplepickerWrapper;
        var _this = this;
        $simplepicker.addEventListener('click', function (e) {
            var target = e.target;
            var tagName = target.tagName.toLowerCase();
            e.stopPropagation();
            if (tagName === 'td') {
                _this.selectDateElement(target);
                return;
            }
            if (tagName === 'button' &&
                target.classList.contains('simplepicker-icon')) {
                _this.handleIconButtonClick(target);
                return;
            }
        });
        $timeInput.addEventListener('input', function (e) {
            if (e.target.value === '') {
                return;
            }
            var formattedTime = dateUtil.formatTimeFromInputElement(e.target.value);
            _this.$time.innerHTML = formattedTime;
            _this.updateSelectedDate();
        });
        $ok.addEventListener('click', function () {
            _this.close();
            _this.callEvent('submit', function (func) {
                func(_this.selectedDate, _this.readableDate);
            });
        });
        function close() {
            _this.close();
            _this.callEvent('close', function (f) { f(); });
        }
        ;
        $cancel.addEventListener('click', close);
        $simplepickerWrapper.addEventListener('click', close);
    };
    SimplePicker.prototype.callEvent = function (event, dispatcher) {
        var listeners = this._eventHandlers[event] || [];
        listeners.forEach(function (func) {
            dispatcher(func);
        });
    };
    SimplePicker.prototype.open = function () {
        this.$simplepickerWrapper.classList.add('active');
    };
    // can be called by user or by click the cancel btn.
    SimplePicker.prototype.close = function () {
        this.$simplepickerWrapper.classList.remove('active');
    };
    SimplePicker.prototype.on = function (event, handler) {
        var _a = this, _validOnListeners = _a._validOnListeners, _eventHandlers = _a._eventHandlers;
        if (!_validOnListeners.includes(event)) {
            throw new Error('Not a valid event!');
        }
        _eventHandlers[event] = _eventHandlers[event] || [];
        _eventHandlers[event].push(handler);
    };
    SimplePicker.prototype.toogleDisplayFade = function () {
        this.$time.classList.toggle('simplepicker-fade');
        this.$displayDateElements.forEach(function ($el) {
            $el.classList.toggle('simplepicker-fade');
        });
    };
    return SimplePicker;
}());
module.exports = SimplePicker;
