// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/*
 * @package    atto_inokufu
 * @copyright  2023, Inokufu
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_inokufu-button
 */

/**
 * Atto inokufu content tool.
 *
 * @namespace M.atto_inokufu
 * @class Button
 * @extends M.editor_atto.EditorPlugin
 */

const COMPONENTNAME = 'atto_inokufu';
const TITLEMAXLENGTH = 100;

const
    FORMNAMES = {
        URL: 'urlentry',
        TITLE: 'titleentry',
    },
    CSS = {
        RESOURCEURLWARNING: `${COMPONENTNAME}_urlwarning`,
        RESOURCETITLEWARNING: `${COMPONENTNAME}_titlewarning`,
        INPUTURL: `${COMPONENTNAME}_${FORMNAMES.URL}`,
        INPUTTITLE: `${COMPONENTNAME}_${FORMNAMES.TITLE}`,
        INPUTTITLELABEL: `${COMPONENTNAME}_${FORMNAMES.TITLE}_label`,
        INPUTTITLECOUNTERDIV: `${COMPONENTNAME}_${FORMNAMES.TITLE}_counter_div`,
        INPUTTITLECOUNTER: `${COMPONENTNAME}_${FORMNAMES.TITLE}_counter`,
        INPUTTITLECOUNTERWARNING: `${COMPONENTNAME}_${FORMNAMES.TITLE}_counterwarning`,
        FILEPICKER: `${COMPONENTNAME}_filepicker`,
        SUBMIT: `${COMPONENTNAME}_submitbutton`,
        SUBMITDIV: `${COMPONENTNAME}_submitdiv`,
    },
    SELECTORS = {
        INPUTURL: '.' + CSS.INPUTURL,
        INPUTTITLE: '.' + CSS.INPUTTITLE,
        FILEPICKER: '.' + CSS.FILEPICKER,
        SUBMIT: '.' + CSS.SUBMIT,
    },
    TO_HIDE = [
        SELECTORS.INPUTTITLE,
        '.' + CSS.INPUTTITLELABEL,
        '.' + CSS.INPUTTITLECOUNTERDIV,
        '.' + CSS.SUBMITDIV,
    ];

// @codingStandardsIgnoreStart

const TEMPLATE = '' +
    '<form class="atto_form">' +

    // Add the repository browser button.
    '<div style="display:none" role="alert" class="alert alert-warning mb-1 {{CSS.RESOURCEURLWARNING}}">' +
    '<label for="{{elementid}}_{{CSS.INPUTURL}}">' +
    '{{get_string "resourceurlrequired" component}}' +
    '</label>' +
    '</div>' +
    '<div style="display:none" role="alert" class="alert alert-warning mb-1 {{CSS.RESOURCETITLEWARNING}}">' +
    '<label for="{{elementid}}_{{CSS.INPUTTITLE}}">' +
    '{{get_string "resourcetitlerequired" component}}' +
    '</label>' +
    '</div>' +

    '{{#if showFilepicker}}' +
    '<div class="mb-1">' +
    '<div class="input-group w-100">' +
    '<input name="{{FORMNAMES.URL}}" class="form-control {{CSS.INPUTURL}}" type="hidden" ' +
    'id="{{elementid}}_{{CSS.INPUTURL}}" />' +
    '</div>' +
    '<button class="btn btn-secondary {{CSS.FILEPICKER}} w-100" type="button">' +
    '{{get_string "browserepositories" component}}</button>' +
    '</div>' +
    '{{else}}' +
    '<div class="mb-1">' +
    '<label for="{{elementid}}_{{CSS.INPUTURL}}" class="{{CSS.INPUTURL}}">{{get_string "enterurl" component}}</label>' +
    '<input name="{{FORMNAMES.URL}}" class="form-control fullwidth {{CSS.INPUTURL}}" type="url" ' +
    'id="{{elementid}}_{{CSS.INPUTURL}}" size="32"/>' +
    '</div>' +
    '{{/if}}' +

    // Add title field
    '<div class="mb-1">' +
    '<label for="{{elementid}}_{{CSS.INPUTTITLE}}" class="{{CSS.INPUTTITLELABEL}}">{{get_string "entertitle" component}}</label>' +
    '<input name="{{FORMNAMES.TITLE}}" class="form-control fullwidth {{CSS.INPUTTITLE}}" type="text" ' +
    'id="{{elementid}}_{{CSS.INPUTTITLE}}" size="32" placeholder="{{get_string \"entertitleplaceholder\" component}}"/>' +
    '</div>' +

    // Add character count for the title
    '<div class="{{CSS.INPUTTITLECOUNTERDIV}}">' +
    '<div class="d-flex justify-content-end small">' +
    '<span class="{{CSS.INPUTTITLECOUNTER}}">0</span>' +
    '<span>/</span>' +
    '<span>{{titleMaxLength}}</span>' +
    '</div>' +
    // Add warning in case title is too long
    '<div class="{{CSS.INPUTTITLECOUNTERWARNING}}" style="display:none; color: red;">' +
    '{{get_string \"errortitletoolong\" component}}' +
    '</div>' +
    '</div>' +

    // Add submit button
    '<div class="mdl-align {{CSS.SUBMITDIV}}">' +
    '<br/>' +
    '<button type="submit" class="btn btn-secondary {{CSS.SUBMIT}}">{{get_string "addresource" component}}</button>' +
    '</div>' +
    '</form>';

