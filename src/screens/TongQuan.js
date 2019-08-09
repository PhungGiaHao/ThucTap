import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, AsyncStorage } from 'react-native';
import { List } from 'react-native-paper';
import axios from 'axios'
import url from '../API/Api'
import { ScrollView } from 'react-native-gesture-handler';

class Container extends Component {
    render() {
        return (
            <View style={styles.container}>{this.props.children}</View>
        )
    }
}

class TongQuanContainer extends Component { 
    render() {
        return (
            <View style={styles.tongquan}>{this.props.children}</View>
        )
    }
}




export default class TongQuan extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        chitiet: [],
        refreshing: true
    };

    componentDidMount = async() => {
        const id_user = await AsyncStorage.getItem('ID')
        console.log("ID hien tai la: "+id_user)
        await axios.get(`${url}tqct/${id_user}`)
        .then(res => {
            this.setState({
                chitiet: res.data,
                refreshing: false
            })
            console.log(this.state.chitiet)
        })
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

  render() {
    if (this.state.refreshing) {
        return (
          <View style={{ flex: 1, margin: 0, paddingTop: '70%' }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
    } else {
        return (
            <Container>
                <TongQuanContainer>
                <ScrollView>
                {
                    this.state.chitiet.map(item => {
                        return(
                            <List.Section>
                                <List.Subheader style={{
                                    fontSize: 20,
                                    alignSelf: 'center'
                                }}>CHI TIẾT KHO HÀNG</List.Subheader>
                                <List.Item
                                    style={styles.listItem}
                                    title="Tên kho"
                                    description = {item.ten_kho}
                                    left={() => <List.Icon icon="account-balance" color='#FBAB30'/>}
                                />
                                <List.Item
                                    style={styles.listItem}
                                    title="Thủ kho"
                                    description={item.ten_nguoi_dung}
                                    left={() => <List.Icon color="#000" icon="account-box" color='#F08038'/>}
                                />
                                <List.Item
                                    style={styles.listItem}
                                    title="Địa chỉ"
                                    description={item.dia_chi}
                                    left={() => <List.Icon color="#000" icon="directions" color='#ED3036'/>}
                                />
                                <List.Item
                                    style={styles.listItem}
                                    title="Ngày lập kho"
                                    description={item.ngay_lap_kho}
                                    left={() => <List.Icon color="#000" icon="event-note" color='#F15278'/>}
                                />
                            </List.Section>
                        )
                    })
                }
                </ScrollView>
                </TongQuanContainer>
            </Container>  
        );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        margin: 0,
        padding: 0,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        height: Dimensions.get('window').height
    },
    tongquan: {
        flex: 1,
        backgroundColor: '#E8E8E8'
    },
    listItem: {
        marginTop: 10,
        marginHorizontal: 15,
        borderRadius: 20,
        padding: 0,
        backgroundColor: '#FFF'
    }
})
