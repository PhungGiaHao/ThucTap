import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Picker, ActivityIndicator ,Alert,KeyboardAvoidingView,Keyboard} from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import QuanLySanPham from './QuanLySanPham';
import ModalSelector from 'react-native-modal-selector'
import url from '../API/Api'
export default class NhapSanPham extends Component {
    constructor(props) {
        super(props);
        this.state = {
            TxtinputTenSanPham: "",
            PickerValueNganhHang: "",
            PickerValueNhanHang: "",
            isLoading: true,
            dataNhanHang: [],
            dataNganhHang: [],
            TxtinputDVT: "",
            TxtinputMaVach: "",
            TxtinputGia: "",
            TxtinputGhiChu: "",
            TxtinputMoDel :"",
        };
    }
    CheckValue = () => {
        alert(this.state.TextInputEmail)
    }
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Nhập Sản phẩm",
            headerStyle: {
                backgroundColor: "#001070",
            },
            headerTintColor: '#FFFFFF',
            
        }
    };

    getdataNganhHang = async () => {
        return await fetch(url+'nganhhang')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    dataNganhHang: responseJson
                }, function () {
                    // In this block you can do something with new state.
                });
            })
            .catch((error) => {
                alert("Không lấy được dữ liệu ngành hàng vui lòng thử lại ! ")
            });
    }

    getdataNhanHang = async () => {
        return await fetch(url+'nhanhang')
            .then((response) => response.json())
            .then((responseJson2) => {
                this.setState({
                    isLoading: false,
                    dataNhanHang: responseJson2
                }, function () {
                    // In this block you can do something with new state.
                });
            })
            .catch((error) => {
                alert("Không lấy được dữ liệu nhãn hàng vui lòng thử lại ! ")
            });
    }
    thongbaothem = async () =>{
        await Alert.alert (
            'Thêm Sản Phẩm',
            'Bạn Có Muốn Thêm Sản Phẩm Không ?',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Button Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this.themsanpham()},
            ]
        )
    }
    themsanpham = async () => {
        if (this.state.PickerValueNganhHang=="")
        {
            
            Alert.alert(
                'Chọn Ngành Hàng',
                'Vui Lòng Chọn Ngành Hàng cho sản phẩm',
                [
                {text: 'Ok', onPress: () => console.log('OK Button Pressed'), style: 'ok'},
                ]
            )
        }
        else if (this.state.PickerValueNhanHang=="")
        {
            Alert.alert(
                'Chọn Nhãn Hàng',
                'Vui Lòng Chọn Nhãn Hàng cho sản phẩm',
                [
                {text: 'Ok', onPress: () => console.log('OK Button Pressed'), style: 'ok'},
                ]
            )
        }
    else {
        
       await this.setState({ ActivityIndicator_Loading : true },  () =>
        {
          fetch(url+'sanpham',
            {
                method: 'POST',
                headers: 
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                {
                id_nhan_hang:this.state.PickerValueNhanHang,
                id_nganh_hang:this.state.PickerValueNganhHang,
                ten_san_pham:this.state.TxtinputTenSanPham,
                gia:this.state.TxtinputGia,
                dvt:this.state.TxtinputDVT,
                model:this.state.TxtinputMoDel,
                ma_vach:this.state.TxtinputMaVach,
                ghi_chu:this.state.TxtinputGhiChu,

                })
 
            }).then((response) => response.json()).then((responseJsonFromServer) =>
            {   
                console.log(this.state.PickerValueNhanHang)
        console.log(this.state.PickerValueNganhHang)
        console.log(this.state.TxtinputTenSanPham)
        console.log(this.state.TxtinputGia)
        console.log(this.state.TxtinputDVT)
        console.log(this.state.TxtinputMoDel)
        console.log(this.state.TxtinputMaVach)
        console.log(this.state.TxtinputGhiChu)
                console.log(responseJsonFromServer)
                if (responseJsonFromServer!=""){
                console.log(responseJsonFromServer)
                Alert.alert("Thêm sản phẩm thành công")
                this.setState({ ActivityIndicator_Loading : false });
                }
                else if(responseJsonFromServer==0) {
                Alert.alert("Thêm sản phẩm thất bại, vui lòng thử lại")
                this.setState({ ActivityIndicator_Loading : false });
                }
                // this.refs.QuanLySanPham.onRefresh()
            }).catch((error) =>
            {
                Alert.alert("Đã có lỗi xảy ra xin vui lòng thử lại !")
                this.setState({ ActivityIndicator_Loading : false});
            });
        });
    }
}
    componentDidMount() {
        this.getdataNhanHang();
        this.getdataNganhHang();

    }


    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        const { navigation } = this.props; 
        return (
            <ScrollView>
           <KeyboardAvoidingView 
           keyboardVerticalOffset={90}
           behavior="padding" 
           enabled
           style={styles.form}> 
            <View style={styles.MainContainer}>
                <Text style={styles.TxtTitle}>Nhập Sản Phẩm</Text>
                {/* /// ngành hàng */}
                <View style={styles.TxtInputContainer}>
                    <Text style={styles.textinput}>Tên Ngành Hàng:</Text>
                    <ModalSelector
                    style={{ flex:1 }}
                    accessible={true}
                    scrollViewAccessibilityLabel={'Scrollable options'}
                    cancelButtonAccessibilityLabel={'Cancel Button'}
                    data={this.state.dataNganhHang}
                    keyExtractor= {item => item.idnganhhang}
                    labelExtractor= {item => item.tennganhhang}
                    
                    initValue="Chọn Ngành Hàng"
                    onChange={(item)=>{ this.setState({PickerValueNganhHang:item.idnganhhang})}} 
                    // ref={selector => { this.selector = selector; }}
                    // customSelector={<Switch onValueChange={() => this.selector.open()} />}
                />
                    {/* <Picker
                        style={{flex:1}}
                        selectedValue={this.state.PickerValueNganhHang}

                        onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueNganhHang: itemValue })} >
                        <Picker.Item label="Chọn Ngành Hàng " value="" />
                        {this.state.dataNganhHang.map((item, key) => (
                            <Picker.Item label={item.tennganhhang} value={item.idnganhhang} key={key} />)
                        )}

                    </Picker> */}

                </View>
                {/* /// Nhãn hàng */}
                <View style={styles.TxtInputContainer}>
                    <Text style={styles.textinput}>Tên Nhãn Hàng:</Text>
                    <ModalSelector
                    style={{ flex:1 }}
                    accessible={true}
                    scrollViewAccessibilityLabel={'Scrollable options'}
                    cancelButtonAccessibilityLabel={'Cancel Button'}
                    data={this.state.dataNhanHang}
                    keyExtractor= {item => item.idnhanhang}
                    labelExtractor= {item => item.tennhanhang}
                    initValue="Chọn Nhãn Hàng"
                    onChange={(item)=>{ this.setState({PickerValueNhanHang:item.idnhanhang})}} 
                    // ref={selector => { this.selector = selector; }}
                    // customSelector={<Switch onValueChange={() => this.selector.open()} />}
                />
                    {/* <Picker
                        itemStyle={styles.textinput}
                        style={{flex:1}}
                        selectedValue={this.state.PickerValueNhanHang}
                        onValueChange={(itemValue, itemIndex) => this.setState({ PickerValueNhanHang: itemValue })} >
                        <Picker.Item label="Chọn Nhãn Hàng " value=""/>
                        {this.state.dataNhanHang.map((item, key) => (
                            <Picker.Item label={item.tennhanhang} value={item.idnhanhang} />)
                        )}

                    </Picker> */}
                </View>
                <Text style={styles.textinput}>Tên sản phẩm:</Text>
                <View style={styles.TxtInputContainer}>
                    <TextInput
                        itemStyle={styles.textinput}
                        placeholder="Nhập vào tên sản phẩm"
                        onChangeText={TxtinputTenSanPham => this.setState({ TxtinputTenSanPham })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                    />
                </View>
                <Text style={styles.textinput}>Giá Sản Phẩm:</Text>
                <View style={styles.TxtInputContainer}>
                    
                    <TextInput
                        placeholder="Nhập vào giá sản phẩm"
                        onChangeText={TxtinputGia => this.setState({ TxtinputGia })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                        keyboardType={'number-pad'}
                    />
                </View>
                <Text style={styles.textinput}>Đơn Vị Tính:</Text>
                <View style={styles.TxtInputContainer}>
              
                    <TextInput
                        placeholder="Nhập Đơn Vị Tính"
                        onChangeText={TxtinputDVT => this.setState({ TxtinputDVT })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                    />
                </View>
                <Text style={styles.textinput}>Tên Model:</Text>
                <View style={styles.TxtInputContainer}>
                  
                    <TextInput
                        placeholder="Nhập vào tên model sản phẩm"
                        onChangeText={TxtinputMoDel => this.setState({ TxtinputMoDel })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                    />
                </View>
                <Text style={styles.textinput}>Mã Vạch: </Text>
                <View style={styles.TxtInputContainer}>
                    <TextInput
                        placeholder="Nhập Mã Vạch Sản Phẩm"
                        onChangeText={TxtinputMaVach => this.setState({ TxtinputMaVach })}
                        underlineColorAndroid='transparent'
                        style={styles.TextInputStyleClass}
                        keyboardType={'number-pad'}
                    />
                </View>
                <Text style={{ textAlign: 'center', fontSize: 18 }}>Ghi Chú:</Text>
                <TextInput
                    style={{
                        height: 100,
                        margin: 10,
                        padding: 10,
                        borderColor: 'gray',
                        borderWidth: 1,
                    }}
                    placeholder="Nhập Ghi Chú Cho Sản Phẩm"
                    onChangeText={TxtinputGhiChu => this.setState({ TxtinputGhiChu })}
                    underlineColorAndroid='transparent'
                    multiline={true}
                    textAlignVertical={'top'}
                    returnKeyType={'done'}
                    onSubmitEditing={Keyboard.dismiss}
                />
                <Button
                    title="Thêm Sản Phẩm"
                    onPress={this.thongbaothem}
                    activeOpacity={0.5}
                />
        {
        this.state.ActivityIndicator_Loading ? <ActivityIndicator color='#009688' size='large'style={styles.ActivityIndicatorStyle} /> : null
        }
            </View>
            </KeyboardAvoidingView>
    </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

    MainContainer: {
        justifyContent: 'flex-start',
        flex: 1,
        margin: 10,
        marginTop: 10,
        // flexDirection: 'column',

    },
    TxtTitle: {
        textAlign: 'center',
        fontSize: 20,
        color: 'red'
    },
    TxtInputContainer: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
        alignItems:'center',
        fontSize:20,
    },

    TextInputStyleClass: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 35,
        borderWidth: 1,
        borderColor: '#FF5722',
        // Set border Radius.
        borderRadius: 10,
        textAlign: 'center',
        flex: 1,
    },
    textinput: {
        fontSize: 14,
        // flex: 0.7,
        marginTop: 12,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign:'center'
    },
    icon: {
        // flex: 1,
        marginLeft: 5,
        position: 'relative'

    },
    themsanpham: {
        borderWidth: 1,
        borderColor: 'blue'
    },
    ActivityIndicatorStyle:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
      
    },
    form: {
        // flex: 1,
        justifyContent: 'center',
      },


});