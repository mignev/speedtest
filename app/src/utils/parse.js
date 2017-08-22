import Parse from 'parse';

const SpeedTest = Parse.Object.extend('speedTest');
const newSpeedTest = new SpeedTest();

class ParseUtil {
  constructor() {
    Parse.initialize('i2CrkZqcnq6jUuVDw0piRBkSOPk3HUNQWNQUoRHU', 'nwMptkgP0glZyEVeNbys1z8XaXSeCoOUNNdPQQ3S');
    Parse.serverURL = 'https://pg-app-2a5dc6oy16visk2hlsi122vhyey35g.scalabl.cloud/1/';
    // Parse.serverURL = 'http://localhost:1337/1/';
  }

  save = (obj) => {
    newSpeedTest.set('download', obj.data.download);
    newSpeedTest.set('downloadData', obj.data.downloadData);
    newSpeedTest.set('upload', obj.data.upload);
    newSpeedTest.set('uploadData', obj.data.uploadData);
    newSpeedTest.set('ping', obj.data.ping);
    newSpeedTest.set('pingData', obj.data.pingData);
    newSpeedTest.set('jitter', obj.data.jitter);
    newSpeedTest.set('jitterData', obj.data.jitterData);
    newSpeedTest.set('ip', obj.data.ip);
    newSpeedTest.set('deviceInfo', obj.deviceInfo);
    newSpeedTest.set('region', obj.region);

    return newSpeedTest.save(null);
  }

  get = (id) => {
    const query = new Parse.Query(SpeedTest);
    return query.get(id);
  }
}

export default new ParseUtil();
