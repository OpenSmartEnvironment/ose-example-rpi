# Open Smart Environment - Raspberry Pi example
This application allows to control features of the Raspberry Pi. It
can be used on its own or together with other example OSE
applications, see [Media player example](http://opensmartenvironment.github.io/doc/#mediaplayerexample).

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

To install the example application, do the following:

    git clone https://github.com/OpenSmartEnvironment/ose-example-rpi
    cd ose-example-rpi
    npm install


When asked for gaia-component version answer "3":

    Unable to find a suitable version for gaia-component, please choose one:
       1) gaia-component#~0.2.0 which resolved to 0.2.1 and is required by gaia-slider#796330f304, gaia-value-selector#8870b647c7
       2) gaia-component#~0.3.0 which resolved to 0.3.5 and is required by gaia-button#0.0.4, gaia-checkbox#0.0.3, gaia-header#0.7.1, gaia-list#0.1.7, gaia-loading#84a8803886, gaia-pages#0.1.0, gaia-progress#02c312574a, gaia-sub-header#0.2.2, gaia-switch#4c28f022ca
       3) gaia-component#~0.3.4 which resolved to 0.3.5 and is required by ose-gaia
       4) gaia-component#~0.3.3 which resolved to 0.3.5 and is required by gaia-text-input#0.1.1

    Prefix the choice with ! to persist it to bower.json

    ? Answer: 3


If you want to use this example on a BeagleBone, see [these
instructions](https://github.com/fivdi/onoff#installation).


Start the Raspberry Pi example as follows:

    ./bin/run.js


To access the [HTML5 frontend](http://opensmartenvironment.github.io/doc/#html5frontend), open the following URL in Firefox
37 or newer with the `dom.webcomponents.enabled` option enabled in
`about:config`:

    http://localhost:4432

## Licence
This software is released under the terms of the [GNU General
Public Licence v3.0](http://www.gnu.org/copyleft/gpl.html) or
later.
