'use strict';

const O = require('ose')(module)
  .singleton('ose-test/lib/suite')
;

exports = O.init('test/test');

var Assert = O.chai.assert;
var Equal = Assert.equal;

var Html5 = O.runtime === 'browser' ? require('ose-test/lib/html5') : null;

// Tests {{{1

exports.add('Get space', function(cb) {  // {{{2
  O.data.getSpace('example.org', function(err, space) {
    if (err) return cb(err);

    Equal(space.SUBJECT_STATE.READY, space.subjectState, 'exports.space state');
    Equal('example.org', space.name, 'exports.space name');

    exports.space = space;

    return cb();
  });
});

exports.add('Find shard', function(cb) {  // {{{2
  exports.space.findShard('rpi', function(err, shard) {
    if (err) return cb(err);

    Equal(shard.SUBJECT_STATE.READY, shard.subjectState, 'exports.shard state');
    Equal('rpi', shard.alias, 'exports.shard alias');

    exports.shard = shard;

    return cb();
  });
});

exports.add('Find rpi', function(cb) {  // {{{2
  exports.shard.find('rpi', function(err, entry) {
    if (err) return cb(err);

    Equal(entry.SUBJECT_STATE.READY, entry.subjectState, 'Entry state');
    Equal('rpi', entry.dval.alias, 'Entry alias');

    exports.rpi = entry;

    return cb();
  });
});

exports.add('Find switch1', function(cb) {  // {{{2
  exports.shard.find('switch1', function(err, entry) {
    if (err) return cb(err);

    Equal(entry.SUBJECT_STATE.READY, entry.subjectState, 'Entry state');
    Equal('switch1', entry.dval.alias, 'Entry alias');

    exports.switch1 = entry;

    return cb();
  });
});

exports.add('Find light1', function(cb) {  // {{{2
  exports.shard.find('light1', function(err, entry) {
    if (err) return cb(err);

    Equal(entry.SUBJECT_STATE.READY, entry.subjectState, 'Entry state');
    Equal('light1', entry.dval.alias, 'Entry alias');

    exports.light1 = entry;

    return cb();
  });
});

exports.add('Find highTariff', function(cb) {  // {{{2
  exports.shard.find('highTariff', function(err, entry) {
    if (err) return cb(err);

    Equal(entry.SUBJECT_STATE.READY, entry.subjectState, 'Entry state');
    Equal('highTariff', entry.dval.alias, 'Entry alias');

    exports.highTariff = entry;

    return cb();
  });
});

exports.add('Find heater1', function(cb) {  // {{{2
  exports.shard.find('heater1', function(err, entry) {
    if (err) return cb(err);

    Equal(entry.SUBJECT_STATE.READY, entry.subjectState, 'Entry state');
    Equal('heater1', entry.dval.alias, 'Entry alias');

    exports.heater1 = entry;

    return cb();
  });
});

exports.socket = exports.connectBrowser(function(cb) {  // {{{2
  cb(null, exports.shard);
});

exports.add('Dashboard', {runtime: 'browser'}, function(cb) {  // {{{2
  return O.ui.body.display({main: {view: 'dashboard'}}, 'user', function(err) {
    if (err) return cb(err);

    var dashboard = Html5.find(O.ui.body.main, 'ul');
    Html5.html(dashboard.header.find('h2'), 'Dashboard');
    Html5.list(dashboard, 'li>h3', ['Raspberry Pi', 'Pin entries', 'Camera', 'Images'/*, 'Light', 'Heater', 'Switch', 'High tariff'*/]);

    return O.async.nextTick(function() {
      dashboard.find('li:first-child').trigger('tap');
      exports.view = Html5.awaitView(cb);
    });
  });
});

exports.add('Emulate switch', {runtime: 'node'}, function(cb) {  // {{{2
  exports.rpi.post('emulatePin', {index: 4, value: 1}, cb);
});

exports.awaitSocket(exports.socket);  // {{{2

exports.add('Read switch', {runtime: 'browser'}, function(cb) {  // {{{2
  exports.list = Html5.list(
    exports.view,
    'li > section.row > section.stretch > h3',
    [
      '4 – din (switch)',
      '14 – dout (light)',
      '15 – din',
      '17 – dout'
    ]
  );

  return cb();
});

exports.finishSocket(exports.socket);  // {{{2

