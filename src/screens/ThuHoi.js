import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, Picker, KeyboardAvoidingView, Keyboard, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, TextInput, ScrollView } from 'react-native-gesture-handler';
import DateTimePicker from "react-native-modal-datetime-picker";
import { DataTable, Button, Colors } from 'react-native-paper';
import moment from 'moment'
import url from '../API/Api'
import ModalSelector from 'react-native-modal-selector'
import ThreeAxisSensor from 'expo-sensors/build/ThreeAxisSensor';
export default class ThuHoi extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id_san_pham_temp:"",
      so_luong_co_trong_kho:"Tồn Kho : 0",
      renderchitietphieunhap: true,
      ActivityIndicator_Loading2: false,
      listsanphamdanhap: [],
      ActivityIndicator_Loading: false,
      TxtinputTenThuKho: "",
      TxtinputMaPhieu: "",
      idnguoidung: "",
      iddonvi: "",
      idkhonguoidung: "",
      tenkhonguoidung: "",
      listkhocon: [],
      id_kho_con: "",
      ngay_thu_hoi: "",
      TxtinputGhiChu: "",
      isDateTimePickerVisible: false,
      maphieuthu: "",
      listsanpham: [],
      id_san_pham: "",
      soluong: "",
      listsanphamthuhoi: [],
      list_san_pham_kho_cha:[],
      so_luong_co_trong_kho_cha:"Tồn Kho : 0"
    };
  }
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('TEN'),
      headerStyle: {
        backgroundColor: navigation.getParam('COLOR'),
      },
      headerTintColor: '#FFFFFF',
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate('LichSuThuHoi')}
        >
          <Ionicons name="md-clipboard" size={30} color="#FFF" style={styles.iconlichsu} />
        </TouchableOpacity>
      ),
    }
  };
  /////////////////////////////////////////////
  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });

  };
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });

  };
  handleDatePicked = date => {
    this.setState({
      ngay_thu_hoi: moment(date).format("DD/MM/YYYY")
    })
    this.hideDateTimePicker();
  };
  ////////////
  getsanphamdanhap = async () => {
    await fetch(url + `chitietthuhoi/${this.state.maphieuthu}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          ActivityIndicator_Loading2: false,
          listsanphamdanhap: responseJson
        },
          function () {
            // console.log (responseJson)
          });
      })
      .catch((error) => {
        alert("Đã có lỗi xảy ra vui lòng thử lại")
      });
  }

  ///////////////////////////////////////////////////////////
  thuhoisanphamapi = async () => {


    await fetch(url + `chitietthuhoi`,
      {
        method: 'POST',
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            id_th: this.state.maphieuthu,
            id_san_pham: this.state.id_san_pham,
            ten_san_pham: this.state.id_san_pham,
            so_luong: this.state.soluong,
          })

      }).then((response) => response.json())
      .then((responseJsonFromServer) => {
        // if((responseJsonFromServer.id_th).length>0)
        if (responseJsonFromServer.id_san_pham == undefined) {
          this.setState({
            ActivityIndicator_Loading2: false,
          })
          alert("Thu Hồi Sản Phẩm không thành công")
        }
        else {
          this.getsanphamdanhap() 
          this.getdatalistsanpham()
          this.hienthisoluong(this.state.id_san_pham_temp)
          this.hienthisoluongkhocha(this.state.id_san_pham_temp)
        }


      }).catch((error) => {
        Alert.alert("Đã có lỗi xảy ra xin vui lòng thử lại !")
      })
      .done();


  }
  /////////////////////////////////////////////////////////////////////////
  getdatalistsanpham = async () => {
    /////idkhocon
    await fetch(url + `cbbspkhothuhoi/${this.state.id_kho_con}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          listsanpham:[],
          listsanpham:responseJson
        },
          function () {
          });
      })
      .catch((error) => {

        alert("Không lấy được dữ liệu của sản phẩm vui lòng thử lại")
      });
  }
  /////////////////////////////////////////////
  getdatalistsanphamkhocha= async () => {
    /////idkhocon
    await fetch(url + `cbbspkhothuhoi/${this.state.idkhonguoidung}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          
          list_san_pham_kho_cha:responseJson
        },
          function () {
          });
      })
      .catch((error) => {

        alert("Không lấy được dữ liệu của sản phẩm vui lòng thử lại")
      });
  }
  //////////////////////////////////////////
  taophieuapi = async () => {
    await fetch(url + `fnphieuthu`,
      {
        method: 'POST',
        headers:
        {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            ma_phieu: this.state.TxtinputMaPhieu,
            id_nguoi_nhan: this.state.idnguoidung,
            ngay_thu_hoi: this.state.ngay_thu_hoi,
            ten_dang_nhap: this.state.TxtinputTenThuKho,
            tu_id_kho: this.state.id_kho_con,
            den_id_kho: this.state.idkhonguoidung,
            ten_kho: this.state.tenkhonguoidung,
            ghi_chu: 1
          })

      }).then((response) => response.json())
      .then((responseJsonFromServer) => {
        // if((responseJsonFromServer.id_th).length>0)
        this.setState({
          ActivityIndicator_Loading: false,
          maphieuthu: responseJsonFromServer.id_th,
        });
        if (this.state.maphieuthu == undefined) {
          this.setState({
            ActivityIndicator_Loading: false,
          })
          alert("Tạo Phiếu Không Thành Công")
        }
        else {
      
          this.setState({
            ActivityIndicator_Loading: false,
          })
          this.getdatalistsanpham()
        }
      }).catch((error) => {
        Alert.alert("Đã có lỗi xảy ra xin vui lòng thử lại !")
      })
      .done();
  }


  ////////
  cleartext() {
    this.setState({
      TxtinputMaPhieu: ''
    })
  }
  ///////////////////////////////////////////////
  taophieu = () => {
    this.setState({
      ActivityIndicator_Loading: true
    })
    this.taophieuapi();
    this.cleartext()
  }
  ///////////////////////////////////////////
  nhapsanpham = () => {
    this.setState({
      ActivityIndicator_Loading2: true
    })
    this.thuhoisanphamapi()
  }
  //////////////////////////////////////
  getdatalistkhocon = async () => {
    return await fetch(url + `cbbkhocon/${this.state.iddonvi}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          listkhocon: responseJson
        }, function () {
          // In this block you can do something with new state.
          // refreshing: false,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .done();
  }
  getdataidkho = async () => {
    return await fetch(url + `nguoidungkho/${this.state.idnguoidung}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          idkhonguoidung: responseJson[0].id_kho,
          tenkhonguoidung: responseJson[0].ten_kho,
          iddonvi: responseJson[0].id_dv,
          TxtinputTenThuKho: responseJson[0].ten_nguoi_dung
        }), function () {
          // In this block you can do something with new state.
          // refreshing: false,
        };
      })
      .catch((error) => {
        console.error(error);
      });

  }///////////////////////////////////////////ChiTietSanPham.js
 hienthisoluongkhocha = async(id_san_pham) => {
  await this.getdatalistsanphamkhocha()
  var id_tim_so_luong = id_san_pham 
 var list_san_pham_tim = this.state.list_san_pham_kho_cha
 var s = (this.state.list_san_pham_kho_cha).length
 for (var i=0;i<s;i++)
 {
  if (list_san_pham_tim[i].id_san_pham == id_tim_so_luong)
  {
    var id_temp=id_tim_so_luong
    this.setState({
    id_san_pham : id_san_pham,
    so_luong_co_trong_kho_cha : "Tồn Kho: " +  JSON.stringify((list_san_pham_tim[i].so_luong))
  })
  break;
  }
  // else if(id_temp=="") {
  // this.setState({
  //     id_san_pham : id_san_pham,
  //     so_luong_co_trong_kho_cha : "Tồn Kho:0"
     
  //   })
  //   consolo.log(id_temp+"có hay ko")
  // }
 }
 return this.hienthisoluongkhocha;
 }
  //////////////////////////////////////
hienthisoluong  = async (id_san_pham) => {
  this.setState({
    id_san_pham_temp : id_san_pham
  })
await this.getdatalistsanpham()
console.log(id_san_pham)
 var id_tim_so_luong = id_san_pham 
 var list_san_pham_tim = this.state.listsanpham
 var s = (this.state.listsanpham).length
 for (var i=0;i<s;i++)
 {
  if (list_san_pham_tim[i].id_san_pham == id_tim_so_luong){
    // var convertnumber = parseInt(list_san_pham_tim[i].so_luong)
  this.setState({
    id_san_pham : id_san_pham,
    so_luong_co_trong_kho : "Tồn Kho:  " +  JSON.stringify((list_san_pham_tim[i].so_luong))
  })
  }
 }
}
//////////////////////////////////////////////
/////////////////////////////////////////////////
  componentDidMount = async () => {
    const idnguoidung = await AsyncStorage.getItem('ID')
    this.setState({
      idnguoidung: idnguoidung,

    })
    await this.getdataidkho();
    await this.getdatalistkhocon();
  }
  renderchitietphieu() {
    if (this.state.maphieuthu == 0) {
      return (
        <View>
          <Text style={{ fontSize: 30, textAlign: "center", borderBottomColor: 'green', marginBottom: 2, marginTop: 25 }}> Vui Lòng Tạo Phiếu Thu Hồi </Text>
        </View>
      )
    }
    else {
      return (
        <View>
          <Text style={{ fontSize: 20, textAlign: "center", borderBottomColor: 'green', marginBottom: 2, marginTop: 5 }}>Chi Tiết Phiếu Nhập</Text>
          <View style={styles.ViewContainerChitietPhieuNhap} >

            <Text style={{ color: 'red', fontSize: 20, fontWeight: 'normal', textAlign: 'center' }}>ID Phiếu : {this.state.maphieuthu}</Text>
            <View style={styles.chitietphieunhap}>
              <Text style={styles.textinput}>Sản Phẩm:</Text>
              <ModalSelector
                    style={{ flex:1 }}
                    accessible={true}
                    scrollViewAccessibilityLabel={'Scrollable options'}
                    cancelButtonAccessibilityLabel={'Cancel'}
                    data={this.state.listsanpham}
                    keyExtractor= {item => item.id_san_pham}
                    labelExtractor= {item => item.ten_san_pham}
                    initValue="Chọn Sản Phẩm"
                    onChange={(item)=>{this.hienthisoluong(item.id_san_pham),this.hienthisoluongkhocha(item.id_san_pham)}} 
                    // ref={selector => { this.selector = selector; }}
                    // customSelector={<Switch onValueChange={() => this.selector.open()} />}
                />
                <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
                <View style={{flexDirection:'column' ,flex:1}}>
                <Text style={{textAlign:'center'}}>Kho Thu Hồi:</Text>
                <TextInput
                   editable={false}
                  value={this.state.so_luong_co_trong_kho}
                  // keyboardType={'number-pad'}
                  onChangeText={text => this.setState({ so_luong_co_trong_kho : text })}
                  underlineColorAndroid='transparent'
                  style={{ backgroundColor:'#1244',height: 30, borderWidth: 1, borderColor: 'blue', textAlign: 'center', margin: 2, width: '100%', borderRadius: 15 }}
                />
                </View>
                <View style={{flexDirection:'column',flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{textAlign:'center'}}>Sô Lượng Thu Hồi:</Text>
                <TextInput
                  placeholder = "Nhập Số Lượng"
                  keyboardType={'number-pad'}
                  onChangeText={soluong => this.setState({ soluong })}
                  underlineColorAndroid='transparent'
                  style={{ height: 30, borderWidth: 1, borderColor: 'blue', textAlign: 'center', margin: 2, width: '100%', borderRadius: 15 }}
                />
                </View>
                <View style={{flexDirection:'column',flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text>Kho Nhận:</Text>
                <TextInput
                  editable={false}
                  value={this.state.so_luong_co_trong_kho_cha}
                  // keyboardType={'number-pad'}
                  underlineColorAndroid='transparent'
                  style={{backgroundColor:'#1244',height: 30, borderWidth: 1, borderColor: 'blue', textAlign: 'center', margin: 2, width: '100%', borderRadius: 15 }}
                />
                </View>
        
                </View>
            </View>
            <Button
              style={{ width: '70%', marginTop: 3, justifyContent: 'center', alignItems: 'center' }}
              icon="import-export"
              mode="contained"
              onPress={this.nhapsanpham.bind(this)}
              activeOpacity={0.5}
            >
              Thu Hồi Sản Phẩm
              </Button>
            <Text style={{ fontSize: 20, textAlign: "center", borderBottomColor: 'green', marginBottom: 2, marginTop: 5, }}>Danh Sách Sản Phẩm Thu Hồi</Text>

            <View style={styles.bangdanhsach}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Tên Sản Phẩm</DataTable.Title>
                  <DataTable.Title numeric>Số Lượng</DataTable.Title>
                  {
                          this.state.ActivityIndicator_Loading2 ? <ActivityIndicator color='#009688' size='large' style={styles.ActivityIndicatorStyle} /> : null
                  }
                </DataTable.Header>
                {
                  this.state.listsanphamdanhap.map((item, key) => {
                    return (

                      <DataTable.Row key={key}>
                        <DataTable.Cell>{item.ten_san_pham} </DataTable.Cell>
                        <DataTable.Cell numeric>{item.so_luong}</DataTable.Cell>
                      </DataTable.Row>
                    )

                  })


                }
              </DataTable>
            </View>
          </View>
        </View>
      )
    }

  }


  render() {
    return (
      <ScrollView>
        {
          this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large' style={styles.ActivityIndicatorStyle} /> : null
        }
        <View style={styles.ViewContainer}>
          <Text style={{ fontSize: 20, textAlign: "center", borderBottomColor: 'green', marginBottom: 2 }}>Tạo Phiếu Thu Hồi</Text>
          <View style={styles.ViewTaoPhieucontainer}>
            <View style={styles.ViewTaoPhieu}>
            <View style={{flexDirection:'column',flex:1}}>
              <Text style={styles.textinput}>Tên Thủ Kho:</Text>
              <TextInput
                editable={false}
                onChangeText={TxtinputTenThuKho => this.setState({ TxtinputTenThuKho })}
                underlineColorAndroid='transparent'
                style={{ height: 30, borderWidth: 1, borderColor: 'blue', borderRadius: 15, textAlign: 'center', margin: 2,backgroundColor: '#1244' }}
                value={this.state.TxtinputTenThuKho}
              />
              </View>
            <View style={{flexDirection:'column',flex:1}}>
            <Text style={styles.textinput}>Mô Tả:</Text>
              <TextInput
                onChangeText={TxtinputMaPhieu => this.setState({ TxtinputMaPhieu })}
                underlineColorAndroid='transparent'
                style={{height: 30,borderWidth: 1,borderColor: 'blue', borderRadius: 15,textAlign: 'center',  margin: 2,}}
              />
            </View>
               </View>
            <View style={styles.ViewTaoPhieu}>
            <View style={{flexDirection:'column',flex:1}}>
            <Text style={styles.textinput}>Kho Nhận: </Text>
              <TextInput 
                editable={false}
                underlineColorAndroid='transparent'
                style={{ height: 30, borderWidth: 1, borderColor: 'blue', borderRadius: 15, textAlign: 'center', margin: 2, backgroundColor: '#1244' }}
                value={this.state.tenkhonguoidung} />
            </View>
            <View style={{flexDirection:'column',flex:1}}>
            <Text style={styles.textinput}>Kho Thu Hồi </Text>
            <ModalSelector
                    accessible={true}
                    scrollViewAccessibilityLabel={'Scrollable options'}
                    cancelButtonAccessibilityLabel={'Cancel'}
                    data={this.state.listkhocon}
                    keyExtractor= {item => item.id_kho}
                    labelExtractor= {item => item.ten_kho}
                    initValue="Chọn Kho"
                    onChange={(item)=>{ this.setState({id_kho_con:item.id_kho})}} 
                />
            </View>
            </View>
            <View style={styles.ViewTaoPhieu}>
            <View style={{flexDirection:'column',flex:1}}>
            <TouchableOpacity
                onPress={this.showDateTimePicker.bind(this)}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ fontSize: 15, margin: 3 }}>Ngày Thu Hồi </Text>
                  <MaterialIcons name="date-range" size={20} style={{ alignItems: 'center', }} />
                </View>
              </TouchableOpacity>
              <TextInput
                onChangeText={ngay_thu_hoi => this.setState({ ngay_thu_hoi })}
                underlineColorAndroid='transparent'
                style={{ height: 30, borderWidth: 1, borderColor: 'blue', borderRadius: 10, textAlign: 'center', margin: 2, flex: 1 }}
                placeholder="DD/MM/YY"
                value={this.state.ngay_thu_hoi}
              /> 
            </View>
            </View>
            <Button
              style={{ width: '50%', margin: 5, justifyContent: 'center', alignItems: 'center' }}
              icon="create"
              mode="contained"
              onPress={this.taophieuapi.bind(this)}
              activeOpacity={0.5}
            >
              Tạo Phiếu
          </Button>
            </View>
            <DateTimePicker
              isVisible={this.state.isDateTimePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
              mode={'date'}
              datePickerModeAndroid={'spinner'}
            />
            {/* //////////////////////////////////////////////////////////////////////chi tiết */}
         
          {this.renderchitietphieu()}
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  chitietphieunhap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bangdanhsach: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "blue",
    marginBottom: 10,
    flex: 1,
    width: '95%'

  },
  ViewTaoPhieu: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  ViewTaoPhieucontainer: {
    flex: 1,
    flexDirection: 'column',
    // justifyContent:'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
    // alignItems:'stretch',
    // flexWrap: 'wrap',
    borderWidth: 2,
    borderColor: 'green',
    borderRadius: 5,
    margin: 5,
    marginTop: 5,
  },
  textinput: {
    fontWeight: 'normal',
    fontSize: 16,
    // flex: 0.7,
    marginLeft: 2,
  },
  ActivityIndicatorStyle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  TextInputStyleClass: {
    // alignItems: 'center',

    // justifyContent: 'center',
    height: 30,
    borderWidth: 1,
    borderColor: 'blue',
    // backgroundColor:"#1244",
    // Set border Radius.
    borderRadius: 15,
    textAlign: 'center',
    margin: 2,
    width: '25%',
  },
  ViewContainerChitietPhieuNhap: {
    flex: 1,
    flexDirection: 'column',
    borderWidth: 2,
    borderColor: '#295B7E',
    borderRadius: 5,
    justifyContent: 'center',
    margin: 5,
    alignItems: 'center'
  },
  iconlichsu: {
    marginRight: 15,
  }
})
