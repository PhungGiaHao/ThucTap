import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import url from '../API/Api'
/* KHUNG MÀN HÌNH */
class Container extends Component{
    render(){
        return(
            <ScrollView style = {{ padding: 0, margin: 0 }}>
                <View style = { styles.container }>
                    {this.props.children}
                </View>
            </ScrollView>
        );
    }
}

export default class QuanLyKhoHang extends Component {
    constructor(props){
        super(props)
        this.state = {
            node: [],
            refreshing: true
        }
    }

    componentDidMount(){
        axios.get(url+'menunode')
            .then( res => {
                this.setState({
                    node: res.data,
                    refreshing: false
                })
            })
    }
    
    ChuyenTrang = ( ID, TEN, COLOR ) => {
        if(ID == 1) {
            this.props.navigation.navigate('TongQuan', { ID, TEN, COLOR });
        } else if(ID == 2){
            this.props.navigation.navigate('QuanLyNganhHang', { ID, TEN, COLOR });
        } else if(ID == 5){
            this.props.navigation.navigate('KhoHang', { ID, TEN, COLOR });
        } else if (ID == 4){
            this.props.navigation.navigate('QuanLySanPham', { ID, TEN, COLOR });
        } else if (ID == 3){
            this.props.navigation.navigate('QuanLyNhanHang', { ID, TEN, COLOR });
        } else if (ID == 7){
            this.props.navigation.navigate('NhapHang', { ID, TEN, COLOR });
        } else if (ID == 6){
            this.props.navigation.navigate('CanhBao', { ID, TEN, COLOR });
        } else if(ID == 18){
            this.props.navigation.navigate('ChuyenHang', { ID, TEN, COLOR });
        } else if(ID == 8){
            this.props.navigation.navigate('XuatHang', { ID, TEN, COLOR });
        }
         else if(ID ==  19)
        {
         this.props.navigation.navigate('ThuHoi',{ ID, TEN, COLOR })
        } else {
            Alert.alert("THÔNG BÁO","TÍNH NĂNG ĐANG ĐƯỢC PHÁT TRIỂN")
        }
      }
      
    static navigationOptions = ( {navigation} ) => {
        return{
            title: navigation.getParam('TEN'),
            headerStyle: {
                backgroundColor: navigation.getParam('COLOR'),
            },
            headerTintColor: '#FFFFFF'
        }
    };

    render() 
    
    {
        if (this.state.refreshing) {
            return (
            console.log(this.state.node),
              <View style={{ flex: 1, margin: 0, paddingTop: '70%' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                
              </View>
            );
           
        }
        return (
            
            <Container>
                <View style = {styles.cardContainer }>
                {
                    
                    this.state.node.map((item, index) => {
                        return(
                            <TouchableOpacity  onPress={this.ChuyenTrang.bind(this, item.id_node, item.ten_node, item.background)} >
                                <View style = { styles.cardBox } key = { index }>
                                    <Ionicons name = {item.icon_app} size={55} color={item.background} style = {{paddingTop: 10}}/>
                                    <Text style = {{ fontSize: 12, textAlign: 'center', marginHorizontal: 5, color: '#343434'}}>
                                        {item.ten_node}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })
                }
                </View>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
        padding: 0,
        flex: 1
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginLeft: Dimensions.get('window').width * 0.03
    },
    cardBox: { 
        borderRadius: 5,
        shadowOpacity: 1,
        shadowColor: '#EEE',
        shadowRadius: 5,
        shadowOffset: { width: 3, height: -3 },
        backgroundColor: '#EEE',
        height: Dimensions.get('window').width * 0.3,
        width: Dimensions.get('window').width * 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Dimensions.get('window').width * 0.02,
        marginTop: Dimensions.get('window').width * 0.02
    }
}) 