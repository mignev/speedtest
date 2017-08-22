import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import Moment from 'moment';
import ParseUtil from '../../utils/parse';
import styles from '../Home/Home.scss';
import Icon from '../../components/Icon/Icon';


export default class Results extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      const $this = this;
      ParseUtil.get(this.props.match.params.id)
      .then((obj) => {
        $this.setState({
          data: {
            createdAt: obj.get('createdAt').toString(),
            download: obj.get('download'),
            downloadData: obj.get('downloadData'),
            upload: obj.get('upload'),
            uploadData: obj.get('uploadData'),
            ping: obj.get('ping'),
            pingData: obj.get('pingData'),
            jitter: obj.get('jitter'),
            jitterData: obj.get('jitterData'),
            ip: obj.get('ip'),
          },
        });
      })
      .then((error) => {
        console.error(`Failed to create new object, with error code: ${error.message}`);
      });
    }
  }

  render() {
    if (!this.state.data) {
      return null;
    }
    return (
      <div className={['content_holder', styles.home].join(' ')}>
        <section>
          <div className={[styles.inner, styles.header].join(' ')}>
            <Icon name="SashiDo" width="180" height="40" />
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

        <section>
          <div className={[styles.inner, styles.date].join(' ')}>
            <h3>This test was creadet at</h3>
            <p>{Moment(this.state.data.createdAt).format('M/DD/YYYY LT')}</p>
          </div>
        </section>

      </div>
    );
  }
}

Results.propTypes = {
  match: PropTypes.object.isRequired,
};
