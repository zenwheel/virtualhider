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
 * Original Author: Gopi Sankar Karmegam, modified Scott Jann with code from Tobias Ehrig
 ******************************************************************************/

const Main = imports.ui.main;
const { NM, GLib } = imports.gi;

const Me = imports.misc.extensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;
const SignalManager = Convenience.SignalManager;

let extensionName = Me.dir.get_basename();
let matchRegExp = RegExp('^veth|^vmnet|^vboxnet|^$', 'i');
let _instance;

function _l(s) { log(`${extensionName}: ${s}`); }
function init() { }

var VirtualHider = class VirtualHider {
    constructor() {
        this._nAttempts = 0;
        this._signalManager = new SignalManager();
        // Note: Make sure don't initialize anything after this
        this._checkDevices();
    }

    _unscheduleDeviceUpdate() {
        if(this._devTimeoutId){
            GLib.source_remove(this._devTimeoutId);
            this._devTimeoutId = null;
        }
    }

    _scheduleDeviceUpdate(timeout) {
        this._unscheduleDeviceUpdate();
        this._devTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, timeout, this._updateDevices.bind(this));
    }

    _updateDevices() {
        this._unscheduleDeviceUpdate();
        if(!this._network) return;
        let _devices = this._network._devices.wired.devices;
        for(var i = 0; i < _devices.length; i++) {
            let device = _devices[i];
            let name = device._device.interface;
            // only hide devices that were otherwise shown as
            // disconnected devices may be hidden already
            if(device.item.actor.visible && matchRegExp.test(name)) {
                device.item.actor.visible = false;
            }
        }

        this._scheduleDeviceUpdate(15000);
    }

    _checkDevices() {
        if(this._timeoutId){
            GLib.source_remove(this._timeoutId);
            this._timeoutId = null;
        }
        this._network = Main.panel.statusArea.aggregateMenu._network;
        if (this._network) {
            if (!this._network._client) {
                // Shell not initialized completely wait for max of
                // 100 * 1s
                if (this._nAttempts++ < 100) {
                    this._timeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, this._checkDevices.bind(this));
                }
            } else {
                this._client = this._network._client;

                this._signalManager.addSignal(this._client, 'device-added', this._devicesChanged.bind(this));
                this._signalManager.addSignal(this._client, 'device-removed', this._devicesChanged.bind(this));
                this._signalManager.addSignal(this._client, 'active-connection-added', this._connectionChanged.bind(this));
                this._signalManager.addSignal(this._client, 'active-connection-removed', this._connectionChanged.bind(this));

                this._updateDevices();
            }
        }
    }

    _connectionChanged(client) {
        _l(`_connectionChanged`);
        this._scheduleDeviceUpdate(500);
    }

    _devicesChanged(client, device) {
        _l(`_devicesChanged`);
        this._scheduleDeviceUpdate(500);
    }

    destroy() {
        this._unscheduleDeviceUpdate();
        this._signalManager.disconnectAll();
    }
};

function enable() {
    _instance = new VirtualHider();
}

function disable() {
    _instance.destroy();
    _instance = null;
}

