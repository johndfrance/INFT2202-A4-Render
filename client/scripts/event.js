"use strict";
var core;
(function (core) {
    class Event {
        _title;
        _date;
        _location;
        _description;
        _imageUrl;
        constructor(title = "", date = "", location = "", description = "", imageUrl = "") {
            this._title = title;
            this._date = date;
            this._location = location;
            this._description = description;
            this._imageUrl = imageUrl;
        }
        get title() {
            return this._title;
        }
        set title(value) {
            this._title = value;
        }
        get date() {
            return this._date;
        }
        set date(value) {
            this._date = value;
        }
        get location() {
            return this._location;
        }
        set location(value) {
            this._location = value;
        }
        get description() {
            return this._description;
        }
        set description(value) {
            this._description = value;
        }
        get imageUrl() {
            return this._imageUrl;
        }
        set imageUrl(value) {
            this._imageUrl = value;
        }
        fromJSON(data) {
            this._title = data.title;
            this._date = data.date;
            this._location = data.location;
            this._description = data.description;
            this._imageUrl = data.imageUrl;
        }
    }
    core.Event = Event;
})(core || (core = {}));
//# sourceMappingURL=event.js.map