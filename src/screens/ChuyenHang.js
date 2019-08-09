import React, { Component } from 'react';
import { View } from 'react-native';
import { Dialog, List, Colors } from 'react-native-paper';

export default class ChuyenHang extends Component {
  constructor(props) {
    super(props);
    
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

  render() {
    return (
      <View style={{flex: 1}}>
          <Dialog
            visible={true}>
            <Dialog.Title>CHỌN CHỨC NĂNG</Dialog.Title>
            <Dialog.Content>
              <List.Item
                title='Điều Chuyển Ngang Cấp'
                titleStyle={{
                  fontSize: 17
                }}
                left={props => <List.Icon {...props} icon="burst-mode" color={Colors.redA700}/>}
                onPress={() => this.props.navigation.navigate('DieuChuyenNgangCap')}
                style={{
                  backgroundColor: Colors.red50, borderRadius: 20, marginBottom: 5
                }}
              />
              <List.Item
                title='Điều Chuyển Phân Bổ'
                titleStyle={{
                  fontSize: 17
                }}
                left={props => <List.Icon {...props} icon="clear-all" color={Colors.redA700}/>}
                onPress={() => this.props.navigation.navigate('DieuChuyenPhanBo')}
                style={{
                  backgroundColor: Colors.red50, borderRadius: 20
                }}
              />
            </Dialog.Content>
          </Dialog>
      </View>
    );
  }
}
