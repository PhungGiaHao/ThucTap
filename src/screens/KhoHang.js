import React, { Component } from "react"
import { View, StyleSheet, Dimensions, ScrollView, Image, AsyncStorage, ActivityIndicator, RefreshControl, Text } from "react-native"
import { SearchBar, ListItem } from 'react-native-elements';
import axios from 'axios'
import { TouchableOpacity } from "react-native-gesture-handler";
import { Modal, List, Button, IconButton, Colors } from 'react-native-paper'
import url from '../API/Api'

class Container extends Component {
    render() {
        return (
            <View style={styles.container}>{this.props.children}</View>
        )
    }
}

class KhoHangContainer extends Component { 
    render() {
        return (
            <View style={styles.khohang}>{this.props.children}</View>
        )
    }
}

class TopBar extends Component {
    render() {
        return (
            <View style={styles.topbar}>{this.props.children}</View>
        )
    }
}

class ListKho extends Component {
    render() {
        return (
            <View style={styles.listitem}>{this.props.children}</View>
        )
    }
}

export default class KhoHang extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,         
            error: null,
            text: '',
            dskho: [],
            refreshing: true,
            visible: false,
            expanded: true,

            ten_sp: '',
            gia: '',
            ton_kho: '',
            dvt: '',
            tong_nhap: '',
            tong_xuat: '',
            anh: [],
            phan_loai: [],
            nhap_hang: [],
            xuat_hang: []
        }

        this.arrayholder = [];
    }

    componentDidMount() {
        this._getData()
    }

    //THANH HEADER
    static navigationOptions = ( {navigation} ) => {
        return {
            title: navigation.getParam('TEN'),
            headerStyle: {
              backgroundColor: navigation.getParam('COLOR'),
            },
            headerTintColor: '#FFFFFF'
          }
    };

    //TÌM KIẾM SẢN PHẨM THEO TÊN SẢN PHẨM
    searchFilterFunction = text => { 
        this.setState({
            text: text
        })   
        const newData = this.arrayholder.filter(item => {      
          const itemData = item.tensanpham.toUpperCase()
          
           const textData = text.toUpperCase();
            
           return itemData.indexOf(textData) > -1;    
        });
        
        this.setState({ dskho: newData });  
    };

    //LẤY DỮ LIỆU TỪ SERVER
    _getData = async () => {
        this.setState({ loading: true });

        const id_user = await AsyncStorage.getItem('ID')

        await axios.all([
            axios.get(`${url}khohangsanpham/${id_user}`),
        ]).then(axios.spread((details) => {
            this.setState({
                dskho: details.data,         
                loading: false,
                refreshing: false     
            })

            this.arrayholder = details.data;

            console.log(this.arrayholder)
        }));
    }

    //HIỂN THỊ CHI TIẾT SẢN PHẨM KHO
    showModal = async(ID_KhoSP, ID_SP) => {
        await axios.get(`${url}sanphamkho/${ID_KhoSP}/${ID_SP}`)
        .then(res => {
            this.setState({
                ten_sp: res.data[0].tenSanPham,
                gia: res.data[0].giaNhap,
                ton_kho: res.data[0].tonKho,
                dvt: res.data[0].dvt,
                tong_nhap: res.data[0].tongSoLuongDaNhap,
                tong_xuat: res.data[0].tongSoLuongDaXuat,
                anh: res.data[0].linkAnh,
                phan_loai: res.data[0].phanLoai,
                nhap_hang: res.data[0].nhapHang,
                xuat_hang: res.data[0].xuatHang,
                visible: true    
            })

            console.log('Ten SP: '+this.state.ten_sp)
        })
    }

    //ĐÓNG
    hideModal = () => {
        this.setState({
            visible: false
        })
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
        this.setState({ dskho: [], refreshing: true });
        this._getData();
    }

    render() {
        if (this.state.refreshing) {
            return (
              <View style={{ flex: 1, margin: 0, paddingTop: '70%' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{textAlign: 'center', color: '#335A9D'}}>Vui lòng chờ...</Text>
              </View>
            );
        }
        return (
            <Container>
                <KhoHangContainer>
                    {/* Thanh tim kiem*/}
                    <TopBar>
                        <SearchBar
                            searchIcon
                            containerStyle={styles.searchbar}
                            placeholder='Nhập từ khóa...'
                            round
                            lightTheme
                            autoCorrect={false}
                            onChangeText={text => this.searchFilterFunction(text)}
                            value={this.state.text}
                        />
                    </TopBar>

                    {/* Danh sach cac kho */}
                    <ListKho>
                        {/* Danh sach cac Kho da ton tai */}
                        <ScrollView style = {{padding: 0, margin: 0}}
                            ItemSeparatorComponent = { this.ListViewItemSeparator }
                            showsVerticalScrollIndicator = {false}
                            refreshControl = {
                                <RefreshControl
                                  refreshing = {this.state.refreshing}
                                  onRefresh={this.onRefresh.bind(this)}
                                />
                            }
                        >
                        {
                            this.state.dskho.map((item, index) => {
                                return(
                                    <TouchableOpacity onPress={this.showModal.bind(this, item.idkhosanpham, item.idsanpham)}>
                                        <ListItem
                                            linearGradientProps={{
                                                colors: ['#EEE', '#F8ECF3'],
                                                start: [1, 0],
                                                end: [0.2, 0],
                                            }}
                                            key = {index}
                                            containerStyle = { styles.danhsachkho }
                                            leftAvatar = {{rounded: false, width: 55, height: 65, source: {uri: item.linkanh}}}
                                            rightIcon = {{ name: 'chevron-right', color: '#2E3F59', size: 20 }}
                                            title = {item.tensanpham}
                                            subtitle = {
                                                <View>
                                                    <Text style = {{color: '#696969'}}>Tồn kho: {item.soluong}</Text>
                                                    <Text style = {{color: '#696969'}}>Ngày sản xuất: {item.ngaysanxuat}</Text>
                                                </View>
                                            }
                                        />
                                    </TouchableOpacity>
                                )
                            })
                        }
                        </ScrollView>
                    </ListKho>

                    {/*Chi tiết sản phẩm kho*/}
                    <Modal
                        onDismiss={this.hideModal}
                        visible = {this.state.visible}
                        contentContainerStyle = {{
                            alignItems: 'center'
                        }}
                    >
                        <View style = {{
                            width: Dimensions.get('window').width * .85,
                            height: Dimensions.get('window').height * .8,
                            backgroundColor: '#EAEAEA',
                            borderRadius: 5
                        }}>
                            {/*Nut Đóng*/}
                            <IconButton
                                icon = "close"
                                color = {Colors.red500}
                                size = {25}
                                accessibilityHint = 'Đóng'
                                onPress={() => this.hideModal()}
                            />
                            <ScrollView showsVerticalScrollIndicator = { false }>
                                {/*Hình sản phẩm*/}
                                <View
                                    style = {{
                                        height: 70,
                                        width: '100%',
                                        backgroundColor: '#F5F5F5',
                                        justifyContent: 'center',
                                        flexDirection: 'row',
                                        alignItems: 'center', borderRadius: 5
                                    }}
                                >
                                    {/**List ảnh */}
                                    <ScrollView horizontal = { true } style = {{marginLeft: 10}}>
                                    {
                                        this.state.anh.map(item => {
                                            return(
                                                <TouchableOpacity>
                                                    <Image
                                                        source = {{ uri: item.link_anh }}
                                                        style={{ width: 60, height: 70, resizeMode: 'center', borderRadius: 3, marginLeft: 3 }}
                                                        placeholder = {<ActivityIndicator />} />
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                    </ScrollView>
                                
                                </View>
                                
                                {/*Thông tin sản phẩm*/}
                                <View
                                    style = {{
                                        marginTop: 10,
                                        borderTopWidth: .5,
                                        borderBottomWidth: .6,
                                        borderColor: '#EAEAEA'
                                    }}
                                >
                                    <ListItem
                                        containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                        title = 'Tên sản phẩm'
                                        titleStyle = {{color: '#A6A6A6'}}
                                        subtitle = {this.state.ten_sp}
                                        subtitleStyle = {{color: '#696969'}}
                                    />
                                    
                                    <ListItem
                                        containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                        title = 'Giá bán lẻ'
                                        titleStyle = {{color: '#A6A6A6'}}
                                        subtitle = {`${this.state.gia} VNĐ`}
                                        subtitleStyle = {{color: '#696969'}}
                                    />
                                </View>

                                {/*Số lượng sản phẩm trong kho*/}
                                <View
                                    style = {{
                                        marginTop: 10,
                                        borderTopWidth: .6,
                                        borderBottomWidth: .5,
                                        borderColor: '#EAEAEA'
                                    }}
                                >
                                    <ListItem
                                        containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                        title = 'Tồn kho'
                                        titleStyle = {{color: '#A6A6A6'}}
                                        subtitle = {`${this.state.ton_kho} ${this.state.dvt}`}
                                        subtitleStyle = {{color: '#696969'}}
                                    />

                                    <ListItem
                                        containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                        title = 'Tổng số lượng đã nhập'
                                        titleStyle = {{color: '#A6A6A6'}}
                                        subtitle = {this.state.tong_nhap}
                                        subtitleStyle = {{color: '#696969'}}
                                    />

                                    <ListItem
                                        containerStyle = {{backgroundColor: '#F5F5F5', padding: 7}}
                                        title = 'Tổng số lượng đã xuất'
                                        titleStyle = {{color: '#A6A6A6'}}
                                        subtitle = {this.state.tong_xuat}
                                        subtitleStyle = {{color: '#696969'}}
                                    />
                                </View>
                                
                                {/*Phân loại sản phẩm*/}
                                {
                                    this.state.phan_loai.map(item => {
                                        return(
                                            <List.Accordion
                                                style = {{maxHeight: 47, padding: 0, margin: 0}}
                                                title="Phân loại"
                                                titleStyle = {{color: '#A6A6A6'}}
                                                description = "Ngành hàng, thương hiệu..."
                                                descriptionStyle = {{color: '#696969'}}
                                                left={props => <List.Icon {...props} icon="folder-open" size = {15} />}
                                            >
                                                <List.Item
                                                    title = "Ngành hàng"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {item.tenNganhHang}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                                <List.Item
                                                    title = "Thương hiệu"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {item.tenNhanHang}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                            </List.Accordion>
                                        )
                                    })
                                }
                                

                                {/*Tình trạng nhập hàng */}
                                {
                                    this.state.nhap_hang.map(item => {
                                        return(
                                            <List.Accordion
                                                style = {{maxHeight: 47, padding: 0, margin: 0}}
                                                title="Nhập hàng"
                                                titleStyle = {{color: '#A6A6A6'}}
                                                description = "Ngày nhập, Nhà cung cấp..."
                                                descriptionStyle = {{color: '#696969'}}
                                                left={props => <List.Icon {...props} icon="file-download" size = {15} />}
                                            >
                                                <List.Item
                                                    title = "Lần nhập gần nhất"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {item.lanNhapGanNhat}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                                <List.Item
                                                    title = "Nhà CC"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {item.tenNCC}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                                <List.Item
                                                    title = "Số lượng nhập"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {`${item.soLuongNhap}`}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                                <List.Item
                                                    title = "Tiền hàng"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {`${item.tienHang} VNĐ`}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                            </List.Accordion>
                                        )
                                    })
                                }
                               
                                {/*Tình trạng xuất hàng*/}
                                {
                                    this.state.xuat_hang.map(item => {
                                        return(
                                            <List.Accordion
                                                style = {{maxHeight: 47, padding: 0, marginBottom: 5}}
                                                title="Xuất hàng"
                                                titleStyle = {{color: '#A6A6A6'}}
                                                description = "Ngày xuất, nơi đến..."
                                                descriptionStyle = {{color: '#696969'}}
                                                left={props => <List.Icon {...props} icon="file-upload" size = {15} />}
                                            >
                                                <List.Item
                                                    title = "Lần xuất gần nhất"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {item.lanXuatGanNhat}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                                <List.Item
                                                    title = "Tên Khách hàng"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {item.tenKhachHang}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                                <List.Item
                                                    title = "Số lượng"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {`${item.soLuong}`}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                                <List.Item
                                                    title = "Tiền xuất"
                                                    titleStyle = {{color: '#A6A6A6'}}
                                                    description = {`${item.tienXuat} VNĐ`}
                                                    descriptionStyle = {{color: '#696969'}}
                                                />
                                            </List.Accordion>
                                        )
                                    })
                                }
                            </ScrollView>
                        </View>
                    </Modal>
                </KhoHangContainer>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 0,
        padding: 0,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: Dimensions.get('window').height
    },
    khohang: {
        flex: 1
    },
    topbar: {
        margin: 0,
        padding: 0,
        flex: 1,
        flexDirection: 'row',
        width: Dimensions.get('window').width
    },
    searchbar: {
        width: Dimensions.get('window').width,
        justifyContent: 'center'
    },
    listitem: {
        margin: 0,
        padding: 0,
        flex: 9,
        width: Dimensions.get('window').width
    },
    danhsachkho: {
        marginHorizontal: '3%',
        marginTop: '2%',
        borderRadius: 5,
        borderColor: '#EEE',
        shadowOpacity: 1,
        shadowColor: '#EEE',
        shadowRadius: 5,
        shadowOffset: { width: 2, height: -2 }
    }
})