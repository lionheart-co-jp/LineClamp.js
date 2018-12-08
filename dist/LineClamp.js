"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _this = this;
if (!Array.prototype.keys) {
    Array.prototype.keys = function () {
        'use strict';
        var len = _this.length >>> 0;
        var result = [];
        var i = -1;
        while (++i !== len) {
            result.push(i);
        }
        return result;
    };
}
(function (global) {
    "use strict";
    var LineClamp = /** @class */ (function () {
        function LineClamp(query, option) {
            var _this = this;
            this._defaultOption = {
                ellipses: '...',
                lines: 1,
                language: 'en'
            };
            this._currentOption = {
                ellipses: '...',
                lines: 1,
                language: 'en'
            };
            this._breakpoints = [];
            this.event = function () { };
            this.enableFlag = false;
            this.original = [];
            this.targets = document.querySelectorAll(query);
            if (option.hasOwnProperty('lines') && option.lines) {
                this.lines(option.lines);
            }
            if (option.hasOwnProperty('ellipses') && option.ellipses) {
                this.ellipses(option.ellipses);
            }
            if (option.hasOwnProperty('language') && option.language) {
                this.language(option.language);
            }
            if (option.hasOwnProperty('breakpoints') && option.breakpoints) {
                this.breakpoints(option.breakpoints);
            }
            // Finished clamping, when target element is not found
            if (!this.targets.length) {
                return;
            }
            // Save Original
            [].forEach.call(this.targets, function (item, index) {
                _this.original[index] = item.innerHTML;
            });
            this.enable();
        }
        /**
         * Set limit line
         *
         * @param lines
         */
        LineClamp.prototype.lines = function (lines) {
            // Assigned line number should be bigger than 1
            if (lines < 1) {
                lines = 1;
            }
            this._defaultOption.lines = lines - 0;
            return this;
        };
        /**
         * Set ellipses text
         *
         * @param ellipses
         */
        LineClamp.prototype.ellipses = function (ellipses) {
            this._defaultOption.ellipses = ellipses;
            return this;
        };
        /**
         * Set Language config
         *
         * @param language
         */
        LineClamp.prototype.language = function (language) {
            this._defaultOption.language = language;
            return this;
        };
        /**
         * Set Breakpoints Config
         * @param breakpoints
         */
        LineClamp.prototype.breakpoints = function (breakpoints) {
            this._breakpoints = breakpoints;
            return this;
        };
        /**
         * Set Enable flag
         */
        LineClamp.prototype.enable = function () {
            if (!this.enableFlag) {
                this.event = this.handler.bind(this);
                window.addEventListener('resize', this.event);
                this.enableFlag = true;
            }
            this.handler();
            return this;
        };
        /**
         * Set Disable Flag
         */
        LineClamp.prototype.disable = function () {
            if (this.enableFlag) {
                window.removeEventListener('resize', this.event);
                delete this.event;
                this.enableFlag = false;
            }
            return this;
        };
        /**
         * Clamp Handler
         */
        LineClamp.prototype.handler = function () {
            var _this = this;
            if (!this.enable) {
                return;
            }
            this.currentOption();
            Array.prototype.forEach
                .call(this.targets, function (item, index) {
                item.innerHTML = '';
                var original = _this.original[index];
                var line = 0;
                var prev = item.offsetHeight;
                var rows = original.split(/<br>|<br \/>|<br\/>/);
                var currentContent = [];
                var previousContent = '';
                for (var i = 0; i < rows.length; i += 1) {
                    var v = rows[i];
                    if (i > 0) {
                        currentContent.push('<br>');
                        item.innerHTML = _this.join(currentContent);
                        if (line + 1 > _this._currentOption.lines) {
                            item.innerHTML = previousContent;
                            break;
                        }
                    }
                    var splitted = _this.split(v);
                    for (var j = 0; j < splitted.length; j += 1) {
                        var z = splitted[j];
                        currentContent.push(z);
                        item.innerHTML = _this.join(currentContent);
                        if (item.offsetHeight > prev) {
                            line += 1;
                            prev = item.offsetHeight;
                        }
                        if (line > _this._currentOption.lines) {
                            _this.clamp(item, currentContent);
                            break;
                        }
                    }
                    previousContent = item.innerHTML;
                }
            });
        };
        LineClamp.prototype.currentOption = function () {
            var sizes = Object.keys(this._breakpoints).sort();
            this._currentOption = __assign({}, this._defaultOption);
            var width = window.innerWidth;
            for (var i = 0; i < sizes.length; i += 1) {
                var size = parseInt(sizes[i]);
                if (width <= size) {
                    this._currentOption =
                        Object.assign(this._currentOption, this._breakpoints[size]);
                    break;
                }
            }
        };
        /**
         * Split Text
         *
         * @param string
         */
        LineClamp.prototype.split = function (string) {
            var result;
            switch (this._currentOption.language) {
                case 'ja':
                    result = string.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || [];
                    break;
                default:
                    result = string.split(' ');
                    break;
            }
            // Remove Empty Items
            return result.filter(function (e) { return e !== ''; });
        };
        /**
         * Join Text
         *
         * @param characters
         * @param addition
         */
        LineClamp.prototype.join = function (characters, addition) {
            if (addition === void 0) { addition = null; }
            if (addition !== null) {
                characters.push(addition);
            }
            switch (this._currentOption.language) {
                case 'ja':
                    return characters.join('');
                default:
                    return characters.join(' ');
            }
        };
        /**
         * Clamp Text
         *
         * @param target
         * @param characters
         */
        LineClamp.prototype.clamp = function (target, characters) {
            var overHeight = target.offsetHeight;
            var maxCount = 10;
            var count = 0;
            while (overHeight === target.offsetHeight &&
                count < maxCount) {
                characters.splice(-1);
                target.innerHTML =
                    this.join(characters.slice(), this._currentOption.ellipses);
                count += 1;
            }
        };
        return LineClamp;
    }());
    global.LineClamp = LineClamp;
})((this || 0).self || (typeof self !== "undefined") ? self : global);
