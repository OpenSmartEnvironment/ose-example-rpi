'use strict';

var O = require('ose').object(module, 'ose-test/lib/suite');
// O.prepend('node');
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
  return O.ui.display({content: {view: 'dashboard'}}, function(err) {
    if (err) return cb(err);

    var d = Html5.find(O.ui.main, 'ul');
    Html5.html(d.header, 'Dashboard');
    var items = Html5.list(d, 'li>div>h3', ['Raspberry Pi', 'Camera', 'Images', 'Light', 'Heater', 'Switch', 'Lights', 'Heaters']);

    return O.async.nextTick(function() {
      items[0].click();
      exports.view = Html5.awaitView(cb);
    });
  });
});

exports.add('Emulate switch', {runtime: 'node'}, function(cb) {  // {{{2
  exports.rpi.post('emulatePin', {index: 4, value: 1}, cb);
});

exports.awaitSocket(exports.socket);

exports.add('Read switch', {runtime: 'browser'}, function(cb) {  // {{{2
  exports.list = Html5.list(exports.view, 'li > div > h3 > span:first-child', ['4 – din', '14 – dout', '15 – din', '17 – dout']);
  return cb();
});

exports.finishSocket(exports.socket);  // {{{2

