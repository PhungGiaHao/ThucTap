import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements'
import { Modal, List, IconButton, Colors } from 'react-native-paper'
import axios from 'axios'
import url from '../API/Api'

export default class NhapHang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lichsunhap: [],
            chitiet: [],
            listsanpham: [],
            refreshing: true,
            loading: false,
            visible: false,
            expanded: false
        };
    }

    static navigationOptions = ( {navigation} ) => {
        return {
            title: navigation.getParam('TEN'),
            headerStyle: {
            backgroundColor: navigation.getParam('COLOR'),
            },
            headerTintColor: '#FFFFFF'
        }
    };

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
        this.setState({ lichsunhap: [], refreshing: true });
        this.getData();
    }

    getData = async() => {
        await axios.get(url+`taophieunhap`)
            .then(res => {
                this.setState({
                    lichsunhap: res.data,
                    refreshing: false,
                })
            })

        console.log(this.state.lichsunhap)
    }

    hideModal = () => {
        this.setState({
            chitiet: [],
            listsanpham: [],
            visible: false
        })

        console.log(this.state.chitiet)
    }

    showModal = async(ID) => {
        await axios.get(`${url}taophieunhap/${ID}`)
            .then(res => {
                this.setState({
                    chitiet: res.data,
                    listsanpham: res.data[0].listchitietnhap,
                    visible: true
                })
            })

            console.log(this.state.chitiet)
        
    }

    componentDidMount = async() => {
        this.getData()
    }

    onRefresh() {
        this.setState({ chitiet: [], listsanpham: [], refreshing: true });
        this.getData();
    }

    render() {
        if (this.state.refreshing) {
            return (
              <View style={{ flex: 1, margin: 0, paddingTop: '70%' }}>
                <ActivityIndicator size="large" color="#D18F2C" />
                <Text style = {{textAlign: 'center', color: '#D18F2C'}}>Đang lấy dữ liệu...</Text>
              </View>
            );
        }
        return (
            <View style = {{ backgroundColor: '#E4E4E4', height: '100%'}}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                >
                {
                    this.state.lichsunhap.map((item, index) => {
                        return(
                            <TouchableOpacity onPress = {this.showModal.bind(this, item.id_phieu_nhap)}>
                                <List.Item
                                    title={`Mã PN: ${item.ma_phieu_nhap}`}
                                    description={`Ngày nhập: ${item.ngay_nhap}`}
                                    left={() => <List.Icon icon="assignment-returned" color='#FEAD30'/>}
                                    style={styles.lichsunhap}
                                />
                            </TouchableOpacity>
                        )
                    })
                }
                </ScrollView>

                <Modal
                    onDismiss={this.hideModal}
                    visible = {this.state.visible}
                    contentContainerStyle = {{
                        alignItems: 'center'
                    }}
                >
                <View style = {{
                    width: Dimensions.get('window').width -50,
                    height: Dimensions.get('window').height - 120,
                    backgroundColor: '#EAEAEA'
                }}>
                    <IconButton
                        icon = "close"
                        color = {Colors.red500}
                        size = {25}
                        accessibilityHint = 'Đóng'
                        onPress={() => this.hideModal()}
                    />
                    <ScrollView>
                        {/*Chi tiết kho*/}
                        {
                            this.state.chitiet.map((item) => {
                                return(
                                    <View
                                    style = {{
                                        borderTopWidth: .5,
                                        borderBottomWidth: .6,
                                        borderColor: '#EAEAEA'
                                    }}
                                    >  
                                        <ListItem
                                            containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                            title = "Ngày nhập"
                                            titleStyle = {{color: '#A6A6A6'}}
                                            subtitle = {item.ngay_nhap}
                                            subtitleStyle = {{color: '#696969'}}
                                        />
                                        <ListItem
                                            containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                            title = "Nhà cung cấp"
                                            titleStyle = {{color: '#A6A6A6'}}
                                            subtitle = {item.ten_ncc}
                                            subtitleStyle = {{color: '#696969'}}
                                        />
                                        <ListItem
                                            containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                            title = "Tên người nhập"
                                            titleStyle = {{color: '#A6A6A6'}}
                                            subtitle = {item.ten_nguoi_nhap}
                                            subtitleStyle = {{color: '#696969'}}
                                        />
                                        <ListItem
                                            containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                            title = "Kho nhập"
                                            titleStyle = {{color: '#A6A6A6'}}
                                            subtitle = {item.ten_kho}
                                            subtitleStyle = {{color: '#696969'}}
                                        />
                                        <ListItem
                                            containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                            title = "Địa chỉ"
                                            titleStyle = {{color: '#A6A6A6'}}
                                            subtitle = {item.dia_chi}
                                            subtitleStyle = {{color: '#696969'}}
                                        />
                                        <ListItem
                                            containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                            title = "Số điện thoại"
                                            titleStyle = {{color: '#A6A6A6'}}
                                            subtitle = {item.sdt}
                                            subtitleStyle = {{color: '#696969'}}
                                        />
                                    </View>
                                )
                            })
                        }
                        <View
                            style = {{
                                marginTop: 10
                            }}
                        >
                        <List.Accordion
                            title="Danh sách sản phẩm"
                            expanded={true}
                            titleStyle={{
                                color: '#FEAD30'
                            }}
                        >
                            {
                                this.state.listsanpham.map((item) => {
                                    return(
                                        <ListItem
                                            leftIcon = {{name: 'chevron-right', color: '#2E3F59', size: 20}}
                                            title = {`Sản phẩm: ${item.ten_san_pham}`}
                                            subtitle = {
                                                <View style = {{
                                                    marginLeft: 15
                                                }}>
                                                    <Text style = {{color: '#696969'}}>Số lượng: {item.so_luong}</Text>
                                                    <Text style = {{color: '#696969'}}>Đơn giá: {item.don_gia}</Text>
                                                    <Text style = {{color: '#696969'}}>Ngày SX: {item.ngay_san_xuat}</Text>
                                                    <Text style = {{color: '#696969'}}>Hạn SD: {item.han_su_dung}</Text>
                                                </View>
                                            }
                                            containerStyle = {{
                                                borderBottomWidth: 0.5,
                                                borderEndWidth: 0
                                            }}
                                        />
                                    )
                                })
                            }
                            
                        </List.Accordion>
                        </View>
                    </ScrollView>
                </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    lichsunhap: {
        marginTop: 7,
        marginHorizontal: 7,
        borderRadius: 25,
        backgroundColor: '#FFF',
        padding: 0
    }
})
