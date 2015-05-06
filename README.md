# Open Smart Environment - Raspberry Pi example
This application allows to control features of the Raspberry Pi. It
can be used on its own or together with other example OSE
applications, see [Media player example](http://opensmartenvironment.github.io/doc/#mediaplayerexample).

## Features
- GPIO digital input/output (light, switch, heater)
- taking pictures using `raspistill`

## Important links
This package is a part of the OSE suite. For more information, see the following links:
- [Raspberry Pi example documentation](http://opensmartenvironment.github.io/doc/#example-rpi)
- [OSE suite documentation](http://opensmartenvironment.github.io/doc/)
- [All packages](https://github.com/opensmartenvironment/)

## About OSE
<b>Open Smart Environment software is a suite for creating
multi-instance applications that work as a single whole.</b><br>
Imagine, for example, a personal mesh running on various devices
including HTPCs, phones, tablets, workstations, servers, Raspberry
Pis, home automation gadgets, wearables, drones, etc.

OSE software consists of several npm packages: a [framework](http://opensmartenvironment.github.io/doc/#framework) running
on Node.js, an [HTML5 frontend](http://opensmartenvironment.github.io/doc/#html5frontend), extending
packages and a set of example applications.

<a href="http://opensmartenvironment.github.io/doc/resource/ose.svg"><img width=100% src="http://opensmartenvironment.github.io/doc/resource/ose.svg"></a>

**Set-up of current example applications.** Here,
OSE provides a [Media player](http://opensmartenvironment.github.io/doc/#example-player) running on an HTPC
that can be controlled by an IR remote through
[LIRC](http://opensmartenvironment.github.io/doc/#example-lirc) and is capable of playing streams from a
[DVB streamer](http://opensmartenvironment.github.io/doc/#example-dvb) and control devices through GPIO
pins on a [Raspberry Pi](http://opensmartenvironment.github.io/doc/#example-rpi)

For more information about OSE see **[the documentation](http://opensmartenvironment.github.io/doc/)**.

## Status
- Pre-alpha stage (insecure and buggy)
- Unstable API
- Patchy documentation
- No test suite

This is not yet a piece of download-and-use software. It is important
to understand the basic principles covered by the
[documentation](http://opensmartenvironment.github.io/doc/).

## Platforms
OSE has the following prerequisites:
- Node.js (>0.10) running on Debian Jessie and Raspbian
- Firefox 37 or newer with Web Components enabled

## Usage

For the Raspberry Pi example application to work, you need the following prerequisites:
- Node.js > 0.10, npm, git
- bower<br>
  `sudo npm install -g bower`

To install the example application, do the following:

    git clone https://github.com/OpenSmartEnvironment/ose-example-rpi
    cd ose-example-rpi
    npm install

If you want to use this example on a BeagleBone, see [these
instructions](https://github.com/fivdi/onoff#installation).

If you wish to use this example together with the OSE Media player,
configure its IP address and port number within your network in
`bin/run.js`.

    player: 'ws://IP_ADDRESS:PORT'

Start the Raspberry Pi example as follows:

    ./bin/run.js


To access the [HTML5 frontend](http://opensmartenvironment.github.io/doc/#html5frontend), open the following URL in Firefox
**37 or newer** (Iceweasel in Debian Jessie is too old).<br>
**Before opening the link, enable the `dom.webcomponents.enabled`
option in `about:config`.**

    http://localhost:4432


### Known bug:

If you see the following error, just restart `./bin/run.js`.

    ha> ========================================================
    1430212384 'ERROR | ose | EPERM |' 'EPERM, write'
    Stack Trace:
    Error: EPERM, write
        at Error (native)
    --------------------------------------------------------
    Logged at:
    Trace
        at Object.exports.error.exports.err (/home/pi/ose-example-rpi/node_modules/ose/lib/logger.js:276:11)
        at Object.exports.error (/home/pi/ose-example-rpi/node_modules/ose/lib/link.js:594:11)
        at /home/pi/ose-example-rpi/node_modules/ose-control/lib/pin/dout.js:106:14
        at /home/pi/ose-example-rpi/node_modules/ose-rpi/lib/rpi/node.js:286:7
        at FSReqWrap.strWrapper (fs.js:570:5)
    ========================================================

## Licence
This software is released under the terms of the [GNU General
Public Licence v3.0](http://www.gnu.org/copyleft/gpl.html) or
later.
