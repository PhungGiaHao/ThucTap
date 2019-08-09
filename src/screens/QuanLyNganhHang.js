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
import { Ionicons, AntDesign, FontAwesome } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import ModalThemNganhHang from '../Modal/ModalQuanLyNganhHang/ModalThemNganhHang';
import ModalSuaNganhHang from '../Modal/ModalQuanLyNganhHang/ModalSuaNganhHang';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import url from '../API/Api'

export default class QuanLyNganhHang extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      text: '',
      refreshing: true,
    },
      this.arrayholder = [];
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
  getdata = async ()=> {
      return  await fetch(url+'nganhhang')
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
       
        // console.error(error);
        Alert.alert("Không lấy được dữ liệu nghành hàng")
        this.setState ({
          loading: false,
          refreshing: false,
        })
      
      });

  }

  //////////////////////////////////
  onRefresh() {
    //Clear old data of the list
    this.setState({ dataSource: [] });
    //Call the Service to get the latest data
    this.getdata();
  }

  //////////////////////////////////////////
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          margin:10,
          height: 0.5,
          width: "100%",
          backgroundColor: "#000",
          borderWidth: 1,
        }}
      />
    );
  }
  //////////////////////////////////////
  ListEmptyView = () => {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ textAlign: 'center', flex: 1, justifyContent: 'center', alignItems: 'center' }}> Không Có Dữ Liệu</Text>
      </View>

    );
  }
  ////
  /////////////////////////////
  componentDidMount() {
    this.getdata();
   
  }
  ///////////////////////////////////// 
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.tennganhhang ? item.tennganhhang.toUpperCase() : ''.toUpperCase();
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



  ////////////////////////////////////
  // ShowModalThem = () => {
  //   this.refs.ModalThemNganhHang.showModalThemNganhHang();
  // }
  // ShowModalSua = (item) => {
  //   this.refs.ModalSuaNganhHang.showModalSuaNganhHang(item);
  //   // Alert.alert(item.tennganhhang)
  // }
  //////////////////////////////////
  render_FlatList_footer = () => {

    var footer_View = (

      <View style={styles.header_footer_style}>
        <TextInput
          style={styles.TextInputSearch}
          onChangeText={(text) => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder="Search Here"
        />
        {/* <TouchableOpacity style={styles.iconthem}
          onPress={this.ShowModalThem}
        >
          <Ionicons name="ios-add-circle-outline" size={30} color="black" />
        </TouchableOpacity> */}
      </View>
    );
    return footer_View;

  };
  //////////////////////////////////////
  XuongDuoiCung = () => {
    this.ListNganhHang.scrollToEnd({ animated: true });
  }
  ////////////////////////xóa ngành hàng
// XoaNganhHang = (item) => {
// alert(item.idnganhhang)
// }
  ///////////////////////////////////
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.ActivityIndicator_Style}>
          <ActivityIndicator size="large" />
          <Text style = {{color: '#2C9B9B'}}>Đang lấy dữ liệu...</Text>
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
          placeholder="Tìm kiếm theo tên ngành hàng"
        />
      </View>
      <View style={styles.flatlistview}> 
        <FlatList
          extraData={this.state}
          ref={(ref) => { this.ListNganhHang = ref; }}
          data={this.state.dataSource}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) =>
            <View style={styles.FlatListContainer}>
              <View style={styles.flatlist}>
                <Text style={styles.textinFlatList}> {item.idnganhhang}.{item.tennganhhang}</Text>
              </View>
              {/* <View style={styles.viewFunction}>
                <TouchableOpacity
                onPress={this.XoaNganhHang.bind(this,item)}
                >
                  <Text style={styles.TextFunction} >
                    <AntDesign name="delete" size={15} color="red" />
                    Xóa Ngành Hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.ShowModalSua.bind(this, item)}>
                  <Text style={styles.TextFunction}>
                    <FontAwesome name="edit" size={15} color="black" />
                    Sửa Ngành Hàng</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          }
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
            />
          }
          enableEmptySections={true}
          // ListHeaderComponent={this.render_FlatList_footer}
          ListEmptyComponent={this.ListEmptyView}
          keyExtractor={(item, index) => index.toString()}
        />
       
        {/* <ModalThemNganhHang ref={'ModalThemNganhHang'} >
        </ModalThemNganhHang>
        <ModalSuaNganhHang ref={'ModalSuaNganhHang'} >
        </ModalSuaNganhHang> */}
        </View>
        <View style={styles.TouchableOpacityStyle}>
          <TouchableOpacity onPress={this.themsanpham}>
            <Ionicons name="ios-add-circle-outline" size={50} color="#0000ff" />
          </TouchableOpacity>
        </View>
      </View>

    );
  }

}

const styles = StyleSheet.create({

  MainContainer: {
    margin: 7,
    justifyContent: 'center',
    flex: 1,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
    // flexDirection:'column'
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 30,
  },
  ActivityIndicator_Style: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  FlatListContainer: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textinFlatList: {
    fontSize: 18,
    padding: 10,
  },
  TextFunction: {
    textAlign: 'center',
    fontSize: 15,
  },
  viewFunction: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  flatlist: {
    flex: 1,
    margin: 10,
  },
  header_footer_style: {
    flexDirection: 'row'
  },
  TextInputSearch: {
    flex: 4,
    textAlign: 'center',
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#009688',
    borderRadius: 15,
    backgroundColor: "#FFFFFF"
  },
  iconthem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flatlistview :{
    flex:1,
  }
});
