import React, { Component } from 'react';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import styles from './Home.scss';
import Icon from '../../components/Icon/Icon';
// eslint-disable-next-line import/no-extraneous-dependencies import/no-webpack-loader-syntax
const MyWorker = require('worker-loader!../../workers/speedtest_worker.js');


export default class Home extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showStartButton: true,
      data: {
        download: 0,
        downloadData: [0],
        upload: 0,
        uploadData: [0],
        ping: 0,
        pingData: [0],
        jitter: 0,
        jitterData: [0],
        ip: '0.0.0.0',
      },
    };
  }

  componentDidMount() {
  }


  handleClick = () => {
    const $this = this;
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

        $this.setState({
          showStartButton: true,
        });
      }

      // speedtest cancelled, clear output data
      if (status === 5) {
        data = [];
      }

      $this.setState((prevState) => {
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
            download: (status === 1 && data[1].length !== 0) ? data[1] : prevState.data.download,
            downloadData: newDownloadData,
            upload: (status === 3 && data[2].length !== 0) ? data[2] : prevState.data.upload,
            uploadData: newUploadData,
            ping: data[3].length !== 0 ? data[3] : prevState.data.ping,
            pingData: newPingData,
            ip: data[4].length !== 0 ? data[4] : prevState.data.ip,
            jitter: data[5].length !== 0 ? data[5] : prevState.data.jitter,
            jitterData: newJitterData,
          },
        };
      });
    };

    worker.postMessage('start');
  }

  render() {
    return (
      <div className={['content_holder', styles.home].join(' ')}>
        <section>
          <div className={[styles.inner, styles.header].join(' ')}>
            <Icon name="SashiDo" width="180" height="40" />
          </div>
        </section>

        <section>
          <div className={[styles.inner, styles.content].join(' ')}>

            <div className={styles.row}>
              <div className={styles.box}>
                <h3>Download</h3>
                <p>{this.state.data.download}</p>
                <span>Mbps</span>
              </div>

              <div className={styles.graph}>

                <div className={styles.x} />
                <div className={styles.y} />

                <div
                  className={
                    [styles.sparklines, this.state.data.downloadData.length > 8 ? styles.show : null].join(' ')
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
                    [styles.sparklines, this.state.data.uploadData.length > 2 ? styles.show : null].join(' ')
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

              <div className={styles.box}>
                <h3>Upload</h3>
                <p>{this.state.data.upload}</p>
                <span>Mbps</span>
              </div>
            </div>

          </div>
        </section>

        <section>
          <div className={[styles.inner, styles.content].join(' ')}>

            <div className={styles.row}>
              <div className={styles.box}>
                <h3>Ping</h3>
                <p>{this.state.data.ping}</p>
                <span>ms</span>
              </div>

              <div className={styles.graph}>
                <div className={styles.x} />
                <div className={styles.y} />
                <div
                  className={
                    [styles.sparklines, this.state.data.pingData.length > 2 ? styles.show : null].join(' ')
                  }>
                  <Sparklines
                    data={this.state.data.pingData}
                    min={Math.min(...this.state.data.pingData, ...this.state.data.jitterData)}
                    max={Math.max(...this.state.data.pingData, ...this.state.data.jitterData)}
                    margin={3}>
                    <SparklinesLine style={{ stroke: '#6afff3', strokeWidth: 0.8, fill: 'none' }} />
                    <SparklinesSpots
                      size={2}
                      style={{ stroke: '#6afff3', strokeWidth: 0.8, fill: '#2b333e' }} />
                  </Sparklines>
                </div>

                <div
                  className={
                    [styles.sparklines, this.state.data.jitterData.length > 2 ? styles.show : null].join(' ')
                  }>
                  <Sparklines
                    data={this.state.data.jitterData}
                    min={Math.min(...this.state.data.jitterData)}
                    max={Math.max(...this.state.data.jitterData)}
                    margin={3}>
                    <SparklinesLine style={{ stroke: '#bf71ff', strokeWidth: 0.8, fill: 'none' }} />
                    <SparklinesSpots
                      size={2}
                      style={{ stroke: '#bf71ff', strokeWidth: 0.8, fill: '#2b333e' }} />
                  </Sparklines>
                </div>
              </div>

              <div className={styles.box}>
                <h3>Jitter</h3>
                <p>{this.state.data.jitter}</p>
                <span>ms</span>
              </div>
            </div>

          </div>
        </section>

        <div
          className={[styles.button, styles.green].join(' ')}
          role="button"
          tabIndex="0"
          onClick={this.handleClick}>Start</div>
      </div>
    );
  }
}
