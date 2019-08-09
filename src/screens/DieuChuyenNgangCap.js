import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Text, AsyncStorage, Alert, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Button, Dialog, List, Colors } from 'react-native-paper';
import { ListItem } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import url from '../API/Api'
import Axios from 'axios'

export default class DieuChuyenNgangCap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hienthi_kho_chuyen: false,
      hienthi_kho_den: false,
      hienthi_san_pham: false,
      levels: '',
      id_kho_chuyen: '',
      kho_chuyen: '',
      kho_den: 'Chọn kho đến...',
      listSanPham: [],
      sanPham: [],
      id_san_pham: '',
      khoDen: [],
      ngay_chuyen: '',
      so_luong_SP: null,
      so_luong_nhap: null,
      id_th: ''
    };
  }

  static navigationOptions = ( {navigation} ) => {
    return {
        title: 'Điều Chuyển Ngang Cấp',
        headerStyle: {
          backgroundColor: 'red',
        },
        headerTintColor: '#FFFFFF',
        headerRight: (
          <TouchableOpacity
            onPress={() => navigation.navigate('LichSuDieuChuyenNgangCap')}
          >
            <Ionicons name="ios-copy" size={25} color="#FFF" style={{
              marginRight: 15,
            }}/>
          </TouchableOpacity>
        ),
      }
  };

  _getKhoChuyen = async() => {
    const id_user = await AsyncStorage.getItem('ID')
    return await Axios.get(`${url}nguoidungkho/${id_user}`)
    .then(res => {
      this.setState({
        levels: res.data[0].levels,
        id_kho_chuyen: res.data[0].id_kho,
        kho_chuyen: res.data[0].ten_kho
      })
    })
  }

  _getKhoDen = async() => {
    return await Axios.get(`${url}cbbkhongangcap/${this.state.levels}/${this.state.id_kho_chuyen}`)
    .then(res => {
      this.setState({
        khoDen: res.data
      })
      console.log(this.state.khoDen)
    })
  }

  _getDanhSachSP = async() => {
    const id_user = await AsyncStorage.getItem('ID')
    return await Axios.get(`${url}khohangsanpham/${id_user}`)
    .then(res => {
      this.setState({
        listSanPham: res.data
      })
      console.log(this.state.listSanPham)
    })
  }

  _showKhoDen = async() => {
    await this._getKhoDen()
    this.setState({ hienthi_kho_den: true })
  };
  _showSanPham = async() => {
    this.setState({so_luong_nhap: '', hienthi_san_pham: true })
  };

  _hideKhoDen = () => this.setState({ hienthi_kho_den: false });
  _hideSanPham = () => {
    this.setState({ hienthi_san_pham: false})
  };

  _chuyenHang = async() => {
    if(this.state.id_kho_chuyen != '' && this.state.so_luong_nhap != '' && this.state.id_th != ''){
      if(Number(this.state.so_luong_SP) < Number(this.state.so_luong_nhap)){
        Alert.alert("ĐÃ XẢY RA LỖI", "Số lượng trong kho không đủ")
      }else if(Number(this.state.so_luong_nhap) == 0){
        Alert.alert("ĐÃ XẢY RA LỖI", "Số lượng không hợp lệ. Vui lòng nhập lại")
      }else{
          Axios({
            method: 'post',
            url: `${url}chitietthuhoi`,
            data: {
              id_th: this.state.id_th,
              id_san_pham: this.state.id_san_pham,
              so_luong: this.state.so_luong_nhap
            }
          }).then(
            Alert.alert("THÀNH CÔNG", "Đã hoàn tất việc chuyển hàng")
          )
      }
    }else{
      Alert.alert("ĐÃ XẢY RA LỖI", "Vui lòng chọn kho cần chuyển đến")
    }
  }

 componentDidMount= async() => {
  var date = new Date().getDate()
  var month = new Date().getMonth() + 1
  var year = new Date().getFullYear()
  await this._getDanhSachSP()
  await this._getKhoChuyen()
  this.setState({
    ngay_chuyen: `${year}-${month}-${date}`
  })
 }

  render() {
    return (
      <View style = {styles.container}>
        <ScrollView>
          {/*CHỌN KHO MUỐN CHUYỂN */}
          <View style={styles.kho}>
            <List.Item
              title="Từ kho"
              description={this.state.kho_chuyen}
              left={props => <List.Icon {...props} icon="file-upload" />}
            />
          </View>

          {/*CHỌN KHO ĐẾN */}
          <View style={styles.kho}>
            <List.Item
              title="Đến kho"
              description={this.state.kho_den}
              left={props => <List.Icon {...props} icon="file-download" />}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={this._showKhoDen}
            />
          </View>
  
          {/*CHỌN SẢN PHẨM CẦN CHUYỂN */}
          <Button
            icon="add-circle"
            color={Colors.red500}
            onPress={this._showSanPham}
          >CHỌN SẢN PHẨM</Button>
          <View>
          {
            this.state.sanPham.map(item => {
              return(
                <View>
                  <ListItem
                    leftAvatar={{rounded: false, width: 55, height: 65, source: {uri: item.linkanh}}}
                    title={item.tensanpham}
                    subtitle= {
                      <View>
                        <Text style={{color: '#868686'}}>Tồn kho: {item.soluong}</Text>
                        <TextInput
                          keyboardType = 'numeric'
                          placeholder="Nhập số lượng..."
                          value={this.state.so_luong_nhap}
                          mode='outlined'
                          onChangeText={(text)=> {
                            this.setState({
                              so_luong_nhap: text.replace(/[^0-9]/g, ''),
                            });
                          }}
                          style={{
                            height: 25
                          }}
                        />
                      </View>
                    }
                  />
                  
                  <Button
                    icon="add-shopping-cart"
                    mode="contained"
                    style={{
                      borderRadius: 30,
                      backgroundColor: 'red',
                      width: Dimensions.get('window').width * .4,
                      alignSelf: 'center',
                      padding: 5,
                      marginTop: 15
                    }}
                    onPress={this._chuyenHang}>
                    CHUYỂN HÀNG
                  </Button>
                </View>
              )
            })
          } 
          </View>
        </ScrollView>

        {/*BẢNG CHỌN KHO NHẬP */}
        <Dialog
            visible={this.state.hienthi_kho_den}
            onDismiss={this._hideKhoDen}
          >
          <Dialog.Title>Đến kho</Dialog.Title>
          <ScrollView showsVerticalScrollIndicator={false}>
          {
            this.state.khoDen.map(item => {
              return(
                <List.Item
                  title={item.ten_kho}
                  left={props => <List.Icon {...props} icon="account-balance" color='red'/>}
                  onPress={async() => {
                    await Axios({
                      method: 'post',
                      url: `${url}fnphieuthu`,
                      data: {
                        ma_phieu: 'PHIEUCHUYEN',
                        tu_id_kho: this.state.id_kho_chuyen,
                        den_id_kho: item.id_kho,
                        id_nguoi_giao: 0,
                        id_nguoi_nhan: 0,
                        ngay_thu_hoi: this.state.ngay_chuyen,
                        ghi_chu: '3'
                      }
                    }).then(res => {
                      this.setState({
                        id_th: res.data.id_th,
                        kho_den: item.ten_kho,
                        hienthi_kho_den: false
                      })
                      Alert.alert("HOÀN THÀNH", "Đã tạo phiếu chuyển thành công. Vui lòng chọn tiếp sản phẩm để hoàn thành.")
                    })
                  }}
                  style={{
                    padding: 0,
                    backgroundColor: '#EEE',
                    margin: 5
                  }}
                />
              )
            })
          } 
          </ScrollView>
        </Dialog>
        {/*BẢNG CHỌN SẢN PHẨM CẦN CHUYỂN*/}
        <Dialog
          visible={this.state.hienthi_san_pham}
          onDismiss={this._hideSanPham}
        >
          <Dialog.Title>Chọn sản phẩm</Dialog.Title>
            <ScrollView showsVerticalScrollIndicator={false}>
            {
              this.state.listSanPham.map(item => {
                return(
                  <ListItem
                    leftAvatar={{rounded: false, width: 55, height: 65, source: {uri: item.linkanh}}}
                    title={item.tensanpham}
                    description={item.so_luong}
                    onPress={() => {
                      this.state.sanPham.pop()
                      this.state.sanPham.push(item)
                      this.setState({
                        id_san_pham: item.idsanpham,
                        so_luong_SP: item.soluong
                      })
                      this._hideSanPham()
                    }}
                    subtitle={
                      <View>
                        <Text style = {{color: '#868686'}}>Ngày sản xuất: {item.ngaysanxuat}</Text>
                        <Text style = {{color: '#868686'}}>Số lượng: {item.soluong}</Text>
                      </View>
                    }
                  />
                )
              })
            }
            </ScrollView>
        </Dialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  so_luong:{
    margin: 5
  },
  container: {
    padding: 0,
    margin: 0,
    flex: 1,
    backgroundColor: '#FFF'
  },
  kho: {
    margin: 5,
    height: Dimensions.get('window').height / 14,
    backgroundColor: '#E4E4E4',
    borderRadius: 5,
    shadowOpacity: 1,
    shadowColor: '#EEE',
    shadowRadius: 5,
    shadowOffset: { width: 2, height: -2 },
    justifyContent: 'center'
  }
})