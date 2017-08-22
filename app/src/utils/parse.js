import Parse from 'parse';

const SpeedTest = Parse.Object.extend('speedTest');
const newSpeedTest = new SpeedTest();

class ParseUtil {
  constructor() {
    Parse.initialize('i2CrkZqcnq6jUuVDw0piRBkSOPk3HUNQWNQUoRHU', 'nwMptkgP0glZyEVeNbys1z8XaXSeCoOUNNdPQQ3S');
    Parse.serverURL = 'https://pg-app-2a5dc6oy16visk2hlsi122vhyey35g.scalabl.cloud/1/';
  }

  save = (data) => {
    newSpeedTest.set('download', data.download);
    newSpeedTest.set('downloadData', data.downloadData);
    newSpeedTest.set('upload', data.upload);
    newSpeedTest.set('uploadData', data.uploadData);
    newSpeedTest.set('ping', data.ping);
    newSpeedTest.set('pingData', data.pingData);
    newSpeedTest.set('jitter', data.jitter);
    newSpeedTest.set('jitterData', data.jitterData);
    newSpeedTest.set('ip', data.ip);

    return newSpeedTest.save(null);
  }

  get = (id) => {
    const query = new Parse.Query(SpeedTest);
    return query.get(id);
  }
}

export default new ParseUtil();
