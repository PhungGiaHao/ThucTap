import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native'
import url from '../API/Api'
import { Ionicons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
export default class CanhBao extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      canhBaoHetHans: [],
      canhBaoSapHetHangs: [],
      canhBaoTonKhoLauNgays: [],
      refreshing: true,
    };
  }
  getdata = async () => {
    return await fetch(url + 'chcb')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson.canhBaoHetHans)
        this.setState({
          loading: false,
          canhBaoHetHans: responseJson.canhBaoHetHans,
          canhBaoSapHetHangs: responseJson.canhBaoSapHetHangs,
          canhBaoTonKhoLauNgays: responseJson.canhBaoTonKhoLauNgays,
          refreshing: false,

        }, function () {

          // In this block you can do something with new state.
          // refreshing: false,
          this.arrayholder = responseJson;
        });
      })
      .catch((error) => {
        this.setState({
          loading: false,
          refreshing: false,
        })
      });
  }
  componentDidMount() {
    this.getdata();
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('TEN'),
      headerStyle: {
        backgroundColor: navigation.getParam('COLOR'),
      },
      headerTintColor: '#FFFFFF'
    }
  };///////
  ListEmptyView = () => {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ textAlign: 'center', flex: 1, justifyContent: 'center', alignItems: 'center' }}> Không Có Cảnh Báo</Text>
      </View>

    );
  }
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.ActivityIndicator_Style}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    return (
      <ScrollView>
        <View style={styles.MainContainer}>
      
            <Text style={{ textAlign: 'center', fontSize: 25,color:'red' }}>Hết Hạn Sử Dụng</Text>
            {
              this.state.canhBaoHetHans.map((item) => {
                return (
                  <ScrollView>
                  <View style={styles.viewchild}>
               
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                      <View>
                        <Ionicons name="ios-warning" size={50} color="#FDC500" />
                      </View>
                      <View style={{ marginLeft: 5, flex: 1 }}>
                        <Text style={styles.text}>Tên Sản Phẩm: {item.ten_san_pham}
                        </Text>
                        {/* <Text style={styles.text}>Hạn Sử Dụng {item.ngay_nhap_sp}
              </Text> */}
                        
                        <Text style={styles.text}>Hạn Sử Dụng: {item.han_su_dung}</Text>
                        <Text style={styles.text}>Thời Gian Hết Hạn:{item.thoi_gan_het_han}</Text>
                        <Text style={styles.text}>Tồn Kho: {item.so_luong}
                        </Text>
                        {/* <Text style={{ color: 'red', fontSize: 15 }}>Cảnh Báo: {item.thong_tin_canh_bao}</Text> */}
                      </View>
                    </View>
                    
                  </View>
                  </ScrollView>
                )
              })
            }
      
            <Text style={{ textAlign: 'center', fontSize: 25,color:'red' }}>Hết Hàng</Text>
            {
              this.state.canhBaoSapHetHangs.map((item) => {
                return (
                  <ScrollView>
                  <View style={styles.viewchild}>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                      <View>
                        <Ionicons name="ios-warning" size={50} color="#FDC500" />
                      </View>
                      <View style={{ marginLeft: 5, flex: 1 }}>
                        <Text style={styles.text}>Tên Sản Phẩm:{item.ten_san_pham}
                        </Text>
                        {/* <Text style={styles.text}>Hạn Sử Dụng {item.ngay_nhap_sp}
              </Text> */}
                        {/* <Text style={styles.text}>Ngày Sản Xuất:{item.ngay_san_xuat}
              </Text> */}
                        <Text style={styles.text}>Tồn Kho:{item.so_luong}
                        </Text>
                        {/* <Text style={{ color: 'red', fontSize: 15 }}>Cảnh Báo:{item.thong_tin_canh_bao}</Text> */}
                      </View>
                    </View>
                 
                  </View>
                  </ScrollView>
                )
              })
            }
       
            <Text style={{ textAlign: 'center', fontSize: 25,color:'red' }}>Tồn Kho Lâu Ngày</Text>
            {
              this.state.canhBaoTonKhoLauNgays.map((item) => {
                return (
                  <ScrollView>
                  <View style={styles.viewchild}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
                      <View>
                        <Ionicons name="ios-warning" size={50} color="#FDC500" />
                      </View>
                      <View style={{ marginLeft: 5, flex: 1 }}>
                        <Text style={styles.text}>Tên Sản Phẩm:{item.ten_san_pham}</Text>
                        {/* <Text style={styles.text}>Hạn Sử Dụng {item.ngay_nhap_sp}
              </Text> */}
                        {/* <Text style={styles.text}>Ngày Sản Xuất:{item.ngay_san_xuat}
              </Text> */}
                        <Text style={styles.text}>Thời Gian Tồn Tại Trong Kho:{item.thoi_gian_ton_tai_trong_kho}</Text>
                        <Text style={styles.text}>Tồn Kho:{item.so_luong}</Text>
                        {/* <Text style={{ color: 'red', fontSize: 15 }}>Cảnh Báo:{item.thong_tin_canh_bao}</Text> */}
                      </View>
                    </View>
                  </View>
                  </ScrollView>
                )
              })
            }

       

        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 30,
  },

  item: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewchild: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
  }
  ,
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
});