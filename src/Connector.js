import React, { Component } from 'react';
import {
  PanResponder,
  View,
} from 'react-native';
import PropTypes from 'prop-types';

const borderWidth = 7
// const padding = [5,10,5,11] // top, bottom, left, right
const padding = [0,5,0,11]
const boxSize = 25

export const CONNECTOR_TOP_LEFT = 'tl';
export const CONNECTOR_TOP_MIDDLE = 'tm';
export const CONNECTOR_TOP_RIGHT = 'tr';
export const CONNECTOR_MIDDLE_RIGHT = 'mr';
export const CONNECTOR_BOTTOM_RIGHT = 'br';
export const CONNECTOR_BOTTOM_MIDDLE = 'bm';
export const CONNECTOR_BOTTOM_LEFT = 'bl';
export const CONNECTOR_MIDDLE_LEFT = 'ml';
export const CONNECTOR_CENTER = 'c';

/**
 * Connector component for handle touch events.
 */
export class Connector extends Component {

  constructor(props) {
    super(props);

    this.position = {
      x: 0,
      y: 0,
    };

    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (event, gestureState) => true,
      onStartShouldSetPanResponderCapture: (event, gestureState) => true,
      onMoveShouldSetPanResponder: (event, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (event, gestureState) => true,

      onPanResponderGrant: (event, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        const {
          onStart
        } = this.props;

        this.position = {
          x: 0,
          y: 0,
        };

        onStart([
          0,
          0,
        ]);
      },
      onPanResponderMove: (event, gestureState) => {
        const {
          onMove
        } = this.props;

        onMove([
          gestureState.dx - this.position.x,
          gestureState.dy - this.position.y,
        ]);

        this.position = {
          x: gestureState.dx,
          y: gestureState.dy,
        };
      },
      onPanResponderTerminationRequest: (event, gestureState) => true,
      onPanResponderRelease: (event, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        const {
          onEnd
        } = this.props;

        onEnd([
          gestureState.moveX,
          gestureState.moveY,
        ]);
      },
      onPanResponderTerminate: (event, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (event, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  getStyles = (type, x, y) => {
    if (type == 'tl') {
      return {
        left: x + padding[2],
        top: y + padding[0],
        borderLeftWidth: borderWidth,
        borderTopWidth: borderWidth,
      }
    } else if (type == 'tr') {
      return {
        left: x - padding[3],
        top: y + padding[0],
        borderRightWidth: borderWidth,
        borderTopWidth: borderWidth
      }
    } else if (type == 'bl') {
      return {
        left: x + padding[2],
        top: y - padding[3],
        borderLeftWidth: borderWidth,
        borderBottomWidth: borderWidth
      }
    } else if (type == 'br') {
      return {
        left: x - padding[3],
        top: y - padding[3],
        borderBottomWidth: borderWidth,
        borderRightWidth: borderWidth
      }
    }
  }

  render() {
    const {
      x,
      y,
      size,
      type
    } = this.props;

    return (
      <View
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        style={[this.getStyles(type, x, y), {
          position: 'absolute',
          width: boxSize,
          height: boxSize,
          borderColor: '#fff',
          backgroundColor: 'rgba(255,255,255)',
        }]}
        {...this._panResponder.panHandlers}
      />
    );
  }
}

Connector.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  size: PropTypes.number,
  onStart: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired,
  onEnd: PropTypes.func.isRequired,
};
