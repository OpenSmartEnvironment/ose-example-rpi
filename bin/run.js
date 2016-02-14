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
 * - Node.js > 0.12, npm, git
 *
 * To install the example application, do the following:
 *
 *     git clone https://github.com/OpenSmartEnvironment/ose-example-rpi
 *     cd ose-example-rpi
 *     npm install
 *
 * Installing dependencies can take some time.
 *
 * If you want to use this example on a BeagleBone, see [these
 * instructions](https://github.com/fivdi/onoff#installation).
 *
 * To configure this example, edit `ose-example-rpi/bin/run.js`.
 * If you wish to use this example together with the [Media player example],
 * configure its IP address and port number.
 *
 *     player: 'ws://IP_ADDRESS:PORT'
 *
 *
 * Start the Raspberry Pi example as follows:
 *
 *     ./ose-example-rpi/bin/run.js
 *
 *
 * To access the [HTML5 frontend], open the following URL in [supported browser]
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
const O = require('ose')(module)
  // This is main package file and we tell ose the name of the package
  .setPackage('ose-example-rpi')
;

var Path = require('path');

// OSE is configured by a configuration object, `module.exports` in
// this case. Each property of this object defines the configuration
// for one OSE plugin.

// Basic properties of OSE instance
exports.ose = {
  // Name of this OSE instance
  name: 'rpi',
  // Space name this instance belongs to
  space: 'example.org',
  // Instance id unique within the space
  spid: 2,
  // Enable `dummy` to use this example without GPIO capable hardware in demo mode
  dummy: true,
};

// Enable control package
exports['ose-control'] = {};

// Enable rpi package
exports['ose-rpi'] = {};

// Enable filesystem support
exports['ose-fs'] = {};

// Enable CLI interface
exports['ose/lib/cli'] = {
  // CLI can run some commands after initialization:
  script: [
    // Wait x milliseconds
    'wait 2000',
    // Select space `example.org`
    'space example.org',
    // Select shard with `rpi` alias
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
    }, {
      caption: 'Pin entries',
      view: 'list',
      listItems: true,
      ident: {
        query: 'name',
        shard: 'rpi',
      },
      filter: {
        role: 'pin',
      },
    }, {
      caption: 'Camera',
      view: 'detail',
      ident: {
        entry: 'camera1',
        shard: 'rpi',
      }
    }, {
      caption: 'Images',
      view: 'list',
      ident: {
        query: 'all',
        shard: 'rpiImages',
      }
    /*
    }, {
      caption: 'Light',
      view: 'detail',
      ident: {
        entry: 'light1',
        shard: 'rpi',
      }
    }, {
      caption: 'Heater',
      view: 'detail',
      ident: {
        entry: 'heater1',
        shard: 'rpi',
      }
    }, {
      caption: 'Switch',
      view: 'detail',
      ident: {
        entry: 'switch1',
        shard: 'rpi',
      }
    }, {
      caption: 'High tariff',
      view: 'detail',
      ident: {
        entry: 'highTariff',
        shard: 'rpi',
      }
    */
    }
  ],
};

// Definition of data structure, the space named "example.org" contains all your data
exports.space = {
  // Plugin module id
  id: 'ose/lib/space',
  // Name of the space
  name: 'example.org',
  // Home instance of the space
  home: 'player',

  // Peers to connect to
  peers: {
    // Media player OSE instance - Change the following IP
    // address to that of the media player instance.
    // example url: <br> `player: 'ws://10.166.25.8:4431'`
//    player: 'CHANGE_ME',
    player: 'ws://10.166.26.2:4431',
  }
};

// The space is partitioned into shards:

// Raspberry Pi shard
exports.control = {
  id: 'ose/lib/shard',
  // Shard id unique within the space
  sid: 6,
  // Schema the shard belongs to
  schema: 'control',
  // Shard alias
  alias: 'rpi',
  // Fill new empty shard with some data
  upgrades: [
    // Method initializing entries belonging to the shard, defined below
    initRpi,
  ],
};

// Images taken by camera1 are saved to the following shard
exports.images = {
  id: 'ose/lib/shard',
  // Shard id unique within the space
  sid: 7,
  // Schema the shard belongs to
  schema: 'fs',
  // Shard alias
  alias: 'rpiImages',
  // Root for shard data
  root: Path.dirname(Path.dirname(module.filename)) + '/images',
};

// "rpi" shard initialization method.
function initRpi(transaction, cb) {

  // Entry representing Raspberry Pi
  transaction.add('rpi', {
    alias: 'rpi',
    name: 'Raspberry Pi 1',
    dummy: exports.ose.dummy,
  });

  // Entry representing camera
  transaction.add('raspicam', {
    alias: 'camera1',
    name: 'Raspberry Pi camera',
    camera: 0,
    save: {
      shard: 'rpiImages',
    }
  });

  // Entry representing switch
  transaction.add('switch', {
    alias: 'switch1',
    name: 'Switch on Raspberry Pi 1',
    master: 'rpi',
    pin: 4,
  });

  // Entry representing light
  transaction.add('light', {
    alias: 'light1',
    name: 'Light on Raspberry Pi',
    switches: ['switch1'],
    master: 'rpi',
    pinType: 'dout',
    channels: {white: 14},
    autoOff: 10,
  });

  // Entry representing high tariff sensor
  transaction.add('din', {
    alias: 'highTariff',
    name: 'High tariff state',
    master: 'rpi',
    pin: 15,
    debounce: 2 * 1000,
  });

  // Entry representing heater
  transaction.add('heater', {
    alias: 'heater1',
    name: 'Heater on Raspberry Pi',
    tariff: 'highTariff',
    master: 'rpi',
    pin: 17,
  });

  return cb();
}

// Start OSE instance
O.run(exports);
