#!/usr/bin/env node

'use strict';

const O = require('ose')(module);

var Content = require('../content');
Content.addModule('test/index');

var Config = require('../bin/run');
Config.ose.dummy = true;
Config['ose-test'] = {
  suites: [
    'ose/test',
    'ose-example-rpi/test',
  ],
};
