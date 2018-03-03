import React from 'react';
import {
  View,
  Animated,
  Easing,
  Text,
  Image
} from 'react-native';
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import PropTypes from 'prop-types';

const stylePropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
  PropTypes.array,
]);

export default class MultipleSpriteSheet extends React.PureComponent {
  static propTypes = {
    viewStyle: stylePropType, // styles for the sprite sheet container
    imageStyle: stylePropType // styles for the sprite sheet
  }

  state = {
    imageArray: [],
    topInputRange: [0, 1],
    topOutputRange: [0, 1],
    leftInputRange: [0, 1],
    leftOutputRange: [0, 1],
  }

  interpolationRanges = [];

  componentWillMount() {
    let { source, height, width } = this.props;
    let imageArray = [];
    source.forEach((item, index) => {
      let image = resolveAssetSource(item);
      let imageHeight = image.height;
      let imageWidth = image.width;
      let c = Math.floor(imageWidth / width);
      let r = Math.floor(imageHeight / height);

      imageArray.push({height: imageHeight, width: imageWidth, cols: c, rows: r, arr: Array.from(new Array(c * r),(val,index)=>index), time: new Animated.Value(0), opacity: new Animated.Value(0)});
    });
    this.generateInterpolationRanges(imageArray)
    this.setState({
      imageArray
    });
  }

  render() {
    //            

    let {
        imageArray,
      } = this.state;
    let { viewStyle, imageStyle, source, height, width } = this.props;
    return (
      <View
        style={[
          viewStyle,{
          height: height,
          width: width,
          //overflow: 'hidden',
        }]}>
        <Text>{imageArray.length}</Text>
        {imageArray.map((item, index) =>
        <View
        key={index}
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          left: 0}}>
          <Animated.Image
          source={source[index]}
          style={{
            opacity: item.opacity,
            height: item.height,
            width: item.width,
            top: item.time.interpolate({
              inputRange: this.interpolationRanges[index].top.in,
              outputRange: this.interpolationRanges[index].top.out
            }),
            left: item.time.interpolate({
              inputRange: this.interpolationRanges[index].left.in,
              outputRange: this.interpolationRanges[index].left.out})
              }}/>
        </View>)}
      </View>
    );
  }

  generateInterpolationRanges = (imageArray) => {
    //let { imageArray } = this.state; 
    imageArray.forEach((item, index) => {
      let { length } = item.arr;
      let input = [].concat(...Array.from({ length }, (_, i) => [i, i + 0.99999999999]));

      this.interpolationRanges.push({
        top: {
          in: input,
          out: [].concat(...item.arr.map(i => {
            let { y } = this.getFrameCoords(i, index, imageArray);
            return [y, y];
          }))
        },
        left: {
          in: input,
          out: [].concat(...item.arr.map(i => {
            let { x } = this.getFrameCoords(i, index, imageArray);
            return [x, x];
          }))
        }
      });
    });
  }

  stop = cb => {
    imageArray[0].time.stopAnimation(cb);
  }

  play = ({ fps = 24, loop = false, resetAfterFinish = false, onFinish = () => {} }) => {
    let {imageArray} = this.state; 
    let animationArray = Array.from(new Array(imageArray.length),(val,index) => index !== 0 ? Animated.parallel([
      Animated.timing(imageArray[index].time, {
        toValue: imageArray[index].arr.length,
        duration: imageArray[index].arr.length / fps * 1000,
        easing: Easing.linear
      }),
      Animated.timing(imageArray[index].opacity, {
        toValue: 1,
        duration: 0.5,
        easing: Easing.linear
      }),
      Animated.timing(imageArray[index - 1].opacity, {
        toValue: 0,
        duration: 0.5,
        easing: Easing.linear
      })
    ]) : Animated.parallel([
      Animated.timing(imageArray[index].time, {
        toValue: imageArray[index].arr.length,
      }),
      Animated.timing(imageArray[index].opacity, {
        toValue: 1,
        duration: 0.5,
        easing: Easing.linear
      })
    ]));
    let animation = Animated.sequence(animationArray);
    imageArray.forEach((item) => {
      item.time.setValue(0);
      item.opacity.setValue(0);
    })

    if (loop) {
      Animated.loop(animation).start();
    } else {
      animation.start(() => {
        if (resetAfterFinish) {
          imageArray.forEach((item) => {
            item.time.setValue(0);
            item.opacity.setValue(0);
          })
        }
        onFinish();
      });
    }
  }

  getFrameCoords = (i, index, imageArray) => {
    // let { rows, columns } = this.props;
    // let { frameHeight, frameWidth } = this.state;

    let { height, width } = this.props;
    //let { imageArray } = this.state;

    let successionWidth = i * width;

    return {
      x: -successionWidth % (imageArray[index].cols * width),
      y: -Math.floor(successionWidth / (imageArray[index].cols * width)) * height
    };
  }
}