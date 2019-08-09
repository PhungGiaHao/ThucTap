import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Alert } from 'react-native';
import Modal from 'react-native-modalbox'
import Button from 'react-native-button'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
const screen = Dimensions.get('window')
export default class ModalThemNhanHang extends Component {
  state = {
    isVisible: false,
    TenNhanHang: '', //state of modal default false

  }
  showModalThemNhanHang = () => {
    this.refs.ModalThemNhanHang.open()
  }
  ThemNhanHang = () => {
    Alert.alert(this.state.TenNhanHang)
  }
  render() {
    return (
      <Modal
        ref={"ModalThemNhanHang"}
        style={style = styles.Modal}
        position='center'
        backdrop={true}
        animationType="slide"
        onClosed={() => {
          ///close modal
          Alert.alert("Modal Close")

        }}

      >
        <View style={style = styles.textTitle}>
          <Text>Thêm Nhãn Hàng</Text>
        </View>
        <View style={style = styles.textinput}>
          <TextInput
            placeholder="Nhập vào tên Nhãn Hàng"
            onChangeText={(text) => this.setState({ TenNhanHang: text })}
            value={this.state.TenNhanHang}
          />
        </View>
        <Button
          style={styles.btn}
          onPress={() => {
            if (this.state.TenNhanHang.length == 0) {
              alert("Nhập Vào Nhãn Hàng");
              return;
            }
            else {
              this.ThemNhanHang();
            }
            this.refs.ModalThemNhanHang.close();



          }}>
          Thêm
      </Button>
      </Modal>
    );
  }
}
const styles = StyleSheet.create({
  Modal: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: Platform.OS === 'ios' ? 20 : 0,
    shadowRadius: 10,
    width: screen.width - 80,
    height: 150,
    borderRadius: 10,
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
    fontWeight: 'bold'
  },
  textinput: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    width: "80%",
    borderRadius: 5,
    marginTop: 10
  },
  btn: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#99ff99',
    width: 150,
    borderWidth: 1,
    borderRadius: 2,
  }
});