# VIrtual Hider

Hide virtual network interfaces from the gnome system menu since they just get in the way.

* Docker (`veth*`)
* VMware (`vmnet*`)
* VirtualBox (`vboxnet*`)

## Installation

1. `mkdir -p $HOME/.local/share/gnome-shell/extensions`
2. `cd $HOME/.local/share/gnome-shell/extensions`
3. `git clone https://github.com/zenwheel/virtualhider.git virtualhider@zenwheel.com`

## Details

### Debugging

* `journalctl -f -o cat /usr/bin/gnome-shell | grep virtualhider`
* `Alt-F2`, `r` to reload the `gnome-shell`
* `Alt-F2`, `lg` to run `looking glass` to debug `gnome-shell`

### Adapted and modernized from

* https://github.com/liKe2k1/vmnethider
* https://github.com/kgshank/gse-disconnect-wifi

### Related Documentation

* https://developer.gnome.org/libnm/stable/NMClient.html
* https://lazka.github.io/pgi-docs/NM-1.0/enums.html#NM.DeviceType.VLAN

