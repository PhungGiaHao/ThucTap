import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, AsyncStorage, ActivityIndicator } from 'react-native'
import { LinearGradient } from "expo-linear-gradient"
import axios from 'axios'
import url from '../API/Api'

export default class DangNhap extends Component {
   constructor(props) {
      super(props)
      this.state = {
         username: "",
         password: "",
         info: [],
         refreshing: true
      }
   }

   handleEmail = (text) => {
      this.setState({ username: text })
   }

   handlePassword = (text) => {
      this.setState({ password: text })
   }

   _login = async () => {
      return await axios({
         method: 'post',
         url: `${url}login`,
         data: {
            ten_dang_nhap: this.state.username,
            mat_khau: this.state.password
         }
      }).then(res => {
         this.setState({
            info: res.data,
         })

         if (this.state.username == '') {
            Alert.alert("LỖI!", "Tên đăng nhập không được bỏ trống")
         } else if (this.state.password == '') {
            Alert.alert("LỖI!", "Mật khẩu không được bỏ trống")
         } else if (this.state.username == '' && this.state.password == '') {
            Alert.alert("LỖI!", "Vui lòng điền Tài khoản và Mật khẩu")
         } else if (this.state.username === this.state.info.ten_dang_nhap) {
            AsyncStorage.setItem('ID', `${this.state.info.id}`)
            AsyncStorage.setItem('USERNAME', this.state.info.ten_dang_nhap)
            AsyncStorage.setItem('PASSWORD', this.state.info.mat_khau)
            AsyncStorage.setItem('TEN', this.state.info.ten_nguoi_dung)
            AsyncStorage.setItem('CHUCVU', this.state.info.chuc_vu)
            console.log(this.state.info)
            this.setState({
               refreshing: false
            })

            this.props.navigation.navigate('TrangChu');
         } else {
            Alert.alert(
               'LỖI ĐĂNG NHẬP',
               'Tài khoản hoặc Mật khẩu không chính xác. Vui lòng đăng nhập lại.',
               [
                  {
                     text: 'OK',
                     style: 'cancel'
                  }
               ]
            )
         }
      })
      .catch(error => {
         Alert.alert("ĐÃ XẢY RA LỖI", "Vui lòng thử lại sau. Xin cảm ơn!")
      })
   }

   componentDidMount = async()=>{
      const id_user = await AsyncStorage.getItem('ID')
      const username = await AsyncStorage.getItem('USERNAME')
      const password = await AsyncStorage.getItem('PASSWORD')

      //LOG KET QUA HIEN TAI
      console.log('ID hiện tại: ' + id_user)
      console.log('USERNAME hiện tại: ' + username)
      console.log('PASSWORD hiện tại: ' + password)

      //GET LẠI THÔNG TIN ĐĂNG NHẬP
      ///TRƯỜNG HỢP NGƯỜI ĐĂNG NHẬP TRƯỚC KHÔNG CÒN QUYỀN TRUY CẬP VÀO ỨNG DỤNG
      if(username, password, id_user != null){
         await axios({
            method: 'post',
            url: `${url}login`,
            data: {
               ten_dang_nhap: username,
               mat_khau: password
            }
         }).then( res => {
               this.setState({
                  info: res.data,
               })
         })

         if (this.state.info.ten_dang_nhap == username && this.state.info.mat_khau == password && this.state.info.id == id_user) {
            this.setState({
               refreshing: false
            })
            this.props.navigation.navigate('TrangChu')
         }
      } else{
         await this.setState({
            refreshing: false
         })
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
         <LinearGradient
            colors={['#FEFDFF', '#FAF1FE', '#F5E5FC', '#F0DBFA', '#E9D0F8', '#E2C7F5', '#DABEF1', '#D9BCF0', '#D0B3EC', '#C9ABE9', '#C0A4E4', '#B79CE0', '#AB94DA', '#7D75C3', '#5A62B2', '#4256A6']}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
         >
            <View style={styles.container}>
               <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>ĐĂNG NHẬP</Text>
                  <Text style={{ fontSize: 15, fontStyle: 'italic', marginBottom: 75, color: '#FFFFFF' }}>Ứng Dụng Quản Lý Kho Hàng</Text>
                  <TextInput style={styles.input}
                     underlineColorAndroid="transparent"
                     placeholder="Nhập tài khoản..."
                     placeholderTextColor="#EEEEEE"
                     autoCapitalize="none"
                     onChangeText={this.handleEmail} />

                  <TextInput style={styles.input}
                     underlineColorAndroid="transparent"
                     placeholder="Nhập mật khẩu..."
                     placeholderTextColor="#EEEEEE"
                     autoCapitalize="none"
                     secureTextEntry={true}
                     onChangeText={this.handlePassword} />

                  <TouchableOpacity
                     style={styles.submitButton}
                     onPress={this._login}>
                     <Text style={styles.submitButtonText}>ĐĂNG NHẬP</Text>
                  </TouchableOpacity>
               </View>
            </View>
         </LinearGradient>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      flex: 0.7,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
   },
   loginContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'transparent'
   },
   loginText: {
      color: "#FFFFFF",
      fontSize: 35,
      fontWeight: 'bold',
      marginBottom: 5
   },
   input: {
      height: 50,
      width: 300,
      borderWidth: 1,
      borderRadius: 40,
      borderColor: '#FFFFFF',
      marginBottom: 20,
      paddingLeft: 15,
      marginHorizontal: 10,
      color: '#EEE'
   },
   submitButton: {
      borderRadius: 50,
      backgroundColor: '#7F16E7',
      height: 40,
      width: 130,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
   },
   submitButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      fontSize: 15,
      padding: 0
   }
})