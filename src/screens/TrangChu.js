import React, { Component } from "react"
import { Alert, View, StyleSheet, Text, Image, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Dimensions } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import avatarImage from '../image/avatar_image.png'
import url from '../API/Api'
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

/* KHUNG MÀN HÌNH */
class Container extends Component {
    render() {
        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        );
    }
}

/* MÀN HÌNH CHÀO */
class WelcomeScreen extends Component {
    state = {
        'USERNAME': '',
        'TEN': '',
        'CHUCVU': '',
        
         
    }

    componentDidMount = async () => {
        AsyncStorage.getItem('USERNAME').then((value) => this.setState({ 'USERNAME': value }))
        AsyncStorage.getItem('TEN').then((value) => this.setState({ 'TEN': value }))
        AsyncStorage.getItem('CHUCVU').then((value) => this.setState({ 'CHUCVU': value }))
    }

    setUsername = (value) => {
        AsyncStorage.setItem('USERNAME', value);
        this.setState({ 'USERNAME': value });
    }

    setTen = (value) => {
        AsyncStorage.setItem('TEN', value);
        this.setState({ 'TEN': value });
    }

    setChucVu = (value) => {
        AsyncStorage.setItem('CHUCVU', value);
        this.setState({ 'CHUCVU': value });
    }
        ;
    render() {
        return (
            <LinearGradient
                style={styles.gradientBackground}
                colors={['#90B787', '#92B789', '#93B68A', '#96B78D', '#99B68F', '#9CB692', '#9EB694', '#A0B595', '#A2B597', '#A4B599', '#A7B49C', '#A9B49D', '#ABB49F', '#AEB4A2', '#B1B3A4', '#B3B3A6', '#B6B3A9', '#B9B3AC', '#BBB2AE', '#BEB2B0', '#C1B2B2', '#C3B2B5', '#C6B1B8', '#C9B1BA', '#CCB1BC', '#CFB1BF', '#D1B0C1', '#D4AFC3', '#D8B0C7']}
                start={[0.1, 0.1]}
                end={[0.5, 0.5]}
            >
                <Image source={avatarImage} style={{ width: 100, height: 100, marginTop: 20 }} />
                <Text style={
                    {
                        color: '#FFFFFF',
                        fontSize: 22,
                        paddingTop: 10
                    }}> Xin chào {this.state.TEN}</Text>
                <Text style={
                    {
                        color: '#FFFFFF',
                        fontSize: 15,
                        fontStyle: "italic",
                        paddingTop: 3,
                        paddingBottom: 10
                    }}>{this.state.CHUCVU}</Text>
            </LinearGradient>
        );
    }
}

/*  DANH SÁCH CÁC CHỨC NĂNG CHÍNH */
class Card extends Component {
    render() {
        return (
            <View style={styles.cardContainer}>
                <View style={styles.cardBox}>
                    {this.props.children}
                </View>
            </View>
        )
    }

}
const PUSH_ENDPOINT = 'https://your-server.com/users/push-token';

async function registerForPushNotificationsAsync() {
    const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
        // Android remote notification permissions are granted during the app
        // install, so this will only ask on iOS
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
        return;
    }

    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();
    console.log(token)
    // POST the token to your backend server from where you can retrieve it to send push notifications.
    
    //     fetch(PUSH_ENDPOINT, {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
            //  'Accept-Encoding': 'gzip,deflate',
    //     },
    //     body: JSON.stringify({
    //          "to": "ExponentPushToken[GfhVL3GniwaaEDhuDB3lZG]",
// "title": "Cảnh Báo",
// "body": "Sản Phẩm gì gì đó bị cái ấy ấy đó "
    //         },
    //     }),
    // });
}
/*  TRANG DASHBOARD */
export default class TrangChu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            supernode: [],
            refreshing: true,
            canhBaoHetHans:[],
            canhBaoSapHetHangs:[],
            canhBaoTonKhoLauNgays:[],
        }
    }

    _singout = async () => {
        await AsyncStorage.clear()
        this.props.navigation.navigate('DangNhap')
    }
   
componentWillMount (){
    // this.getdatacanhbao()
    registerForPushNotificationsAsync();
    axios.get(url + 'supernode')
        .then(res => {
            this.setState({
                supernode: res.data,
                refreshing: false
            })
        })
        .catch(error => {
            console.log(error)
        })
}
    static navigationOptions = () => {
        return {
            header: null,
        }
    };
/// ///////////////////////
 //////////////////////////////////////////////////////
 getdatacanhbao = async () => {
    await fetch(url+'chcb')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
            canhBaoHetHans: responseJson.canhBaoHetHans,
            canhBaoSapHetHangs:responseJson.canhBaoSapHetHangs,
            canhBaoTonKhoLauNgays:responseJson.canhBaoTonKhoLauNgays,
        });
        this.dem(),
        this.dem2(),
        this.dem3()
      }
      )
      .catch((error) => {
        alert("Đã có lỗi xảy ra vui lòng thử lại")
      });
  }
  //////////////////////////////////

  /////////////////////////////////////
  dem = async () => {
        var canhbaohethan_dodai =this.state.canhBaoHetHans.length 
      
        for (let i=0 ; i<canhbaohethan_dodai;i++)
        { 
        if(canhbaohethan_dodai>0)
        {   
            console.log(i)
           this.pushthongbao(i)
        }
        }
        ///////////////////////////////////////////////
      
        //////////////////////////////////////////////////
       
        /////////////////////////////////////////////
  }
