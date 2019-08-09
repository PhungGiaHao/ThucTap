import React, { Component } from 'react'
import { Text, View, StyleSheet, FlatList, ActivityIndicator, Platform, RefreshControl, Image, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { TextInput, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import defaultIMG from '../image/default.jpg'
import ImageView from 'react-native-image-view'
const screen = Dimensions.get('window')
export default class QuanLySanPham extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      text: '',
      refreshing: true,
      pickerResult: null,
      imguri: "",
      isImageViewVisible: false
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
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate('QuetMa')}
        >
          <Ionicons name="md-qr-scanner" size={30} color="#FFF" style={styles.iconQR} />
        </TouchableOpacity>
      ),
    }
  };

  getdata = async () => {
    return await fetch(url + 'sanpham')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          loading: false,
          dataSource: responseJson,
          refreshing: false,
          listanhsanpham: responseJson[0].listanhsanpham

        },
          function () {
            
            this.arrayholder = responseJson;
            
          });
      })
      .catch((error) => {
        alert("Không lấy được dữ liệu của sản phẩm vui lòng thử lại")
        this.setState ({
          loading: false,
          refreshing: false,
        })
      });

  }

  QuetMa = () => {
    this.props.navigation.navigate('QuetMa')
  }
  //
  onRefresh() {
    this.setState({
      loading: true,
      dataSource: [],
      isImageViewVisible:false,
    });
    this.getdata();
    console.log(this.state.dataSource);
    console.log(this.state.listanhsanpham);
  }

  //
  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          margin: 5,
          height: 0.5,
          width: "100%",
          backgroundColor: 'red',
          borderWidth: .5,
          flexDirection: 'row',
        }}
      />
    );
  }

  ListEmptyView = () => {
    return (
      <View style={styles.MainContainer}>
        <Text style={{ textAlign: 'center', flex: 1, justifyContent: 'center', alignItems: 'center' }}> Không Có Dữ Liệu</Text>
      </View>

    );
  }
  componentDidMount() {
    const { navigation } = this.props;
    //Adding an event listner om focus
    //So whenever the screen will have focus it will set the state to zero
    this.focusListener = navigation.addListener('didFocus', () => {
      this.onRefresh()
    });
  }
  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack

    this.focusListener.remove();
  }
  //lấy ảnh
  ////////////////////////////////
  SearchFilterFunction(text) {
    //passing the inserted text in textinput
    const newData = this.arrayholder.filter(function (item) {
      //applying filter for the inserted text in search bar
      const itemData = item.ten_san_pham ? item.ten_san_pham.toUpperCase() : ''.toUpperCase();
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
  //////////////////////////////////
  //////////////////////////////////////
  XuongDuoiCung = () => {
    this.ListNhanHang.scrollToEnd({ animated: true });
  }
  themsanpham = () => {
    this.props.navigation.navigate('NhapSanPham')
  }
  ///////////////////////////////////
  chitietsanpham = (ID) => {
    this.props.navigation.navigate('ChiTietSanPham', { ID })
  }
  /////////ChiTietSanPham.js
  zoomAnh = (link) => {
    this.setState({
      imguri: link,
      isImageViewVisible:true
    })
  }
  ////////////
  render() {
    const images = [
      {
        source: {
          uri: this.state.imguri,
        },
        title: '',
        width: 400,
        height: 500,
      },
    ];
    if (this.state.loading) {
      return (
        <View style={styles.ActivityIndicator_Style}>
          <ActivityIndicator size="large" />
          <Text style={styles.TextLoad}>Đang Lấy Dữ Liệu</Text>
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
            placeholder="Nhập tên sản phẩm..."
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
                  <TouchableOpacity
                    onPress={this.zoomAnh.bind(this, item.link_anh)}
                  >
                    <View style={styles.imageflatlistContainer} >
                      <Image
                        style={styles.imageflatlist}
                        source={{ uri: item.link_anh } === "" ? defaultIMG : { uri: item.link_anh }}
                      />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.textinFlatList} >
                    <Text>Tên Sản Phẩm: {item.ten_san_pham}</Text>
                    <Text>Model: {item.model}</Text>
                    <Text>Giá: {item.gia}</Text>
                    <Text>Ghi Chú : {item.ghi_chu}</Text>
                    <TouchableOpacity onPress={this.chitietsanpham.bind(this,
                      item.id_san_pham
                    )}>
                      <Text style={styles.chitiet}>Chi Tiết Sản Phẩm >>> </Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
        </View>
        <ImageView
          images={images}
          imageIndex={0}
          isVisible={this.state.isImageViewVisible}
          renderFooter={(currentImage) => (<View><Text>Ảnh Sản phẩm</Text></View>)}
        />
        <View style={styles.TouchableOpacityStyle}>
          <TouchableOpacity onPress={this.themsanpham}>
            <Ionicons name="ios-add-circle-outline" size={40} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}







const styles = StyleSheet.create({

  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingTop: (Platform.OS === 'ios') ? 20 : 0
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
  FlatListContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  textinFlatList: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
  },
  TextFunction: {
    textAlign: 'center'
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
    flexDirection: 'row'
  },
  header_footer_style: {
    flexDirection: 'row'
  },
  TextInputSearch: {
    flex: 4,
    paddingLeft: 10,
    height: 40,
    borderWidth: 1,
    borderColor: '#7B7B7B',
    borderRadius: 5,
    marginHorizontal: 5,
    marginTop: 5
  },
  TouchableOpacityStyle: {
    position: 'absolute',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    right: 10,
    bottom: 10,
    backgroundColor: '#D16F21',
    borderRadius: 25
  },
  imageflatlistContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageflatlist: {
    width: 120,
    height: 140,
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'center'
  },
  opacity: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flatlistview: {
    flex: 1
  },
  iconQR: {
    marginRight: 10,
  },
  iconthem: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  TextLoad: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center'
  },
  chitiet: {
    fontStyle: 'italic',
    color: '#BE444A'
  },
});
