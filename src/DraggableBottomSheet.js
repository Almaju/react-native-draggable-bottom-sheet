import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Animated, Dimensions, Easing, PanResponder, TouchableWithoutFeedback, View,
} from 'react-native';

const { height } = Dimensions.get('window');

class DraggableBottomSheet extends Component {
  state = {
    open: false,
    opaque: false,
  };

  initialY = this.props.initialY < 0 ? height + this.props.initialY : this.props.initialY;

  finalY = this.props.finalY;

  triggerY = this.props.triggerY;

  y = new Animated.Value(height); // Hide it at first (below height)

  opacity = new Animated.Value(0); // Opacity of background for the layer

  panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => this.onShouldMove(gestureState),
    onPanResponderGrant: (_, gestureState) => this.onStartMove(gestureState),
    onPanResponderMove: (_, gestureState) => this.onMove(gestureState),
    onPanResponderRelease: (_, gestureState) => this.onEndMove(gestureState),
    onPanResponderTerminate: () => {},
  });

  componentDidMount = () => {
    // Animate the entrance
    setTimeout(
      () => this.animateDrag(this.initialY, { tension: 40, friction: 8 }),
      500,
    );
  }

  // Don't pan respond if not dragging (onPress)
  onShouldMove = gestureState => Math.abs(gestureState.dy) > 20

  onStartMove() {
    // Extract the current value in the offset and set the value to 0
    this.y.extractOffset();

    // Display the layer
    this.setState({ opaque: true });
  }

  onMove(gestureState) {
    // Set the value according to the gesture for drag
    this.y.setValue(gestureState.dy);

    // Set the opacity according to the gesture
    this.opacity.setValue(this.calcOpacity(gestureState.moveY));
  }

  onEndMove(gestureState) {
    // Set the offset to 0 and add it to the value
    this.y.flattenOffset();

    if (gestureState.dy > 0 && Math.abs(gestureState.dy) > this.triggerY) {
      // Move to bottom = close
      return this.handleClose();
    } if (gestureState.dy < 0 && Math.abs(gestureState.dy) > this.triggerY) {
      // Move to top = open
      return this.handleOpen();
    }
    // Reset
    const { open } = this.state;
    return open ? this.handleOpen() : this.handleClose();
  }

  // Utils function to calculate proper opacity for layer and 0.8 is max opacity
  calcOpacity = y => 0.8 * (1 - (y / height))

  animateDrag = (toValue, { friction = 8, tension = 100 } = {}) => Animated.spring(this.y, {
    toValue,
    friction,
    tension,
  }).start()

  animateOpacity = (display, callback) => Animated.timing(this.opacity, {
    toValue: display ? this.calcOpacity(this.finalY) : 0,
    duration: 200,
    easing: Easing.bezier(0.4, 0.0, 0.2, 1),
  }).start(callback)

  handleOpen = () => {
    this.animateDrag(this.finalY);
    this.animateOpacity(true);
    this.setState({ open: true });
  }

  handleClose = () => {
    this.animateDrag(this.initialY);
    this.animateOpacity(false, () => this.setState({ opaque: false }));
    this.setState({ open: false });
  }

  Handle = ({ children }) => (
    <View {...this.panResponder.panHandlers}>
      <TouchableWithoutFeedback onPress={this.handleOpen}>
        <View>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </View>
  )

  render() {
    const { children } = this.props;
    const { opaque } = this.state;

    return (
      <>
        <TouchableWithoutFeedback onPress={this.handleOpen}>
          <Animated.View
            style={{
              position: opaque ? 'absolute' : 'relative',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'black',
              opacity: this.opacity,
            }}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[{
            position: 'absolute',
          }, {
            transform: [{
              translateY: this.y,
            }],
          }]}
        >
          {/* <View style={{ height: height + this.finalY, paddingBottom: 2 * this.finalY }}> */}
          {children(this.Handle)}
          {/* </View> */}
        </Animated.View>
      </>
    );
  }
}

DraggableBottomSheet.propTypes = {
  children: PropTypes.func.isRequired,

  initialY: PropTypes.number,
  finalY: PropTypes.number,
  triggerY: PropTypes.number,
};

DraggableBottomSheet.defaultProps = {
  initialY: height - 100, // initialTop position
  finalY: 150, // translateY when open
  triggerY: height / 8, // Need to scroll 1/6 of screen to trigger opening
};

export default DraggableBottomSheet;
