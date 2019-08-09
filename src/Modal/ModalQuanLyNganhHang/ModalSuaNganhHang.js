import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, Alert } from 'react-native';
import Button from 'react-native-button'
import Modal from 'react-native-modalbox'

import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
const screen = Dimensions.get('window')
export default class ModalSuaNganhHang extends Component {
  state = {
    isVisible: false, //state of modal default false
    TenNganhHang: "",
  }
  showModalSuaNganhHang = (item) => {
    this.refs.ModalSuaNganhHang.open(
      this.setState({
        TenNganhHang: item.tennganhhang
      })
  
    )
  }
  SuaNganhHang = () => {
    Alert.alert("sửa ngành hàng")
  }
  render() {
    return (
      <Modal ref={"ModalSuaNganhHang"}
      
        style={style = styles.Modal}
        position='center'
        backdrop={true}
        onClosed={() => { alert("Modal Closed") }}
      >
        <View style={style = styles.textTitle}>
          <Text>Sửa Ngành Hàng</Text>
        </View>
        <View style={style = styles.textinput}>
          <TextInput
            placeholder="Sửa Nghành Hàng"
            onChangeText={(text) => this.setState({ TenNganhHang: text })}
            value={this.state.TenNganhHang}
          />
        </View>
        <Button
          style={styles.btn}
          onPress={() => {
            if (this.state.TenNganhHang.length == 0) {
              alert("Nhập Vào Nhãn Hàng");
              return;
            }
            else {
              this.SuaNganhHang();
            }
            this.refs.ModalSuaNganhHang.close();
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
  },
  textinput: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    width: "80%",
    borderRadius: 5,
    marginTop: 10,

  },
  btn: {

    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#99ff99',
    width: 150,
    borderWidth: 1,
    borderRadius: 10,
  }
});