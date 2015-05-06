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
 * If you wish to use this example together with the OSE Media player,
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
 * ### Known bug:
 *
 * If you see the following error, just restart `./bin/run.js`.
 *
 *     ha> ========================================================
 *     1430212384 'ERROR | ose | EPERM |' 'EPERM, write'
 *     Stack Trace:
 *     Error: EPERM, write
 *         at Error (native)
 *     --------------------------------------------------------
 *     Logged at:
 *     Trace
 *         at Object.exports.error.exports.err (/home/pi/ose-example-rpi/node_modules/ose/lib/logger.js:276:11)
 *         at Object.exports.error (/home/pi/ose-example-rpi/node_modules/ose/lib/link.js:594:11)
 *         at /home/pi/ose-example-rpi/node_modules/ose-control/lib/pin/dout.js:106:14
 *         at /home/pi/ose-example-rpi/node_modules/ose-rpi/lib/rpi/node.js:286:7
 *         at FSReqWrap.strWrapper (fs.js:570:5)
 *     ========================================================
 *
 * @scope control
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
var O = require('ose').app(module, 'example');

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
exports['ose-gaia'] = {

  // Define dashboard content
  dashboard: [
    {
      caption: 'Raspberry Pi',
      pagelet: 'detail',
      ident: {
        id: 'rpi',
        alias: 'rpi',
      }
    },
    {
      caption: 'Camera',
      pagelet: 'detail',
      ident: {
        id: 'camera1',
        alias: 'rpi',
      }
    },
    {
      caption: 'Images',
      pagelet: 'list',
      ident: {
        alias: 'rpiImages',
      }
    },
    {
      caption: 'Light',
      pagelet: 'detail',
      ident: {
        id: 'light1',
        alias: 'rpi',
      }
    },
    {
      caption: 'Heater',
      pagelet: 'detail',
      ident: {
        id: 'heater1',
        alias: 'rpi',
      }
    },
    {
      caption: 'Switch',
      pagelet: 'detail',
      ident: {
        id: 'switch1',
        alias: 'rpi',
      }
    },
    {
      caption: 'Lights',
      pagelet: 'list',
      listItems: true,
      ident: {
        kind: 'light',
        alias: 'rpi',
      }
    },
    {
      caption: 'Heaters',
      pagelet: 'list',
      listItems: true,
      ident: {
        kind: 'heater',
        alias: 'rpi',
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
  scope: 'control',         // Scope the shard belongs to
  alias: 'rpi',             // Shard alias
  entries: initRpi,         // Method initializing entries belonging
                            // to the shard, defined below

  /*
  db: {                     // Shard database backend
    id: 'ose-fs/lib/jsonDb',
    root: Path.dirname(Path.dirname(module.filename)) + '/data',
  }
  */
};

// Images taken by camera1
exports.images = {
  id: 'ose/lib/shard',      // Plugin module id
  sid: 7,                   // Shard id unique within the space
  scope: 'fs',              // Scope the shard belongs to
  alias: 'rpiImages',       // Shard alias
  db: {                     // Shard database backend
    id: 'ose-fs/lib/db',
    root: Path.dirname(Path.dirname(module.filename)) + '/images',
  }
};

// "rpi" shard initialization method.
function initRpi(shard) {
  /*
  if (shard.rev) {
    shard.cacheAll(O._.noop());
    return;
  }
  */

  // Entry representing Raspberry Pi
  shard.entry('rpi', 'rpi', {
    name: 'Raspberry Pi 1',
//    dummy: true,
  });

  // Entry representing camera
  shard.entry('camera1', 'raspicam', {
    name: 'Raspberry Pi camera',
    camera: 0,
    save: {
      shard: {alias: 'rpiImages'},
    }
  });

  // Entry representing switch
  shard.entry('switch1', 'switch', {
    name: 'Switch on Raspberry Pi 1',
    master: 'rpi',
    pin: 4,
  });

  // Entry representing light
  shard.entry('light1', 'light', {
    name: 'Light on Raspberry Pi',
    switch: 'switch1',
    master: 'rpi',
    pin: {
      index: 14,
      type: 'dout',
    },
    autoOff: 10,
  });

  // Entry representing high tariff sensor
  shard.entry('highTariff', 'din', {
    name: 'High tariff state',
    master: 'rpi',
    pin: 15,
  });

  // Entry representing heater
  shard.entry('heater1', 'heater', {
    name: 'Heater on Raspberry Pi',
    tariff: 'highTariff',
    master: 'rpi',
    pin: 17,
  });

//  shard.db.setRev(1, O._.noop);

  return;
}

// Start OSE instance
O.run(exports);
