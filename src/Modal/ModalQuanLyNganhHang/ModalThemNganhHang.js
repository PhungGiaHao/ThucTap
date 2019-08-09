import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Alert } from 'react-native';
import Modal from 'react-native-modalbox'
import Button from 'react-native-button'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
const screen = Dimensions.get('window')
export default class ModalThemNganhHang extends Component {
  state = {
    isVisible: false,
    TenNganhHang: '', //state of modal default false

  }
  showModalThemNganhHang = () => {
    this.refs.ModalThemNganhHang.open()
  }
  Themnganhhang = () => {
    Alert.alert(this.state.TenNganhHang)
  }
  render() {
    return (
      <Modal
        ref={"ModalThemNganhHang"}
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
          <Text>Thêm Ngành Hàng</Text>
        </View>
        <View style={style = styles.textinput}>
          <TextInput
            placeholder="Nhập vào tên ngành hàng"
            onChangeText={(text) => this.setState({ TenNganhHang: text })}
            value={this.state.TenNganhHang}
          />
        </View>
        <Button
          style={styles.btn}
          onPress={() => {
            if (this.state.TenNganhHang.length == 0) {
              alert("Nhập Vào Ngành Hàng");
              return;
            }
            else {
              this.Themnganhhang();
            }
            this.refs.ModalThemNganhHang.close();



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