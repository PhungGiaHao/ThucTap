import React, { Component } from 'react';
import { View, Text, StyleSheet, Alert, StatusBar, Dimensions, Button ,ActivityIndicator} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import * as Animatable from "react-native-animatable";
import { Ionicons } from '@expo/vector-icons';
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default class QuetMa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      hasCameraPermission: null,
      scanned: false,
      scannerData: [],
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Quét Mã Qr",
      headerStyle: {
        backgroundColor: "#7A0F39",
      },
      headerTintColor: '#FFFFFF'
    }
  };///////
  makeSlideOutTranslation(translationType, fromValue) {
    return {
      from: {
        [translationType]: SCREEN_WIDTH * -0.18
      },
      to: {
        [translationType]: fromValue
      }
    };
  }
  async componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        loading:false,
        scanned: false 
      })
    });
    this.getPermissionsAsync();
  }
  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack

    this.focusListener.remove();
  }
  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  };
  handleBarCodeScanned = async ({ type, data }) => {
   await  this.setState({
      scanned: true,
      loading: true,
      scannerData: data,
    });
    this.props.navigation.navigate('ChiTietSanPham',{mavach:this.state.scannerData})
    console.log('i love you')
    
  };
  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Yêu Cầu cho Phép Truy Cập Máy Ảnh</Text>;

    }
    if (hasCameraPermission === false) {
      return <Text>Không có quyền truy cập vào máy ảnh</Text>;
    }
    if (this.state.loading) {
      return (
        <View style={styles.ActivityIndicator_Style}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
        <BarCodeScanner style={[styles.container]}
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
        >
          <View style={styles.rectangleContainer}>
            <View style={styles.topOverlay}>
              <Text style={{ fontSize: 30, color: "white" }}>
                Quét Mã Qr hoặc BarCode
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={styles.leftAndRightOverlay} />
              <View style={styles.rectangle}>
              <Ionicons
                  name="ios-qr-scanner"
                  size={SCREEN_WIDTH *  0.73}
                  color={iconScanColor}
                />
                <Animatable.View
                  style={styles.scanBar}
                  direction="alternate-reverse"
                  iterationCount="infinite"
                  duration={1700}
                  easing="linear"
                  animation={this.makeSlideOutTranslation(
                    "translateY",
                    SCREEN_WIDTH * -0.54
                  )}
                >   
                </Animatable.View>
              </View>
              <View style={styles.leftAndRightOverlay} />
            </View>
            <View style={styles.bottomOverlay} />
          </View>
        {scanned}
        </BarCodeScanner>
    );
  }
}
const overlayColor = "rgba(0,0,0,0.5)"; // this gives us a black color with a 50% transparency

const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = SCREEN_WIDTH * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "white";

const scanBarWidth = SCREEN_WIDTH  * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#424ef5";

const iconScanColor = "white";

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    height:SCREEN_HEIGHT,
  },
 
  rectangleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  rectangle: {
    height: rectDimensions,
    width: rectDimensions,
    borderWidth: rectBorderWidth,
    borderColor: rectBorderColor,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  },

  topOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    justifyContent: "center",
    alignItems: "center"
  },

  bottomOverlay: {
    flex: 1,
    height: SCREEN_WIDTH,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor,
    paddingBottom: SCREEN_WIDTH * 0.25
  },

  leftAndRightOverlay: {
    height: SCREEN_WIDTH * 0.65,
    width: SCREEN_WIDTH,
    backgroundColor: overlayColor
  },
  TextLoad: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 17
  },
  ActivityIndicator_Style: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0000ff'
  },
  scanBar: {
    width: scanBarWidth,
    height: scanBarHeight,
    backgroundColor: scanBarColor
  }
};

////////////////////////////
