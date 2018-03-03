/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image
} from 'react-native';

import SpriteSheet from './components/SpriteSheet'
import MultipleSpriteSheet from './components/MultipleSpriteSheet'
type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
    <View style={styles.container}>
      <MultipleSpriteSheet
      ref={ref => this.mummy = ref}
      source={[
        require('./images/Hotdog_0.png'),
        require('./images/Hotdog_1.png'),
        require('./images/Hotdog_2.png'),
        require('./images/Hotdog_3.png'),
        require('./images/Hotdog_4.png'),
        require('./images/Hotdog_5.png'),
        require('./images/Hotdog_6.png'),
        require('./images/Hotdog_7.png'),
        require('./images/Hotdog_8.png'),
        require('./images/Hotdog_9.png'),
        require('./images/Hotdog_10.png'),
        require('./images/Hotdog_11.png'),
        require('./images/Hotdog_12.png'),
        require('./images/Hotdog_13.png'),
        require('./images/Hotdog_14.png'),
        require('./images/Hotdog_15.png'),
        require('./images/Hotdog_16.png'),
        require('./images/Hotdog_17.png'),
        require('./images/Hotdog_18.png'),
        require('./images/Hotdog_19.png'),
        require('./images/Hotdog_20.png'),
        require('./images/Hotdog_21.png'),
        require('./images/Hotdog_22.png'),
        require('./images/Hotdog_23.png'),
        require('./images/Hotdog_24.png'),
        require('./images/Hotdog_25.png'),
        require('./images/Hotdog_26.png'),
        require('./images/Hotdog_27.png'),
        require('./images/Hotdog_28.png'),
        require('./images/Hotdog_29.png'),
        require('./images/Hotdog_30.png'),
        require('./images/Hotdog_31.png'),
      ]}
      height={520}
      width={374}/>
      <Button title='Play' onPress={() => {
        this.mummy.play({fps: 30, loop: true, resetAfterFinish: true});
      }}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