const IRIFRAME = '<iframe' +
    ' width="{{iriwidth}}"' +
    ' height="{{iriheight}}"' +
    ' srcdoc="{{irisrc}}"' +
    ' title="Inokufu\'s Learning Object"' +
    ' frameBorder="0"' +
    '></iframe>';

// @codingStandardsIgnoreEnd

Y.namespace(`M.${COMPONENTNAME}`).Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * A reference to the current learning object.
     *
     * @property _currentObject
     * @type Range
     * @private
     */
    _currentObject: null,

    /**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function () {

        // If we don't have the capability to view then give up.
        if (this.get('disabled')) {
            return;
        }

        this.addButton({
            icon: 'ed/icon',
            iconComponent: COMPONENTNAME,
            buttonName: 'InokufuSearch',
            callback: this._displayDialogue
        });
    },

    /**
     * Display the form popup.
     *
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function () {
        const dialogue = this.getDialogue({
            headerContent: M.util.get_string('loproperties', COMPONENTNAME),
            width: 'auto',
            focusAfterHide: true,
            focusOnShowSelector: SELECTORS.INPUTURL
        });
        // Set the dialogue content, and then show the dialogue.
        dialogue.set('bodyContent', this._getDialogueContent()).show();
    },

    /**
     * Return the dialogue content for the tool, attaching any required
     * events.
     *
     * @method _getDialogueContent
     * @return {Node} The content to place in the dialogue.
     * @private
     */
    _getDialogueContent: function () {
        const template = Y.Handlebars.compile(TEMPLATE),
            canShowFilepicker = this.get('host').canShowFilepicker('link'),
            content = Y.Node.create(template({
                elementid: this.get('host').get('elementid'),
                CSS: CSS,
                FORMNAMES: FORMNAMES,
                component: COMPONENTNAME,
                showFilepicker: canShowFilepicker,
                titleMaxLength: TITLEMAXLENGTH,
            }));

        this._form = content;

        this._form.one(SELECTORS.INPUTURL).on('change', this._manageUrlField, this);
        this._form.one(SELECTORS.INPUTTITLE).on('change', this._manageTitleField, this);
        this._form.one(SELECTORS.INPUTTITLE).on('input', this._onInputTitleCountChars, this);
        // onInput but for IE8 compatibility
        this._form.one(SELECTORS.INPUTTITLE).on('propertychange', this._onInputTitleCountChars, this);
        this._form.one(SELECTORS.SUBMIT).on('click', this._attachObject, this);

        if (canShowFilepicker) {
            this._form.one(SELECTORS.FILEPICKER).on('click', function () {
                this.get('host').showFilepicker('link', this._filepickerCallback, this);
            }, this);
            this._toggleLOFieldsVisibility(false);

            // Wait for the window to be displayed to click on the filepicker button
            Y.on('domready', function () {
                this._form.one(SELECTORS.FILEPICKER).simulate('click');
            }, this);
        }

        return content;
    },

    /**
     * Update the dialogue after a resource was selected in the File Picker.
     *
     * @method _filepickerCallback
     * @param {object} params The parameters provided by the filepicker
     * containing information about the image.
     * @private
     */
    _filepickerCallback: function (params) {
        if (params.url !== '') {
            const form = {
                url: this._form.one(SELECTORS.INPUTURL),
                title: this._form.one(SELECTORS.INPUTTITLE),
            };

            form.url.set('value', params.url);
            form.title.set('value', params.file);
            this._onInputTitleCountChars();
            this._toggleLOFieldsVisibility(true);
        }
    },

    /**
     * Remove all HTML tags from a string
     * @param {string} str 
     * @returns The sanitized string
     */
    _sanitizeTextInput: function (str) {
        return str.replace(/(<([^>]+)>)/gi, '');
    },

    /**
     * Insert the resource into the editor.
     * @param e
     * @private
     */
    _attachObject: async function (e) {
        const host = this.get('host');
        const form = this._form;
        const context = {
            url: form.one(SELECTORS.INPUTURL).get('value'),
            title: form.one(SELECTORS.INPUTTITLE).get('value'),
        };

        e.preventDefault();

        if (this._getWarnings()) {
            return;
        }

        host.focus();

        if (context.url !== '') {
            const template = Y.Handlebars.compile(IRIFRAME);

            const html = await fetch(context.url);
            let output = await html.text();

            if (context.title !== '') {
                // Sanitize title input
                context.title = this._sanitizeTextInput(context.title);

                try {
                    let htmlDoc;
                    // Check if DOMParser is available
                    if (typeof DOMParser !== 'undefined') {
                        const parser = new DOMParser();
                        htmlDoc = parser.parseFromString(output, 'text/html');
                    } else {
                        // For Internet Explorer
                        htmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                        htmlDoc.async = false;
                        htmlDoc.loadXML(output);
                    }
                    htmlDoc.getElementById('lo_title').innerHTML = context.title;

                    output = htmlDoc.documentElement.outerHTML;
                } catch (e) {
                    alert("Please use a more recent browser to modify this title");
                }
            }

            const render = template({
                iriwidth: 330,
                iriheight: 340,
                irisrc: output,
            });

            this.get('host').insertContentAtFocusPoint(render);
            this.markUpdated();
        }

        this.getDialogue({
            focusAfterHide: null
        }).hide();
    },

    /**
     * Toggle visibility of a given warning.
     * @param selector
     * @param predicate
     * @private
     */
    _toggleVisibility: function (selector, predicate) {
        const form = this._form;
        const element = form.one(selector);
        element.setStyle('display', predicate ? 'block' : 'none');
    },

    /**
     * Toggle visibility for first opening of the window 
     * (everything hidden except 'select LO' button)
     * @param predicate 
     */
    _toggleLOFieldsVisibility: function (predicate) {
        for (const field of TO_HIDE) {
            this._toggleVisibility(field, predicate);
        }
    },

    /**
     * onChange event for URL field.
     * @returns {boolean}
     * @private
     */
    _manageUrlField: function () {
        const form = this._form;
        const url = form.one(SELECTORS.INPUTURL).get('value');
        const hasError = url.trim() === '';

        this._toggleVisibility('.' + CSS.RESOURCEURLWARNING, hasError);
        return hasError;
    },

    /**
     * onChange event for title field.
     * @returns {boolean}
     * @private
     */
    _manageTitleField: function () {
        const form = this._form;
        const title = form.one(SELECTORS.INPUTTITLE).get('value');
        const hasError = title.trim() === '';

        this._toggleVisibility('.' + CSS.RESOURCETITLEWARNING, hasError);
        return hasError;
    },

    /**
     * Return true if a warning is triggered.
     * @returns {boolean}
     * @private
     */
    _getWarnings: function () {
        const urlError = this._manageUrlField();
        const titleError = this._manageTitleField();
        const hasErrors = urlError || titleError;
        this.getDialogue().centerDialogue();
        return hasErrors;
    },

    /**
     * onInput event: Count characters in the title field.
     * @private
     */
    _onInputTitleCountChars: function () {
        const form = this._form;
        const titleField = form.one(SELECTORS.INPUTTITLE).get('value');
        const countDiv = form.one('.' + CSS.INPUTTITLECOUNTERDIV);
        const currentCount = form.one('.' + CSS.INPUTTITLECOUNTER);

        currentCount.setHTML(titleField.length);
        if (parseInt(currentCount.get('innerHTML')) > TITLEMAXLENGTH) {
            // Display warning
            countDiv.setStyle('color', 'red');
            this._toggleVisibility('.' + CSS.INPUTTITLECOUNTERWARNING, true);
        } else {
            // Hide warning
            countDiv.setStyle('color', 'black');
            this._toggleVisibility('.' + CSS.INPUTTITLECOUNTERWARNING, false);
        }
    }

});