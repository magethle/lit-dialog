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
     * Dialog size, null for normal/default size
     *
     * @type {'sm'|'lg'|null|undefined}
     */
    size: 'sm' | 'lg' | null | undefined;
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * Open the dialog and return a promise.
     * The promise will be resolved with the selected value
     * or rejected in case of cancellation/aborting
     *
     * @api
     *
     * @returns {Promise}
     */
    open(): Promise<any>;
    dismissBtns: NodeListOf<Element>;
    backdrop: HTMLElement;
    modal: HTMLElement;
    escKeyHandler: any;
    _resolvePromise: (value: any) => void;
    _rejectPromise: (reason?: any) => void;
    update(): void;
    /**
     * Render Bootstrap modal
     * @private
     * @returns {TemplateResult}
     */
    private renderDialog;
    /**
     * Render dialog content.
     * Should be implemented by implementing classes
     * @api
     */
    renderContent(): TemplateResult;
    /**
     * Reject (in case of cancellation or abortion) and close dialog
     * @param {any} reason
     * @api
     */
    reject(reason: any): void;
    /**
     * Resolve dialog (with selected value etc.) and close it
     * @api
     * @param {any} value
     */
    resolve(value: any): void;
    /**
     * Close dialog modal-window
     */
    removeDialog(): void;
    /**
     * If someone removes the dialog programmatically, this should handle promise resolution/rejection
     */
    _handleDisconnect(): void;
    /**
     *
     * @param {MouseEvent} e
     */
    _onModalClicked(e: MouseEvent): void;
    /**
     *
     * @param {MouseEvent|KeyboardEvent} e
     */
    onCancel(e: MouseEvent | KeyboardEvent): void;
    /**
     *
     * @param {KeyboardEvent} e
     */
    _escKeyHandler(e: KeyboardEvent): void;
}
import { TemplateResult } from "lit-html";
