#!/usr/bin/env node

/**
 * @caption Raspberry Pi example
 *
 *
 * @readme
 * This application allows to control features of the Raspberry Pi. It
 * can be used on its own or together with other example OSE
 * applications, see [Media player example].
 *
 *
 * @features
 * - GPIO digital input/output (light, switch, heater)
 * - taking pictures using `raspistill`
 *
 *
 * @usage
 * ## Usage
 *
 * For the Raspberry Pi example application to work, you need the following prerequisites:
 * - Node.js > 0.10, npm, git
 * - bower<br>
 *   `sudo npm install -g bower`
 *
 * To install the example application, do the following:
 *
 *     git clone https://github.com/OpenSmartEnvironment/ose-example-rpi
 *     cd ose-example-rpi
 *     npm install
 *
 * If you want to use this example on a BeagleBone, see [these
 * instructions](https://github.com/fivdi/onoff#installation).
 *
 * If you wish to use this example together with the [Media player example],
 * configure its IP address and port number within your network in
 * `bin/run.js`.
 *
 *     player: 'ws://IP_ADDRESS:PORT'
 *
 * Start the Raspberry Pi example as follows:
 *
 *     ./bin/run.js
 *
 *
 * To access the [HTML5 frontend], open the following URL in Firefox
 * **37 or newer** (Iceweasel in Debian Jessie is too old).<br>
 * **Before opening the link, enable the `dom.webcomponents.enabled`
 * option in `about:config`.**
 *
 *     http://localhost:4432
 *
 *
 * @module example-rpi
 * @main example-rpi
 */

/**
 * @caption Raspberry Pi example startup script
 *
 * @class example-rpi.bin.run
 * @type module
 */


'use strict';

// The OSE framework is initialized by requiring the "ose" package:
var O = require('ose').module(module);
O.package = 'ose-example-rpi';

var Path = require('path');

/*!
 * OSE is configured by a configuration object, `module.exports` in
 * this case. Each property of this object defines the configuration
 * for one [OSE plugin].
 */


// Basic properties of OSE instance
exports.ose = {
  name: 'rpi',           // Name of this OSE instance
  space: 'example.org',  // Space name this instance belongs to
  spid: 2,
  dummy: true,  // Enable this to use this example without GPIO capable hardware
};


// Enable general control package
exports['ose-control'] = {};

// Enable general rpi player package
exports['ose-rpi'] = {};

// Enable filesystem support
exports['ose-fs'] = {};


// Enable CLI interface
exports.cli = {
  id: 'ose/lib/cli',

  // CLI can run some commands:
  script: [
    'wait 2000',
    'space example.org',
    'shard rpi',

  /*
    'entry heater1',
    'command power 0.5',

    'entry rpi',
    'command emulatePin {"pin": 15, "value": 1}',
    'wait 1000',
    'entry heater1',
    'command power 1',
    'wait 1000',
    'entry rpi',
    'command emulatePin {"pin": 15, "value": 0}',
    'wait 1000',

    'command emulatePin {"pin": 4, "value": 0}',
    'wait 100',
    'command emulatePin {"pin": 4, "value": 1}',
    'wait 1000',

    'entry camera1',
    'command still',
    'info',
    'detail',
  */
  ],
};


// Enable HTTP server
exports.http = {
  id: 'ose/lib/http',
  port: 4432,
};


// Enable HTML5 frontend
exports['ose-html5'] = {

  // Define dashboard content
  dashboard: [
    {
      caption: 'Raspberry Pi',
      view: 'detail',
      ident: {
        entry: 'rpi',
        shard: 'rpi',
      }
    },
    {
      caption: 'Camera',
      view: 'detail',
      ident: {
        entry: 'camera1',
        shard: 'rpi',
      }
    },
    {
      caption: 'Images',
      view: 'list',
      ident: {
        map: 'all',
        shard: 'rpiImages',
      }
    },
    {
      caption: 'Light',
      view: 'detail',
      ident: {
        entry: 'light1',
        shard: 'rpi',
      }
    },
    {
      caption: 'Heater',
      view: 'detail',
      ident: {
        entry: 'heater1',
        shard: 'rpi',
      }
    },
    {
      caption: 'Switch',
      view: 'detail',
      ident: {
        entry: 'switch1',
        shard: 'rpi',
      }
    },
  ],
};


// Definition of data structure, the space named "example.org" contains all your data
exports.space = {
  id: 'ose/lib/space',         // Plugin module id
  name: 'example.org',         // Name of the space
  home: 'player',              // Home instance of the space

  // Peers to connect to
  peers: {
    // Media player OSE instance - Change the following IP
    // address to that of the media player instance.
    player: 'CHANGE_ME',  // example url: `player: 'ws://10.166.25.8:4431'`
  }
};

// The space is partitioned into shards:
// Raspberry Pi shard
exports.control = {
  id: 'ose/lib/shard',      // Plugin module id
  sid: 6,                   // Shard id unique within the space
  schema: 'control',        // Schema the shard belongs to
  alias: 'rpi',             // Shard alias
  entries: initRpi,         // Method initializing entries belonging
                            // to the shard, defined below
};

// Images taken by camera1
exports.images = {
  id: 'ose/lib/shard',      // Plugin module id
  sid: 7,                   // Shard id unique within the space
  schema: 'fs',             // Schema the shard belongs to
  alias: 'rpiImages',       // Shard alias
  root: Path.dirname(Path.dirname(module.filename)) + '/images',
};

// "rpi" shard initialization method.
function initRpi(shard) {
  var trans = shard.startTrans();

  // Entry representing Raspberry Pi
  trans.add('rpi', {
    alias: 'rpi',
    name: 'Raspberry Pi 1',
    dummy: exports.ose.dummy,  // Enable this to use this example without GPIO capable hardware
  });

  // Entry representing camera
  trans.add('raspicam', {
    alias: 'camera1',
    name: 'Raspberry Pi camera',
    camera: 0,
    save: {
      shard: 'rpiImages',
    }
  });

  // Entry representing switch
  trans.add('switch', {
    alias: 'switch1',
    name: 'Switch on Raspberry Pi 1',
    master: 'rpi',
    pin: 4,
  });

  // Entry representing light
  trans.add('light', {
    alias: 'light1',
    name: 'Light on Raspberry Pi',
    switches: ['switch1'],
    master: 'rpi',
    pinType: 'dout',
    channels: {white: 14},
    autoOff: 10,
  });

  // Entry representing high tariff sensor
  trans.add('din', {
    alias: 'highTariff',
    name: 'High tariff state',
    master: 'rpi',
    pin: 15,
  });

  // Entry representing heater
  trans.add('heater', {
    alias: 'heater1',
    name: 'Heater on Raspberry Pi',
    tariff: 'highTariff',
    master: 'rpi',
    pin: 17,
  });

  return trans.commit(O.log.bindError());
}

// Start OSE instance
O.run(exports);
