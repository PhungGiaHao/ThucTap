import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ActivityIndicator, RefreshControl, Alert, TouchableOpacity } from 'react-native';
import { Button, ListItem } from 'react-native-elements'
import axios from 'axios'
import * as ImagePicker from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import url from '../API/Api'
import * as Permissions from 'expo-permissions';

export default class ChiTietSanPham extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chitiet: [],
            anh: [],
            id_san_pham: '',
            ten_san_pham: '',
            refreshing: true,
            pickerResult: null,
            status: null
        };

    }

    static navigationOptions = () => {
        return {
            title: "Chi Tiết Sản Phẩm",
            headerStyle: {
                backgroundColor: "#0578CB",
            },
            headerTintColor: '#FFFFFF'
        }
    };

    _getChiTietSanPham = async () => {
        const ID = this.props.navigation.getParam('ID');

        await axios.all([
            axios.get(url + `sanpham/${ID}`),
            axios.get(url + `anh/anhsanpham/${ID}`)
        ]).then(axios.spread((details, imageProduct) => {
            this.setState({
                chitiet: details.data,
                id_san_pham: details.data[0].id_san_pham,
                ten_san_pham: details.data[0].ten_san_pham,
                anh: imageProduct.data,
                refreshing: false
            })

            console.log('id sp: '+this.state.id_san_pham)
        }));
    }

    getdataAnhMaVach = async () => {
        const mavach = this.props.navigation.getParam('mavach')
        return await fetch(url + `sanpham/mavach/${mavach}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    refreshing: false,
                    chitiet: responseJson,
                    anh: responseJson[0].listanhsanpham
                },
                    function () {

                    });
            })
            .catch((error) => {
                alert(`không có sản phẩm ứng với ${mavach}.Xin kiểm tra và quét lại mã`)
                // console.error(error);
            });

    }
    //TUY CHON UPLOAD
    _optionsAlert = () => {
        Alert.alert(
            'Đăng Tải Hình Sản Phẩm',
            'Chọn từ Máy Ảnh hay Thư Viện',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Hủy đăng ảnh'),
                    style: 'cancel'
                },
                {
                    text: 'Thư Viện',
                    onPress: () => { this._pickImg() }
                },
                {
                    text: 'Chụp Ảnh',
                    onPress: () => { this._luanchCamera() }
                }
            ]
        )
    }

    //CHON ANH TU THU VIEN
    _pickImg = async () => {
        const ID = this.props.navigation.getParam('ID');
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            base64: true,
            allowsEditing: false,
            aspect: [3, 4],
        });

        this.setState({
            pickerResult: `data:image/jpg;base64,${pickerResult.base64}`,
        });

        await this.postImage()

        this.onRefresh()
        console.log(this.state.anh)
        console.log("Update thành công!")

    };

    //MO MAY ANH DE CHUP ANH SAN PHAM
    _luanchCamera = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            base64: true,
            allowsEditing: false,
            aspect: [3, 4],
        });

        this.setState({
            pickerResult: `data:image/jpg;base64,${pickerResult.base64}`,
        });

     await  this.postImage()

        this.onRefresh()

        console.log("Da refresh")
    };

    //Post anh len server
    postImage = async () => {
        const ID = this.props.navigation.getParam('ID');
        
       return await fetch(`http://10.151.125.159:8081/api/restful/uploadanh?id_san_pham=${this.state.id_san_pham}&mac_dinh=1&filename=${this.state.ten_san_pham}-`, {
            method: 'POST',
            headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            },
            body: 
                this.state.pickerResult,
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    //YEU CAU QUYEN TRUY CAP VAP CAMERA VA MAY ANH
    checkMultiPermissions = async () => {
        const { status } = await Permissions.askAsync(
            Permissions.CAMERA_ROLL,
            Permissions.CAMERA
        );

        this.setState({ status })

        console.log(this.state.status)
    }

    componentWillMount() {
        this.checkMultiPermissions()
        const mavach = this.props.navigation.getParam('mavach')
        if (mavach === undefined) {
            this._getChiTietSanPham()
        }
        else if (mavach !== undefined) {
            this.getdataAnhMaVach()
        }
    }

    ListViewItemSeparator = () => {
        return (
            <View
                style={{
                    height: 0.2,
                    width: '90%',
                    backgroundColor: '#808080',
                }}
            />
        );
    };

    onRefresh() {
        this.setState({ chitiet: [], anh: [], refreshing: true });
        this._getChiTietSanPham();
    }

    render() {
        if (this.state.refreshing) {
            return (
                <View style={{ flex: 1, margin: 0, paddingTop: '70%' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#FFF'
                    }}>Vui lòng chờ...</Text>
                </View>
            );
        }
        return (
            <View style={styles.Container}>
                <View style={styles.textview}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                    >
                        {
                            this.state.chitiet.map((item) => {
                                return (
                                    <View>
                                        <ListItem
                                            leftIcon = {{name: 'call-end', size: 24, color: '#DEA985'}}
                                            title = 'TÊN SẢN PHẨM'
                                            subtitle = {item.ten_san_pham}
                                            containerStyle = {styles.textBox}
                                        />
                                        <ListItem
                                            leftIcon = {{name: 'money-off', size: 24, color: '#E38889'}}
                                            title = 'GIÁ'
                                            subtitle = {`${item.gia} VNĐ`}
                                            containerStyle = {styles.textBox}
                                        />
                                        <ListItem
                                            leftIcon = {{name: 'functions', size: 24, color: '#D9555E'}}
                                            title = 'ĐƠN VỊ TÍNH'
                                            subtitle = {item.dvt}
                                            containerStyle = {styles.textBox}
                                        />
                                        <ListItem
                                            leftIcon = {{name: 'reorder', size: 24, color: '#CA2636'}}
                                            title = 'MÃ VẠCH'
                                            subtitle = {item.ma_vach}
                                            containerStyle = {styles.textBox}
                                        />
                                        <ListItem
                                            leftIcon = {{name: 'settings-cell', size: 24, color: '#CB1A22'}}
                                            title = 'MODEL'
                                            subtitle = {item.model}
                                            containerStyle = {styles.textBox}
                                        />
                                        <ListItem
                                            leftIcon = {{name: 'sort', size: 24, color: '#DA6B2A'}}
                                            title = 'NGÀNH HÀNG'
                                            subtitle = {item.ten_nganh_hang}
                                            containerStyle = {styles.textBox}
                                        />
                                        <ListItem
                                            leftIcon = {{name: 'store-mall-directory', size: 24, color: '#F39F3F'}}
                                            title = 'NHÃN HÀNG'
                                            subtitle = {item.ten_nhan_hang}
                                            containerStyle = {styles.textBox}
                                        />
                                        <ListItem
                                            leftIcon = {{name: 'style', size: 24, color: '#DABB2D'}}
                                            title = 'GHI CHÚ'
                                            subtitle = {item.ghi_chu}
                                            containerStyle = {styles.textBox}
                                        />
                                        <ListItem
                                            leftIcon = {{name: 'terrain', size: 24, color: '#B9D869'}}
                                            title = 'HÌNH SẢN PHẨM'
                                            containerStyle = {styles.textBox}
                                        />
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            style={{ marginTop: 10, padding: 0 }}
                                        >
                                            {
                                                this.state.anh.map((item, index) => {
                                                    return (
                                                        <View key={index}>
                                                            <TouchableOpacity>
                                                                <View style={{ width: 130, height: 200, marginHorizontal: 5 }}>
                                                                    <Image source={{ uri: item.link_anh }} style={{ width: null, height: null, resizeMode: 'stretch', flex: 1 }} />
                                                                </View>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </ScrollView>
                                    </View>
                                )
                            })
                        }

                        <View style={{ flexDirection: 'row', padding: 0, margin: 0 }}>
                            <Button
                                title='  Thêm Ảnh'
                                onPress={this._optionsAlert}
                                icon={<Ionicons name='ios-attach' size={25} color='#FFF' />}
                                buttonStyle={{
                                    marginTop: 10,
                                    padding: 5,
                                    marginHorizontal: 10,
                                    borderRadius: 5,
                                    width: Dimensions.get('window').width / 3.5,
                                    backgroundColor: '#4F8E41'
                                }}
                            />
                        </View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    Container: {
        flex: 1,
        margin: 0,
        padding: 0,
        backgroundColor: '#EEE'
    },
    textview: {
        padding: 0,
        marginHorizontal: 5,
        marginTop: '1%'
    },
    title: {
        fontWeight: 'bold',
        marginLeft: 15,
        color: '#4A4A4A'
    },
    value: {
        marginVertical: 0,
        marginLeft: '2%',
        fontStyle: 'italic',
        marginBottom: 0,
        paddingBottom: 0
    },
    lineData: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 8
    },
    textBox: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        height: 60,
        marginTop: 8
    }
})
