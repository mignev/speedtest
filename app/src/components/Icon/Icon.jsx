import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Icon extends Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const attributes = {
      width: `${this.props.width}`,
      height: `${this.props.height}`,
      fill: this.props.fill,
    };

    if (this.props.customClassName) {
      return (
        <div className={this.props.customClassName}>
          <svg {...attributes}>
            <use xlinkHref={`#${this.props.name}`} />
          </svg>
        </div>
      );
    }

    return (
      <svg {...attributes}>
        <use xlinkHref={`#${this.props.name}`} />
      </svg>
    );
  }
}

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  fill: PropTypes.string.isRequired,
  customClassName: PropTypes.string.isRequired,
};

Icon.defaultProps = {
  fill: 'transparent',
  width: '100%',
  height: '100%',
  customClassName: '',
};
