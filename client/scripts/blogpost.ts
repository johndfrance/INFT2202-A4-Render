/*
This Class represents a single blog post
 */
namespace core{
    export class BlogPost {
        private _title:string;
        private _preview:string;
        private _imageUrl:string;

        constructor(title = "", preview = "", imageUrl = "") {
            this._title = title;
            this._preview = preview;
            this._imageUrl = imageUrl
        }

        get title() {
            return this._title;
        }

        set title(value) {
            this._title = value;
        }

        get preview() {
            return this._preview;
        }

        set preview(value) {
            this._preview = value;
        }
        get imageUrl() {
            return this._imageUrl;
        }

        set imageUrl(value) {
            this._imageUrl = value;
        }

        fromJSON(data:BlogPost) {
            this._title = data.title;
            this._preview = data.preview;
            this._imageUrl = data.imageUrl
        }
    }
}