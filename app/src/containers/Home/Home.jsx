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
        downloadData: [1],
        mmArray: [0],
        upload: 0,
        uploadData: [1],
        ping: 0,
        ip: '0.0.0.0',
        jitter: 0,
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

      console.log('status', status);

      if (status >= 4) {
        clearInterval(interval);

        $this.setState({
          showStartButton: true,
        });
      }

      if (status === 5) {
        // speedtest cancelled, clear output data
        data = [];
      }

      $this.setState((prevState) => {
        const mmArray = prevState.data.mmArray;

        const newDownloadData = prevState.data.downloadData;
        const newDownloadMegabits = Number.parseFloat(data[1]);

        if (status === 1 && newDownloadMegabits > 0) {
          newDownloadData.push(newDownloadMegabits);
          mmArray.push(newDownloadMegabits);
        }

        const newUploadData = prevState.data.uploadData;
        const newUploadMegabits = Number.parseFloat(data[2]);

        if (status === 3 && newUploadMegabits > 0) {
          newUploadData.push(newUploadMegabits);
          mmArray.push(newUploadMegabits);
        }

        return {
          data: {
            download: (status === 1 && data[1].length !== 0) ? data[1] : prevState.data.download,
            downloadData: newDownloadData,
            upload: (status === 3 && data[2].length !== 0) ? data[2] : prevState.data.upload,
            uploadData: newUploadData,
            mmArray,
            ping: data[3].length !== 0 ? data[3] : prevState.data.ping,
            ip: data[4].length !== 0 ? data[4] : prevState.data.ip,
            jitter: data[5].length !== 0 ? data[5] : prevState.data.jitter,
          },
        };
      });
    };

    worker.postMessage('start');
  }

  render() {
    return (
      <div className={['content_holder', styles.home].join(' ')}>
        <div className={styles.top}>
          <Icon name="SashiDo" width="18rem" height="4rem" />
        </div>

        <div className={styles.holder}>
          <div className={styles.data}>
            <div className={[styles.box, this.state.data.ping === 0 ? styles.disabled : null].join(' ')}>
              <h3>Ping</h3>
              <p>{this.state.data.ping}</p>
              <span>ms</span>
            </div>

            <div className={[styles.box, this.state.data.download === 0 ? styles.disabled : null].join(' ')}>
              <h3>Download</h3>
              <p>{this.state.data.download}</p>
              <span>Mbps</span>
            </div>

            <div className={[styles.box, this.state.data.upload === 0 ? styles.disabled : null].join(' ')}>
              <h3>Upload</h3>
              <p>{this.state.data.upload}</p>
              <span>Mbps</span>
            </div>

            <div className={[styles.box, this.state.data.jitter === 0 ? styles.disabled : null].join(' ')}>
              <h3>Jitter</h3>
              <p>{this.state.data.jitter}</p>
              <span>Mbps</span>
            </div>
          </div>

          <div className={[styles.sparklines, this.state.data.downloadData.length > 2 ? styles.show : null].join(' ')}>
            <Sparklines
              data={this.state.data.downloadData}
              min={Math.min(...this.state.data.mmArray)}
              max={Math.max(...this.state.data.mmArray)}
              margin={6}>
              {
                // <SparklinesReferenceLine
                // type="avg"
                // style={{ stroke: '#fff', strokeOpacity: 0.3, strokeWidth: 0.3, strokeDasharray: '0.5, 1' }} />
              }
              <SparklinesLine style={{ stroke: '#6afff3', strokeWidth: 0.4, fill: 'none' }} />
              <SparklinesSpots
                size={1}
                style={{ stroke: '#6afff3', strokeWidth: 0.6, fill: '#2b333e' }} />
            </Sparklines>
          </div>

          <div className={[
            styles.sparklines,
            styles.upload,
            this.state.data.uploadData.length > 2 ? styles.show : null].join(' ')}>
            <Sparklines
              data={this.state.data.uploadData}
              min={Math.min(...this.state.data.mmArray)}
              max={Math.max(...this.state.data.mmArray)}
              margin={6}>
              <SparklinesLine style={{ stroke: '#bf71ff', strokeWidth: 0.4, fill: 'none' }} />
              <SparklinesSpots
                size={1}
                style={{ stroke: '#bf71ff', strokeWidth: 0.6, fill: '#2b333e' }} />
            </Sparklines>
          </div>

          {
            this.state.data.ip !== '0.0.0.0' &&
              <div className={[styles.ip].join(' ')}>
                <h3>Your IP Adrres</h3>
                <p>{this.state.data.ip}</p>
              </div>
          }
        </div>

        {
          this.state.showStartButton &&
            <div
              className={[styles.button, styles.green].join(' ')}
              role="button"
              tabIndex="0"
              onClick={this.handleClick}>Start</div>
        }
      </div>
    );
  }
}
