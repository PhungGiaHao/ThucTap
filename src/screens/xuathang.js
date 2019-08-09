import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Alert,
    Platform,
    TextInput,
    RefreshControl,
    Dimensions
} from 'react-native'
import url from '../API/Api'
import { Ionicons } from '@expo/vector-icons';
import { Modal, List, IconButton, Colors ,Provider,Portal} from 'react-native-paper'
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
export default class xuathang extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loading2: true,
            dataSource: [],
            text: '',
            refreshing: true,
            visible: false,
            idphieu: "",
            chitietphieuxuat: [],
            listsanpham: []
        },
            this.arrayholder = [];
    }
    getdata = async () => {
        return await fetch(url + "taophieuxuat")
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loading: false,
                    dataSource: responseJson,
                    refreshing: false,

                }, function () {
                    // In this block you can do something with new state.
                    // refreshing: false,
                    this.arrayholder = responseJson;
                });
            })
            .catch((error) => {
                Alert.alert("Không thể lấy dữ liệu")
                this.setState({
                    loading: false,
                    refreshing: false,
                })
                // console.error(error);
            });
    }
    componentDidMount() {
        this.getdata();
    }
    hideModal = () => {
        this.setState({
            visible: false,
            listsanpham: [],
            chitietphieuxuat: [],
        })

        console.log(this.state.chitiet)
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
    onRefresh() {
        this.setState({
            loading: true,
            dataSource: [],
        });
        this.getdata();
    }
    //////////////////////////////
    ListEmptyView = () => {
        return (
            <View style={styles.MainContainer}>
                <Text style={{ textAlign: 'center', flex: 1, justifyContent: 'center', alignItems: 'center' }}> Không Có Phiếu </Text>
            </View>

        );
    }
    //////////////////////////////////////////////////
    SearchFilterFunction(text) {
        //passing the inserted text in textinput
        const newData = this.arrayholder.filter(function (item) {
            //applying filter for the inserted text in search bar
            const itemData = (item.id_phieu_xuat).toString() ? (item.id_phieu_xuat).toString().toUpperCase() : ''.toUpperCase();
            const textData = text.toUpperCase();
            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            //setting the filtered newData on datasource
            //After setting the data it will automatically re-render the view
            dataSource: newData,
            text: text,
        });
    }
    /////////////////////////////////////////
    getdatachitietphieu = async (id) => {
        return await fetch(url + `taophieuxuat/${id}`)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    chitietphieuxuat: responseJson,
                    listsanpham: responseJson[0].listchitietnhap,
                    loading2: false,
                }, function () {
                    // In this block you can do something with new state.
                    // refreshing: false,
                    this.arrayholder = responseJson;
                });
            })
            .catch((error) => {
                Alert.alert("Không thể lấy dữ liệu")
                // console.error(error);
                
            });
            
    }
    ///////////////////////////////////////
    ShowChiTietPhieuXuat = async (id) => {
        this.setState({
            visible: true,
            loading2: true,
        })
      await  this.getdatachitietphieu(id);
        console.log((this.state.listsanpham).length)
    }
    //   FlatListItemSeparator = () => {
    //     return (
    //       <View
    //         style={{
    //           margin: 5,
    //           height: 0.5,
    //           width: "100%",
    //           backgroundColor: 'red',
    //           borderWidth: 1,
    //           flexDirection: 'row',
    //         }}
    //       />
    //     );
    //   } ///////////////////////////
    renderchitieuphieu (){
        if((this.state.listsanpham).length==0)
        {
            return (
               <View></View>
           )
        }
        else { 
            return (
            this.state.listsanpham.map((item) => {           
                return (
                    <View style={{
                        borderWidth: 1,
                        borderColor: "#0074D9",
                        margin: 8,
                        borderRadius: 10
                    }}>
                        <Text style={styles.textmodal}>ID Sản Phẩm : {item.id_san_pham}  </Text>
                        <Text style={styles.textmodal}>Tên Sản Phẩm :{item.ten_san_pham}  </Text>
                        <Text style={styles.textmodal}>Mã Vạch: {item.ma_vach}  </Text>
                        <Text style={styles.textmodal}>Số Lượng: {item.so_luong}  </Text>
                        <Text style={styles.textmodal}>Tên Người Nhận: {item.dvt}  </Text>
                        <Text style={styles.textmodal}>Ngày Xuất : {item.ngay_san_xuat}  </Text>
                        <Text style={styles.textmodal}>Ngày Xuất : {item.han_su_dung}  </Text>
                        <Text style={styles.textmodal}>Ghi Chú : {item.ghi_chus}  </Text>
                    </View>
                )
            
            })
         )
     }
    }
    ////////////////////////////
    render() {
        if (this.state.loading) {
            return (
                <View style={styles.ActivityIndicator_Style}>
                    <ActivityIndicator size="large" />
                </View>
            )
        }
        return (
            <View style={styles.MainContainer}>
                <View style={styles.header_footer_style}>
                    <TextInput
                        style={styles.TextInputSearch}
                        onChangeText={(text) => this.SearchFilterFunction(text)}
                        value={this.state.text}
                        underlineColorAndroid='transparent'
                        placeholder="Nhập ID Phiếu Xuất..."
                    />
                </View>
                <FlatList
                    data={this.state.dataSource}
                    //data defined in constructor
                    ItemSeparatorComponent={this.FlatListItemSeparator}
                    //Item Separator View
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={this.ShowChiTietPhieuXuat.bind(this, item.id_phieu_xuat)}>
                            <View style={styles.viewinflatlist}>

                                <View >
                                    <Ionicons name="ios-log-out" size={28} color={item.background} color="red" style={{ paddingLeft: 10 }} />
                                </View>
                                <View style={styles.textinflatlist}>
                                    <Text style={styles.text}> ID Phiêu Xuất: {item.id_phieu_xuat}</Text>
                                    <Text style={styles.text}> Mô Tả: {item.ma_phieu_xuat}</Text>
                                    <Text style={styles.text}> Tên Người Xuất:  {item.ten_nguoi_xuat}</Text>
                                    <Text style={styles.text}> Tên Người Nhận:  {item.ten_nguoi_nhan}</Text>
                                    <Text style={styles.text}> Ngày Xuất:  {item.ngay_xuat}</Text>
                                    <Text style={styles.text}> Ghi Chú:  {item.ghi_chu}</Text>
                                </View>

                            </View>
                        </TouchableOpacity>
                    )}
                    refreshControl={
                        <RefreshControl
                            //refresh control used for the Pull to Refresh
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />
                    }
                    ListEmptyComponent={this.ListEmptyView}
                    keyExtractor={(item, index) => index.toString()}
                    FlatListItemSeparator={this.FlatListItemSeparator}
                />
                 <Provider>
                    <Portal>
                <Modal 
                    animationType="slide"
                    onDismiss={this.hideModal}
                    visible={this.state.visible}
                    contentContainerStyle={{
                        alignItems: 'center',
                        borderRadius: 1,
                    }}
                > 
               
                    <View style={{
                        width: Dimensions.get('window').width - 50,
                        height: Dimensions.get('window').height - 120,
                        backgroundColor: '#EAEAEA' ,
                        borderRadius:10
                    }} >
                        <TouchableOpacity 
                        onPress = {this.hideModal.bind(this)}>
                        <View style={{ justifyContent:'flex-end', alignItems:'flex-end', margin:3}}>
                          <Ionicons name="md-close" size={40} color="red" />
                          </View>
                        </TouchableOpacity>     
                        <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 2, borderBottomWidth: 1, borderBottomColor: 'green' }} >
                            Chi Tiết Phiếu Xuất
                        </Text> 
                        <View style = {styles.ActivityIndicator_Style}>
                        <ActivityIndicator animating={this.state.loading2} 
                        
                         size="large" 
                        color="##0000ff'"
                         />
                         </View> 

                        {
                            this.state.chitietphieuxuat.map((item) => {
                                return (
                                    <View style={{
                                        borderWidth: 1,
                                        borderColor: "green",
                                        margin: 8,
                                        borderRadius: 5
                                    }}>
                                        <Text>  ID Phiếu Xuất : {item.id_phieu_xuat}  </Text>
                                        <Text>  Mô Tả :{item.ma_phieu_xuat}  </Text>
                                        <Text>  Tên Người Xuất: {item.ten_nguoi_xuat}  </Text>
                                        <Text>  Tên Người Nhận: {item.ten_nguoi_nhan}  </Text>
                                        <Text>  Ngày Xuất : {item.ngay_xuat}  </Text>
                                        <Text>  Ghi Chú : {item.ghi_chu}  </Text>
                                    </View>
                                )

                            })
                        }
                        <Text style={{ textAlign: 'center', fontSize:18 , marginTop: 2, borderBottomWidth: 1, borderBottomColor: 'green' }} >
                            Danh Sách Sản Phẩm Đã Xuất
                        </Text> 
                        <ScrollView>
                            {this.renderchitieuphieu()}
                        </ScrollView>
                    </View>
                </Modal>
                </Portal>
                </Provider>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        flex: 1,
    },

    item: {
        fontSize: 20,
    },
    viewinflatlist: {
        margin: 5,
        alignItems: 'center',
        textAlign: 'center',
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 10,
    },
    textinflatlist: {
        marginLeft:3,
        flexDirection: 'column',
        
        // borderWidth:1,
        // borderRadius: 5,

        // borderWidth: 1,
        flex: 1,
    },
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
    header_footer_style: {
        flexDirection: 'row'
    },
    TextInputSearch: {
        flex: 1,
        textAlign: 'center',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#009688',
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        marginTop: 5,
    },
    header_footer_style: {
        flexDirection: 'row'
    },
    textmodal : {
        fontWeight:'bold',
        fontSize:12,
        color : "black",
        paddingLeft:5,
    },
    textload : {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    }
});