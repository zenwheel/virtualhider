/*******************************************************************************
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later
 * version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 * *****************************************************************************
 * Original Author: Gopi Sankar Karmegam, modified Scott Jann
 ******************************************************************************/

const GObject = imports.gi.GObject;

var Signal = class Signal {
    constructor(signalSource, signalName, callback) {
        this._signalSource = signalSource;
        this._signalName = signalName;
        this._signalCallback = callback;
    }

    connect() {
        this._signalId = this._signalSource.connect(this._signalName, this._signalCallback);
    }

    disconnect() {
        if(this._signalId) {
            GObject.Object.prototype.disconnect.call(this._signalSource, this._signalId);
            this._signalId = null;
        }
    }
}

var SignalManager = class SignalManager {
    constructor() {
        this._signals = [];
    }

    addSignal(signalSource, signalName, callback) {
        let obj = null;
        if(signalSource && signalName && callback) {
            obj = new Signal(signalSource, signalName, callback);
            obj.connect();
            this._signals.push(obj);
        }
        return obj;
    }

    disconnectAll() {
        this._signals.forEach(function(obj) {obj.disconnect();});
        this._signals = [];
    }
}

