import React, { Component } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, ActivityIndicator, Dimensions } from 'react-native';
import { ListItem } from 'react-native-elements'
import Axios from 'axios';
import url from '../API/Api'
import { Provider, Portal, Modal, List, IconButton, Colors } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class LichSuDieuChuyenNgangCap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: true,
      visible: false,
      lichSuDieuChuyen: [],
      chiTiet: [],
      listSanPham: []
    };
  }

  static navigationOptions = () => {
      return{
        title: 'Lịch Sử Chuyển Hàng',
        headerStyle: { backgroundColor: '#ED3036' },
        headerTintColor: '#FFFFFF'
      }
  }

  _getData = async() => {
    await Axios.get(`${url}taophieungangcap`)
    .then(res => {
      this.setState({
        lichSuDieuChuyen: res.data,
        refreshing: false
      })
    }).catch(() => {Alert.alert('LỖI', 'Không thể lấy dữ liệu')})
  }

  componentDidMount = async() => {
    await this._getData()
    console.log(this.state.listSanPham)
  }

  _showModal = async(ID) => {
    await Axios.get(`${url}taophieungangcap/${ID}`)
    .then(res => {
      this.setState({ 
        chiTiet: res.data,
        listSanPham: res.data[0].listanhsanpham,
        visible: true
      })
    })
  };

  _hideModal = () => this.setState({ visible: false });

  render() {
    if (this.state.refreshing) {
      return (
        <View style={{ flex: 1, margin: 0, paddingTop: '70%' }}>
          <ActivityIndicator size="large" color="red" />
          <Text style = {{textAlign: 'center', color: 'red'}}>Đang lấy dữ liệu...</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {
          this.state.lichSuDieuChuyen.map(item => {
            return(
              <TouchableOpacity onPress={this._showModal.bind(this, item.id_th)}>
                <ListItem
                  leftIcon = {{ name: 'assignment', color: '#2E3F59', size: 30, color: 'red'}}
                  rightIcon = {{ name: 'chevron-right', color: '#2E3F59', size: 20 }}
                  title= {`Mã Phiếu: ${item.ma_phieu}`}
                  subtitle={
                    <View>
                      <Text style={{color: '#999999'}}>Kho: {item.ten_kho_con}</Text>
                      <Text style={{color: '#999999'}}>Ngày điều chuyển: {item.ngay_thu_hoi}</Text>
                    </View>
                  }
                  containerStyle={{
                    borderRadius: 5,
                    margin: 5,
                    backgroundColor: '#FFF'
                  }}
                />
              </TouchableOpacity>
            )
          })
        }
        </ScrollView>
        {/*CHI TIET PHIEU DIEU CHUYEN*/}
        <Provider>
         <Portal>
           <Modal visible={this.state.visible} onDismiss={this._hideModal} contentContainerStyle={{alignItems: 'center'}}>
           
            {
              this.state.chiTiet.map(item => {
                return(
                  <View style={styles.chiTiet}>
                    <ScrollView>
                    {/*Nut Đóng*/}
                      <IconButton
                        icon = "close"
                        color = {Colors.red500}
                        size = {25}
                        accessibilityHint = 'Đóng'
                        onPress={() => this._hideModal()}
                      />
                      <List.Item
                        title="Chuyển đến kho"
                        description={item.ten_kho_con}
                        left={props => <List.Icon {...props} icon="fast-forward" color='red'/>}
                      />
                      <List.Item
                        title="Ngày chuyển"
                        description={item.ngay_thu_hoi}
                        left={props => <List.Icon {...props} icon="date-range" color='red'/>}
                      />
                      <List.Item
                        title="Thủ kho nhận"
                        description={item.ten_nguoi_giao}
                        left={props => <List.Icon {...props} icon="directions-walk" color='red'/>}
                      />
                      <List.Item
                        title="Danh sách sản phẩm"
                        left={props => <List.Icon {...props} icon="device-hub" color='red'/>}
                      />
                      {
                        this.state.listSanPham.map(item => {
                          return(
                            <List.Item
                              title={item.ten_san_pham}
                              description={`Số lượng: ${item.so_luong}`}
                              style={{
                                borderRadius: 5,
                                backgroundColor: '#EEE',
                                margin: 6
                              }}
                            />
                          )
                        })
                      }
                    </ScrollView>
                  </View>
                )
              })
            }
           </Modal>
         </Portal>
        </Provider>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2E2E2'
  },
  chiTiet: {
    backgroundColor: '#FFF',
    width: Dimensions.get('window').width * .9,
    height: Dimensions.get('window').height  * .8
  }
})