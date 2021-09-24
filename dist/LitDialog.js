"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LitDialog = void 0;
var lit_1 = require("lit");
var class_map_1 = require("lit/directives/class-map");
/**
 * Dialog component using boostrap 3 markup/classes
 *
 * Extending classes should override renderContent() to render the content of dialog,
 * call open() to open it and wait for the returned promise to resolve.
 * Don't forget to register dialog as a webcomponent via customElements.define(...) as otherwise you'll get `Uncaught TypeError: Illegal constructor`
 *
 * See web-dialog for an alternative (https://github.com/andreasbm/web-dialog)
 */
var LitDialog = /** @class */ (function (_super) {
    __extends(LitDialog, _super);
    /**
     *
     * @param {'sm'|'lg'|null|undefined} size
     */
    function LitDialog(size) {
        var _this = _super.call(this) || this;
        /**
         * Dialog size, null for normal/default size
         *
         * @type {'sm'|'lg'|null|undefined}
         */
        _this.size = size; //'sm';
        return _this;
    }
    LitDialog.prototype.connectedCallback = function () {
        this.update();
    };
    LitDialog.prototype.disconnectedCallback = function () {
        var _this = this;
        this.dispatchEvent(new CustomEvent('disconnected'));
        this.removeEventListener('disconnected', this._handleDisconnect);
        this.modal.removeEventListener('click', this._onModalClicked.bind(this));
        this.dismissBtns.forEach(function (btn) {
            btn.removeEventListener('click', _this.onCancel.bind(_this));
        });
        document.removeEventListener('keydown', this._escKeyHandler);
    };
    /**
     * Open the dialog and return a promise.
     * The promise will be resolved with the selected value
     * or rejected in case of cancellation/aborting
     *
     * @api
     *
     * @returns {Promise}
     */
    LitDialog.prototype.open = function () {
        var _this = this;
        // add element to DOM => calls connectedCallback of element
        document.body.prepend(this);
        document.body.classList.add('modal-open');
        // now DOM is available
        this.dismissBtns = this.querySelectorAll('[data-dismiss]');
        this.backdrop = /**@type {HTMLElement}*/ (this.querySelector('#backdrop'));
        this.modal = /**@type {HTMLElement}*/ (this.querySelector('#modal'));
        this.dismissBtns.forEach(function (btn) {
            btn.addEventListener('click', _this.onCancel.bind(_this));
        });
        /* if user clicks outside dialog */
        this.modal.addEventListener('click', this._onModalClicked.bind(this));
        this.escKeyHandler = this._escKeyHandler.bind(this);
        document.addEventListener('keydown', this._escKeyHandler);
        // handle programmatic removal of DOM-element 
        // (if promise was already rejected, 2nd rejection will not do anything...)
        this.addEventListener('disconnected', this._handleDisconnect);
        //show backdrop
        this.backdrop.classList.add('in');
        this.modal.classList.add('in');
        this.modal.style.display = 'block';
        return new Promise(function (resolve, reject) {
            _this._resolvePromise = resolve;
            _this._rejectPromise = reject;
        });
    };
    LitDialog.prototype.update = function () {
        lit_1.render(this.renderDialog(), this);
    };
    /**
     * Render Bootstrap modal
     * @private
     * @returns {TemplateResult}
     */
    LitDialog.prototype.renderDialog = function () {
        var sizeClass = { 'modal-sm': this.size === 'sm', 'modal-lg': this.size === 'lg' };
        return lit_1.html(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n            <div id=\"backdrop\" class=\"modal-backdrop\"></div>\n            <div id=\"modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\n                <div class=\"modal-dialog ", "\" role=\"document\">\n                    <div id=\"content\" class=\"modal-content\">\n                        ", "\n                    </div>\n                </div>\n            </div>"], ["\n            <div id=\"backdrop\" class=\"modal-backdrop\"></div>\n            <div id=\"modal\" class=\"modal fade\" tabindex=\"-1\" role=\"dialog\">\n                <div class=\"modal-dialog ", "\" role=\"document\">\n                    <div id=\"content\" class=\"modal-content\">\n                        ", "\n                    </div>\n                </div>\n            </div>"])), class_map_1.classMap(sizeClass), this.renderContent());
    };
    /**
     * Render dialog content.
     * Should be implemented by implementing classes
     * @api
     */
    LitDialog.prototype.renderContent = function () {
        return lit_1.html(templateObject_2 || (templateObject_2 = __makeTemplateObject(["Dialog content"], ["Dialog content"])));
    };
    /**
     * Reject (in case of cancellation or abortion) and close dialog
     * @param {any} reason
     * @api
     */
    LitDialog.prototype.reject = function (reason) {
        this._rejectPromise(reason);
        //call remove dialog afterwards as it will reject promise again (see _handleDisconnect)
        this.removeDialog();
    };
    /**
     * Resolve dialog (with selected value etc.) and close it
     * @api
     * @param {any} value
     */
    LitDialog.prototype.resolve = function (value) {
        this._resolvePromise(value);
        //call remove dialog afterwards as it will reject promise again (see _handleDisconnect)
        this.removeDialog();
    };
    /**
     * Close dialog modal-window
     */
    LitDialog.prototype.removeDialog = function () {
        document.body.removeChild(this);
        document.body.classList.remove('modal-open');
    };
    /**
     * If someone removes the dialog programmatically, this should handle promise resolution/rejection
     */
    LitDialog.prototype._handleDisconnect = function () {
        this._rejectPromise('dialog removed');
    };
    /**
     *
     * @param {MouseEvent} e
     */
    LitDialog.prototype._onModalClicked = function (e) {
        console.log('Click target is #modal', e.target == this.modal);
        if (e.target == this.modal) {
            this.onCancel(e);
        }
    };
    /**
     *
     * @param {MouseEvent|KeyboardEvent} e
     */
    LitDialog.prototype.onCancel = function (e) {
        e.preventDefault();
        e.stopPropagation();
        this.reject('User cancelled');
    };
    /**
     *
     * @param {KeyboardEvent} e
     */
    LitDialog.prototype._escKeyHandler = function (e) {
        if (e.key === 'Escape') {
            this.onCancel(e);
        }
    };
    return LitDialog;
}(HTMLElement));
exports.LitDialog = LitDialog;
var templateObject_1, templateObject_2;
