import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import Device from 'react-device';
import styles from './CDN.scss';
import ParseUtil from '../../utils/parse';
import Icon from '../../components/Icon/Icon';
import LoaderDots from '../../components/LoaderDots/LoaderDots';
// eslint-disable-next-line import/no-extraneous-dependencies import/no-webpack-loader-syntax
const MyWorker = require('worker-loader!../../workers/speedtest_worker.js');


const url1 = 'http://mignev-cdn.cloudstrap.io/193c42f1d5edde3b74da3a56a99b816f_IMG_0128.JPG';
const url2 = 'http://571471536.r.worldcdn.net/193c42f1d5edde3b74da3a56a99b816f_IMG_0128.JPG';

const pingFile1 = 'http://mignev-cdn.cloudstrap.io/empty.txt';
const pingFile2 = 'http://571471536.r.worldcdn.net/empty.txt';

export default class CDN extends Component {

  constructor(props) {
    super(props);

    this.state = this.getInitialState();
  }

  getInitialState = () => {
    const initialState = {
      url: this.props.match.params.id === '1' ? url1 : url2,
      pingFile: this.props.match.params.id === '1' ? pingFile1 : pingFile2,
      showStartButton: true,
      startButtonText: 'Start SpeedTest',
      resultID: null,
      data: {
        download: 0,
        downloadData: [0],
        upload: 0,
        uploadData: [0],
        ping: 0,
        pingData: [0],
        jitter: 0,
        jitterData: [0],
        ip: '',
      },
      region: this.setRegionHeading(),
    };

    return initialState;
  }

  componentDidMount() {
    this.handleClick();
  }

  onChange = (deviceInfo) => {
    this.setState({
      deviceInfo,
    });
  }

  setRegionHeading = () => {
    const hostname = window.location.host;
    const headings = {
      'eu-speedtest.sashido.io': 'Europe',
      'us-speedtest.sashido.io': 'North America',
      'au-speedtest.sashido.io': 'Australia',
      'jp-speedtest.sashido.io': 'Asia',
    };

    return headings[hostname] || 'Unknown';
  }

  handleClick = () => {
    this.setState(this.getInitialState());
    const worker = new MyWorker();

    this.setState({
      showStartButton: false,
    });

    worker.postMessage('status');

    const interval = setInterval(() => {
      worker.postMessage('status');
    }, 100);

    worker.onmessage = (event) => {
      let data = event.data.split(';');
      const status = Number.parseFloat(data[0]);

      if (status >= 4) {
        clearInterval(interval);

        ParseUtil.saveCDN(this.state)
        .then((obj) => {
          console.info(`New object created with objectId: ${obj.id}`);
          this.setState({
            showStartButton: true,
            startButtonText: 'Restart SpeeTest',
            resultID: obj.id,
          });
        })
        .then((error) => {
          console.error(`Failed to create new object, with error code: ${error.message}`);
        });
      }

      // speedtest cancelled, clear output data
      if (status === 5) {
        data = [];
      }

      this.setState((prevState) => {
        const newDownloadData = prevState.data.downloadData;
        const newDownloadMegabits = Number.parseFloat(data[1]);

        if (status === 1 && newDownloadMegabits > 0) {
          newDownloadData.push(newDownloadMegabits);
        }

        const newUploadData = prevState.data.uploadData;
        const newUploadMegabits = Number.parseFloat(data[2]);

        if (status === 3 && newUploadMegabits > 0) {
          newUploadData.push(newUploadMegabits);
        }

        const newPingData = prevState.data.pingData;
        const newPingMs = Number.parseFloat(data[3]);

        if (newPingMs > 0) {
          newPingData.push(newPingMs);
        }

        const newJitterData = prevState.data.jitterData;
        const newJitterMs = Number.parseFloat(data[5]);

        if (newJitterMs > 0) {
          newJitterData.push(newJitterMs);
        }

        return {
          data: {
            download: (status === 1 && data[1].length !== 0) ? newDownloadMegabits : prevState.data.download,
            downloadData: newDownloadData,
            upload: (status === 3 && data[2].length !== 0) ? newUploadMegabits : prevState.data.upload,
            uploadData: newUploadData,
            ping: data[3].length !== 0 ? newPingMs : prevState.data.ping,
            pingData: newPingData,
            ip: data[4].length !== 0 ? data[4] : prevState.data.ip,
            jitter: data[5].length !== 0 ? newJitterMs : prevState.data.jitter,
            jitterData: newJitterData,
          },
        };
      });
    };

    worker.postMessage(`start { "count_ping": "70", "url_dl": "${this.state.url}", "url_ping": "${this.state.pingFile}" }`);
  }

