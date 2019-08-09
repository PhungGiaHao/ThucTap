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
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import ModalSuaNhanHang from '../Modal/ModalQuanLyNhanHang/ModalSuaNhanHang';
import ModalThemNhanHang from '../Modal/ModalQuanLyNhanHang/ModalThemNhanHang';
import url from '../API/Api'
export default class QuanLyNhanHang extends Component {
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
      headerTintColor: '#FFFFFF',
    }
  };///////
  getdata= async ()  => {
    return await fetch(url+'nhanhang')
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
        Alert.alert("Không lấy được dữ liệu nhãn hàng")
        this.setState ({
          loading: false,
          refreshing: false,
        })
      });

  }
  //////////////////////////////////////////
  ////Sửa Nhãn Hàng 

  //////////////////////////////////////////
  ////Xóa Nhãn Hàng

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
          margin:5,
          height: 0.5,
          width: "100%",
          backgroundColor: 'red',
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
  /////////////////////////////
  componentDidMount() {
    this.getdata();
  }
  ///////////////////////////////////// 
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.tennhanhang ? item.tennhanhang.toUpperCase() : ''.toUpperCase();
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
  ShowModalThem = () => {
    this.refs.ModalThemNhanHang.showModalThemNhanHang();
  }
  ShowModalSua = (item) => {
    this.refs.ModalSuaNhanHang.showModalSuaNhanHang(item);
    // Alert.alert(item.tennhanhang)
  }
  //////////////////////////////////
  //////////////////////////////////////
  XuongDuoiCung = () => {
    this.ListNhanHang.scrollToEnd({ animated: true });
  }

  ///////////////////////////////////
  render() {
    if (this.state.loading) {
      return (
        <View style={styles.ActivityIndicator_Style}>
          <ActivityIndicator size="large" />
        </View>
      )
    }
    //////////////////////////////////////////
    return (

      <View style={styles.MainContainer}>
          <View style={styles.header_footer_style}>
        <TextInput
          style={styles.TextInputSearch}
          onChangeText={(text) => this.SearchFilterFunction(text)}
          value={this.state.text}
          underlineColorAndroid='transparent'
          placeholder="Tìm kiếm theo tên Nghành Hàng"
        />
      </View>
         <View style={styles.flatlistview}>
        <FlatList
          extraData={this.state}
          ref={(ref) => { this.ListNhanHang = ref; }}
          data={this.state.dataSource}
          ItemSeparatorComponent={this.FlatListItemSeparator}
          renderItem={({ item }) =>
            <View style={styles.FlatListContainer}>
              <View style={styles.flatlist}>
                <Text style={styles.textinFlatList}>{item.idnhanhang}.{item.tennhanhang}</Text>
              </View>
              {/* <View style={styles.viewFunction}>
                <TouchableOpacity>
                  <Text style={styles.TextFunction} >
                    <AntDesign name="delete" size={15} color="red" />
                    Xóa Nhãn Hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.ShowModalSua.bind(this, item)}>
                  <Text style={styles.TextFunction}>
                    <FontAwesome name="edit" size={15} color="black" />
                    Sửa Nhãn Hàng</Text>
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
          ListEmptyComponent={this.ListEmptyView}
          keyExtractor={(item, index) => index.toString()}
        />
        {/* <ModalSuaNhanHang ref={'ModalSuaNhanHang'}>
        </ModalSuaNhanHang>
        <ModalThemNhanHang ref={'ModalThemNhanHang'}>

        </ModalThemNhanHang> */}
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
    flexDirection: 'row',
    margin:10
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
});
