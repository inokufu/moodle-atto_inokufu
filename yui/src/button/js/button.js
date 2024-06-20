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

Y.namespace(`M.${COMPONENTNAME}`).Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * Initialize the button
     *
     * @method Initializer
     */
    initializer: function () {

        // If we don't have the capability to view, then give up
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
     * Open the filepicker to select a Learning Object, if possible
     * @method _displayDialogue
     * @private
     */
    _displayDialogue: function () {
        const canShowFilepicker = this.get('host').canShowFilepicker('link');
        if (canShowFilepicker) {
            this.get('host').showFilepicker('link', this._attachObject, this);
        }
    },

    /**
     * Insert the resource into the editor
     * @param params
     * @private
     */
    _attachObject: async function (params) {
        this.get('host').focus();

        if (params.url !== '') {
            const html = await fetch(params.url + '/preview');
            const output = await html.text();

            this.get('host').insertContentAtFocusPoint(output);
            this.markUpdated();
        }
    }
});