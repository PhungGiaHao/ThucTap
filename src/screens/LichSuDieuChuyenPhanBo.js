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

export default class LichSuDieuChuyenPhanBo extends Component {
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
        chitietphieuchuyen: [],
        listsanpham: []
    },
        this.arrayholder = [];
}


getdata = async () => {
    return await fetch(url + "taophieuphanbo")
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
            // console.error(error);
            this.setState({
                loading: false,
                refreshing: false,
            })
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
//////////////////////
static navigationOptions = ({ navigation}) => ({
  title: 'Lịch Sử Điểu Chuyển Phân Bổ',
  headerTintColor: 'white',
  headerStyle: {
    backgroundColor:"#C30000",
  },
})
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
        const itemData = (item.id_th).toString() ? (item.id_th).toString().toUpperCase() : ''.toUpperCase();
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
    return await fetch(url + `taophieuphanbo/${id}`)
        .then((response) => response.json())
        .then((responseJson) => {
            this.setState({
               chitietphieuchuyen: responseJson,
                listsanpham: responseJson[0].listanhsanpham,
                loading2: false,
            }, function () {
                // In this block you can do something with new state.
                // refreshing: false,
               
            });
        })
        .catch((error) => {
            // Alert.alert("Không thể lấy dữ liệu")
            // console.error(error);
            this.setState({
                loading2: false,
            })
        });
        
}
///////////////////////////////////////
ShowChiTietPhieuXuat = async (id) => {
    this.setState({
        visible: true,
        loading2: true,
    })
  await  this.getdatachitietphieu(id);
    console.log(id)
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
////////////////////////////////////////////////////
renderchitieuphieu (){
    if((this.state.listsanpham).length==0)
    {
        return ( 
           <View>
            {/* <Text style = {{textAlign:'center',fontSize:15,color:'green'}}>Không Có Sản Phẩm Thu Hồi </Text> */}
            </View>
       )
    }
    else { 
        return (
        this.state.listsanpham.map((item,key) => {           
            return (
                <View 
                
                key = {key}
                style={{

                    borderWidth: 1,
                    borderColor: "#0074D9",
                    margin: 8,
                    borderRadius: 10
                }}>
                    
                    <Text style={styles.textmodal}>Tên Sản Phẩm :{item.ten_san_pham}  </Text>
                    <Text style={styles.textmodal}>Số Lượng: {item.so_luong}  </Text>
                    <Text style={styles.textmodal}>Đơn Vị Tính: {item.dvt}  </Text>
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
                    placeholder="Nhập Vào ID Phiếu Chuyển..."
                />
            </View>
            <FlatList
                data={this.state.dataSource}
                //data defined in constructor
                ItemSeparatorComponent={this.FlatListItemSeparator}
                //Item Separator View
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={this.ShowChiTietPhieuXuat.bind(this, item.id_th)}>
                        <View style={styles.viewinflatlist}>
                            <View >
                                <Ionicons name="ios-git-branch" size={25} color="#4F5704" style={{ paddingLeft: 10 }} />
                            </View>
                            <View style={styles.textinflatlist}>
                                <Text style={styles.text}> ID Phiếu: {item.id_th}</Text>
                                <Text style={styles.text}> Mô Tả: {item.ma_phieu}</Text>
                                <Text style={styles.text}> Tên Kho Con:  {item.ten_kho_con}</Text>
                                <Text style={styles.text}> Ngày Chuyển:  {item.ngay_thu_hoi}</Text>
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
                        Chi Tiết Phiếu Chuyển
                    </Text> 
                    <View style = {styles.ActivityIndicator_Style}>
                    <ActivityIndicator animating={this.state.loading2} 
                    
                     size="large" 
                    color="##0000ff'"
                     />
                     </View> 

                    {
                        this.state.chitietphieuchuyen.map((item,key) => {
                            return (
                                <View 
                                key ={key}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "green",
                                    margin: 8,
                                    borderRadius: 5
                                }}>
                                    <Text>  ID Thu Hồi : {item.id_th}  </Text>
                                    <Text>  Mã Phiếu Chuyển :{item.ma_phieu}  </Text>
                                    <Text>  Tên Kho Chuyển: {item.ten_kho_con}  </Text>
                                    <Text>  Tên Người Nhận: {item.ten_nguoi_giao}  </Text>
                                    <Text>  Ngày Chuyển : {item.ngay_thu_hoi}  </Text>
                                   
                                </View>
                            )

                        })
                    }
                    <Text style={{ textAlign: 'center', fontSize:18 , marginTop: 2, borderBottomWidth: 1, borderBottomColor: 'green' }} >
                        Danh Sách Sản Phẩm Đã Chuyển
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
    borderColor:'blue'
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