  render() {
    return (
      <div className={['content_holder', styles.home].join(' ')}>
        <section>
          <div className={[styles.inner, styles.header].join(' ')}>
            <NavLink to="/">
              <Icon name="SashiDo" width="100%" height="100%" />
            </NavLink>
          </div>
        </section>

        <section>
          <div className={[styles.inner, styles.region].join(' ')}>
            {this.state.region} Region
          </div>
        </section>

        <section>
          <div className={[styles.inner, styles.content].join(' ')}>

            <div className={[styles.row, this.state.data.downloadData.length > 1 ? styles.show : null].join(' ')}>
              <div className={[styles.box, styles.c1].join(' ')}>
                <h3>Download</h3>
                <p>{this.state.data.download}</p>
                <span>Mbps</span>
              </div>

              <div className={styles.graphContainer}>
                <div className={styles.graph}>
                  <div className={styles.x} />
                  <div className={styles.y} />

                  <div
                    className={
                      [styles.sparklines, this.state.data.downloadData.length > 1 ? styles.show : null].join(' ')
                    }>
                    <Sparklines
                      data={this.state.data.downloadData}
                      min={Math.min(...this.state.data.downloadData, ...this.state.data.uploadData)}
                      max={Math.max(...this.state.data.downloadData, ...this.state.data.uploadData)}
                      margin={3}>
                      <SparklinesLine style={{ stroke: '#6afff3', strokeWidth: 0.8, fill: 'none' }} />
                      <SparklinesSpots
                        size={2}
                        style={{ stroke: '#6afff3', strokeWidth: 0.8, fill: '#2b333e' }} />
                    </Sparklines>
                  </div>

                  <div
                    className={
                      [styles.sparklines, this.state.data.uploadData.length > 1 ? styles.show : null].join(' ')
                    }>
                    <Sparklines
                      data={this.state.data.uploadData}
                      min={Math.min(...this.state.data.downloadData, ...this.state.data.uploadData)}
                      max={Math.max(...this.state.data.downloadData, ...this.state.data.uploadData)}
                      margin={3}>
                      <SparklinesLine style={{ stroke: '#bf71ff', strokeWidth: 0.8, fill: 'none' }} />
                      <SparklinesSpots
                        size={2}
                        style={{ stroke: '#bf71ff', strokeWidth: 0.8, fill: '#2b333e' }} />
                    </Sparklines>
                  </div>
                </div>
              </div>

              <div className={[styles.box, styles.c2].join(' ')}>
                <h3>Upload</h3>
                <p>{this.state.data.upload}</p>
                <span>Mbps</span>
              </div>
            </div>

          </div>
        </section>

        <section>
          <div className={[styles.inner, styles.content].join(' ')}>

            <div className={[styles.row, this.state.data.pingData.length > 1 ? styles.show : null].join(' ')}>
              <div className={[styles.box, styles.c3].join(' ')}>
                <h3>Ping</h3>
                <p>{this.state.data.ping}</p>
                <span>ms</span>
              </div>

              <div className={styles.graphContainer}>
                <div
                  className={styles.graph}>
                  <div className={styles.x} />
                  <div className={styles.y} />
                  <div
                    className={
                      [styles.sparklines, this.state.data.pingData.length > 1 ? styles.show : null].join(' ')
                    }>
                    <Sparklines
                      data={this.state.data.pingData}
                      min={Math.min(...this.state.data.pingData, ...this.state.data.jitterData)}
                      max={Math.max(...this.state.data.pingData, ...this.state.data.jitterData)}
                      margin={3}>
                      <SparklinesLine style={{ stroke: '#6a8dff', strokeWidth: 0.8, fill: 'none' }} />
                      <SparklinesSpots
                        size={2}
                        style={{ stroke: '#6a8dff', strokeWidth: 0.8, fill: '#2b333e' }} />
                    </Sparklines>
                  </div>

                  <div
                    className={
                      [styles.sparklines, this.state.data.jitterData.length > 1 ? styles.show : null].join(' ')
                    }>
                    <Sparklines
                      data={this.state.data.jitterData}
                      min={Math.min(...this.state.data.jitterData)}
                      max={Math.max(...this.state.data.jitterData)}
                      margin={3}>
                      <SparklinesLine style={{ stroke: '#ffbb6a', strokeWidth: 0.8, fill: 'none' }} />
                      <SparklinesSpots
                        size={2}
                        style={{ stroke: '#ffbb6a', strokeWidth: 0.8, fill: '#2b333e' }} />
                    </Sparklines>
                  </div>
                </div>
              </div>

              <div className={[styles.box, styles.c4].join(' ')}>
                <h3>Jitter</h3>
                <p>{this.state.data.jitter}</p>
                <span>ms</span>
              </div>
            </div>

          </div>
        </section>

        {
          this.state.data.ip !== '' &&
            <section>
              <div className={[styles.inner, styles.ip].join(' ')}>
                <h3>YOUR IP ADDRESS</h3>
                <p>{this.state.data.ip}</p>
              </div>
            </section>
        }

        {
          this.state.resultID &&
            <section>
              <div className={[styles.inner, styles.date].join(' ')}>
                <h3>Result URL</h3>
                <NavLink to={
                  `/result/${this.state.resultID}`}>{`${window.location.href}result/${this.state.resultID}`
                }</NavLink>
              </div>
            </section>
        }

        {
          this.state.data.ip === '' &&
            <section>
              <div className={[styles.inner, styles.buttonHolder].join(' ')}>
                {
                  this.state.showStartButton &&
                    <div
                      className={[styles.button, styles.green].join(' ')}
                      role="button"
                      tabIndex="0">
                      {this.state.startButtonText}
                    </div>
                }
                {
                  !this.state.showStartButton && this.state.data.ip === '' &&
                    <LoaderDots />
                }
              </div>
            </section>
        }

        <section>
          <div className={[styles.inner, styles.footer].join(' ')}>
            Have any feedback? Email support [at] sashido [dot] io.
          </div>
        </section>

        <Device onChange={this.onChange} />
      </div>
    );
  }
}

CDN.propTypes = {
  match: PropTypes.object.isRequired,
};
