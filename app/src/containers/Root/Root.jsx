import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Isvg from 'react-inlinesvg';
import spriteSvg from '../../assets/images/sprite.svg';
import styles from './Root.scss';

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      svgsAreLoaded: true,
      cacheGetRequests: true,
    };
  }

  render() {
    return (
      <div className={[styles.root, this.state.svgsAreLoaded ? styles.show : null].join(' ')}>
        <div className={styles.content}>
          {this.props.children}
        </div>

        <Isvg src={spriteSvg} uniquifyIDs={false} cacheGetRequests={this.state.cacheGetRequests} />
      </div>
    );
  }
}

Root.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Root;
