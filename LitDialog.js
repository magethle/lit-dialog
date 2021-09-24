import { html, render, TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Dialog component using boostrap 3 markup/classes
 *
 * Extending classes should override renderContent() to render the content of dialog,
 * call open() to open it and wait for the returned promise to resolve.
 * Don't forget to register dialog as a webcomponent via customElements.define(...) as otherwise you'll get `Uncaught TypeError: Illegal constructor`
 * 
 * See web-dialog for an alternative (https://github.com/andreasbm/web-dialog)
 */
export class LitDialog extends HTMLElement {

    /**
     * 
     * @param {'sm'|'lg'|null|undefined} size 
     */
    constructor(size) {
        super();

        /** 
         * Dialog size, null for normal/default size
         * 
         * @type {'sm'|'lg'|null|undefined} 
         */
        this.size = size; //'sm';
    }

    connectedCallback() {
        this.update();
    }

    disconnectedCallback() {
        this.dispatchEvent(new CustomEvent('disconnected'));

        this.removeEventListener('disconnected', this._handleDisconnect);
        this.modal.removeEventListener('click', this._onModalClicked.bind(this));
        this.dismissBtns.forEach( btn => {
            btn.removeEventListener('click', this.onCancel.bind(this));
        });

        document.removeEventListener('keydown', this._escKeyHandler);
    }

    /**
     * Open the dialog and return a promise.
     * The promise will be resolved with the selected value 
     * or rejected in case of cancellation/aborting
     * 
     * @api
     * 
     * @returns {Promise}
     */
    open() {
        // add element to DOM => calls connectedCallback of element
        document.body.prepend(this); 
        document.body.classList.add('modal-open');

        // now DOM is available
        this.dismissBtns = this.querySelectorAll('[data-dismiss]');
        this.backdrop = /**@type {HTMLElement}*/ (this.querySelector('#backdrop'));
        this.modal = /**@type {HTMLElement}*/ (this.querySelector('#modal'));

        this.dismissBtns.forEach( btn => {
            btn.addEventListener('click', this.onCancel.bind(this));
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

        return new Promise((resolve, reject) => {
            this._resolvePromise = resolve;
            this._rejectPromise = reject;
        });
    }

    update() {
        render(this.renderDialog(), this);
    }

    /**
     * Render Bootstrap modal
     * @private
     * @returns {TemplateResult}
     */
    renderDialog() {
        const sizeClass = {'modal-sm': this.size==='sm', 'modal-lg': this.size==='lg'};
        return html`
            <div id="backdrop" class="modal-backdrop"></div>
            <div id="modal" class="modal fade" tabindex="-1" role="dialog">
                <div class="modal-dialog ${classMap(sizeClass)}" role="document">
                    <div id="content" class="modal-content">
                        ${this.renderContent()}
                    </div>
                </div>
            </div>`;        
    }    

    /**
     * Render dialog content.
     * Should be implemented by implementing classes
     * @api
     */
    renderContent() {
        return html`Dialog content`;
    }
   

    /**
     * Reject (in case of cancellation or abortion) and close dialog
     * @param {any} reason
     * @api
     */
    reject(reason) {
        this._rejectPromise(reason);
        //call remove dialog afterwards as it will reject promise again (see _handleDisconnect)
        this.removeDialog();
    }

    /**
     * Resolve dialog (with selected value etc.) and close it
     * @api
     * @param {any} value 
     */
    resolve(value) {
        this._resolvePromise(value);
        //call remove dialog afterwards as it will reject promise again (see _handleDisconnect)
        this.removeDialog();
    }

    /**
     * Close dialog modal-window
     */
    removeDialog() {
        document.body.removeChild(this);
        document.body.classList.remove('modal-open');
    }   
    
    /**
     * If someone removes the dialog programmatically, this should handle promise resolution/rejection
     */
    _handleDisconnect()  {
        this._rejectPromise('dialog removed');
    }    

    /**
     * 
     * @param {MouseEvent} e 
     */
    _onModalClicked(e) {
        console.log('Click target is #modal', e.target == this.modal);
        if (e.target==this.modal) {
            this.onCancel(e);
        }
    }

    /**
     * 
     * @param {MouseEvent|KeyboardEvent} e 
     */
    onCancel(e) {
        e.preventDefault();
        e.stopPropagation();
        this.reject('User cancelled');
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    _escKeyHandler(e) {
        if (e.key === 'Escape') {
            this.onCancel(e);
        }
    }
   
}