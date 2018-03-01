import React from 'react';
import {
  View,
  Animated,
  Easing
} from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import PropTypes from 'prop-types';

const stylePropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
  PropTypes.array,
]);

export default class SpriteSheet extends React.PureComponent {
  static propTypes = {
    source: PropTypes.number.isRequired, // source must be required; { uri } will not work
    animations: PropTypes.object.isRequired, // see example
    viewStyle: stylePropType, // styles for the sprite sheet container
    imageStyle: stylePropType // styles for the sprite sheet
  }

  static defaultPropTypes = {
    animations: {}
  }

  state = {
    imageHeight: 0,
    imageWidth: 0,
    frameHeight: 0,
    frameWidth: 0,
    topInputRange: [0, 1],
    topOutputRange: [0, 1],
    leftInputRange: [0, 1],
    leftOutputRange: [0, 1],
  }

  time = new Animated.Value(0)
  interpolationRanges = {}

  componentWillMount() {
    // let { source, height, width, rows, columns } = this.props;
    // let image = resolveAssetSource(source);
    // let ratio = 1;
    // let imageHeight = image.height;
    // let imageWidth = image.width;
    // let frameHeight = image.height / rows;
    // let frameWidth = image.width / columns;

    let { source, height, width } = this.props;
    let image = resolveAssetSource(source);
    let ratio = 1;
    let imageHeight = image.height;
    let imageWidth = image.width;
    let frameHeight = height;
    let frameWidth = width;

    let cols = Math.floor(imageWidth / frameWidth);
    let rows = Math.floor(imageHeight / frameHeight);


    //if (width) {
      //ratio = (width * columns) / image.width;
      //imageHeight = image.height * ratio;
      //imageWidth = width * columns;
      //frameHeight = (image.height / rows) * ratio;
      //frameWidth = width;
    //} else if (height) {
      //ratio = (height * rows) / image.height;
      //imageHeight = height * rows;
      //imageWidth = image.width * ratio;
      //frameHeight = height;
      //frameWidth = (image.width / columns) * ratio;
    //}

    // this.setState({
    //   imageHeight,
    //   imageWidth,
    //   frameHeight,
    //   frameWidth
    // }, this.generateInterpolationRanges);

    this.setState({
        imageHeight,
        imageWidth,
        frameHeight,
        frameWidth,
        rows, 
        cols
      }, this.generateInterpolationRanges);
  }


  render() {
    // let {
    //   imageHeight,
    //   imageWidth,
    //   frameHeight,
    //   frameWidth,
    //   animationType
    // } = this.state;

    let {
        imageHeight,
        imageWidth,
        frameHeight,
        frameWidth,
        height,
        width,
        rows,
        cols,
        animationType
      } = this.state;
    let { viewStyle, imageStyle, source } = this.props;

    let { top = { in: [0, 0], out: [0, 0] }, left = { in: [0, 0], out: [0, 0] } } = this.interpolationRanges[animationType] || {};

    return (
      <View
        style={[
          viewStyle,{
          height: frameHeight,
          width: frameWidth,
          overflow: 'hidden'
        }]}>
        <Animated.Image
          source={source}
          style={[
            imageStyle, {
            height: imageHeight,
            width: imageWidth,
            top: this.time.interpolate({
              inputRange: top.in,
              outputRange: top.out
            }),
            left: this.time.interpolate({
              inputRange: left.in,
              outputRange: left.out
            })
          }]}
        />
      </View>
    );
  }

  generateInterpolationRanges = () => {
    let { animations } = this.props;

    for (let key in animations) {
      let { length } = animations[key];
      let input = [].concat(...Array.from({ length }, (_, i) => [i, i + 0.99999999999]));

      this.interpolationRanges[key] = {
        top: {
          in: input,
          out: [].concat(...animations[key].map(i => {
            let { y } = this.getFrameCoords(i);
            return [y, y];
          }))
        },
        left: {
          in: input,
          out: [].concat(...animations[key].map(i => {
            let { x } = this.getFrameCoords(i);
            return [x, x];
          }))
        }
      };
    }
  }

  stop = cb => {
    this.time.stopAnimation(cb);
  }

  play = ({ type, fps = 24, loop = false, resetAfterFinish = false, onFinish = () => {} }) => {
    let { animations } = this.props;
    let { length } = animations[type];

    this.setState({ animationType: type }, () => {
      let animation = Animated.timing(this.time, {
        toValue: length,
        duration: length / fps * 1000,
        easing: Easing.linear
      });

      this.time.setValue(0);

      if (loop) {
        Animated.loop(animation).start();
      } else {
        animation.start(() => {
          if (resetAfterFinish) {
            this.time.setValue(0);
          }
          onFinish();
        });
      }
    })
  }

  getFrameCoords = i => {
    // let { rows, columns } = this.props;
    // let { frameHeight, frameWidth } = this.state;

    //let { rows, columns } = this.props;
    let { frameHeight, frameWidth, imageHeight, imageWidth, cols, rows } = this.state;

    let successionWidth = i * frameWidth;

    return {
      x: -successionWidth % (cols * frameWidth),
      y: -Math.floor(successionWidth / (cols * frameWidth)) * frameHeight
    };
  }
}