///////////////////////////
dem2 = async () => {
    var canhbaohetHang_dodai=this.state.canhBaoSapHetHangs.length
    console.log(canhbaohetHang_dodai)
    for (let i2=0;i2<canhbaohetHang_dodai;i2++)
    {   
        if(canhbaohetHang_dodai>0)
         {
            console.log(i2+"123123123123")
            this.pushthongbao2(i2)
         }
    }
}
//////////////////////
dem3 = async () => {
    
    var canhBaoTonKhoLauNgay_dodai=this.state.canhBaoTonKhoLauNgays.length
    for (let i3=0;i3<canhBaoTonKhoLauNgay_dodai;i3++)
    {
        if(canhBaoTonKhoLauNgay_dodai>0)
         {
            console.log(i3)
            this.pushthongbao3(i3)
         }
    }
}
/////////////////////
pushthongbao= async (i) => {
let token = await Notifications.getExpoPushTokenAsync();
   await fetch(`https://exp.host/--/api/v2/push/send`,
    {
      method: 'POST',
      headers: 
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
            "to": token,
            "title": "Cảnh Báo",
            "body": this.state.canhBaoHetHans[i].ten_san_pham +" "+this.state.canhBaoHetHans[i].thong_tin_canh_bao
        })

    }).then((response) => response.json())
    .then((responseJsonFromServer) => {
      // if((responseJsonFromServer.id_th).length>0)
      console.log(responseJsonFromServer)
      
    }).catch((error) => {
      Alert.alert("Đã có lỗi xảy ra xin vui lòng thử lại !")
    })
    .done(); 
    //////////////////////////////////////////////////////////////////
  
    // ///////////////////////////////////////////////////////////////////////
  
}
////////////////////////////
pushthongbao2 = async (i2) =>{
    let token = await Notifications.getExpoPushTokenAsync();
    await fetch(`https://exp.host/--/api/v2/push/send`,
    {
      method: 'POST',
      headers: 
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
            "to": token,
            "title": "Cảnh Báo",
            "body": this.state.canhBaoSapHetHangs[i2].ten_san_pham +" "+this.state.canhBaoSapHetHangs[i2].thong_tin_canh_bao
        })

    }).then((response) => response.json())
    .then((responseJsonFromServer) => {
      // if((responseJsonFromServer.id_th).length>0)
      console.log(responseJsonFromServer) 
    }).catch((error) => {
      Alert.alert("Đã có lỗi xảy ra xin vui lòng thử lại !")
    })
    .done(); 
}
/////$GetCurrent
pushthongbao3 = async (i3) => {
    let token = await Notifications.getExpoPushTokenAsync();
    await fetch(`https://exp.host/--/api/v2/push/send`,
    {
      method: 'POST',
      headers: 
      {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
            "to": token,
            "title": "Cảnh Báo",
            "body": this.state.canhBaoTonKhoLauNgays[i3].ten_san_pham +" "+this.state.canhBaoTonKhoLauNgays[i3].thong_tin_canh_bao
        })

    }).then((response) => response.json())
    .then((responseJsonFromServer) => {
      // if((responseJsonFromServer.id_th).length>0)
      console.log(responseJsonFromServer)
    }).catch((error) => {
      Alert.alert("Đã có lỗi xảy ra xin vui lòng thử lại !")
    })
    .done(); 
}
/////////////////////////
componentDidMount() {
    const { navigation } = this.props;
    //Adding an event listner om focus
    //So whenever the screen will have focus it will set the state to zero
    this.focusListener = navigation.addListener('didFocus', () => {
        
      this.getdatacanhbao()
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
//////////////////////
    ChuyenTrang = (ID, TEN, COLOR) => {
        if (ID == 7) {
            this.props.navigation.navigate('Dashboard', { ID, TEN, COLOR });
        } else {
            Alert.alert('THÔNG BÁO',"Tính năng đang được phát triển")
        }

    }

    render() {
        if (this.state.refreshing) {
            return (
                <View style={{ flex: 1, margin: 0, paddingTop: '70%' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        }
        return (
            <Container>
                <View style={styles.box1}>
                    <WelcomeScreen />
                </View>

                <ScrollView style={{ padding: 0, marginTop: 210 }}>
                    <View style={styles.box2}>
                        {
                            this.state.supernode.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={this.ChuyenTrang.bind(this, item.id, item.text, item.background)}>
                                        <Card key={index}>
                                            <Ionicons name={item.icon_app} size={55} color={item.background} style={{ paddingTop: 10 }} />
                                            <Text style={{ fontSize: 14, textAlign: 'center', marginHorizontal: 5, color: '#343434' }}>
                                                {item.text}
                                            </Text>
                                        </Card>
                                    </TouchableOpacity>
                                );
                            })
                        }
                        <TouchableOpacity onPress={this._singout}>
                            <Card>
                                <Ionicons name='ios-log-out' size={50} color='#c20084' style={{ paddingTop: 10 }} />
                                <Text style={{ fontSize: 14, textAlign: 'center', marginHorizontal: 5, color: '#343434' }}>
                                    ĐĂNG XUẤT
                                </Text>
                            </Card>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 0,
        padding: 0
    },
    box1: {
        flex: 2.5
    },
    box2: {
        flex: 7.5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginLeft: Dimensions.get('window').width * 0.01
    },
    gradientBackground: {
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#5F64AF',
        height: 210,
        alignItems: 'center'
    },
    cardContainer: {
        height: Dimensions.get('window').width * 0.3,
        borderRadius: 5,
        borderColor: '#EEE',
        backgroundColor: '#EEE',
        shadowOpacity: 1,
        shadowColor: '#EEE',
        shadowRadius: 5,
        shadowOffset: { width: 3, height: -3 },
        justifyContent: 'center',
        marginLeft: Dimensions.get('window').width * 0.02,
        marginTop: Dimensions.get('window').width * 0.02,
    },
    cardBox: {
        width: Dimensions.get('window').width * 0.3,
        alignItems: 'center'
    }
})