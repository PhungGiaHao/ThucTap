import React, { Component } from "react"
import { Text, Dimensions, Modal } from "react-native"

export default class ThemKhoHang extends Component {
    constructor(props){
        super(props)

        showAddModal = () => {
            this.refs.addWarsehouse.open();
        }
    }
    render(){
        return(
            <Modal
                ref = 'addWarsehouse'
                style = {{
                    justifyContent: 'center',
                    borderRadius: 5,
                    shadowRadius: 10,
                    width: Dimensions.get('window').width - 80,
                    height: Dimensions.get('window').height -80
                }}
                position = 'center'
                backdrop = { true }
                onClosed = {() => {
                    alert('Modal closed!')
                }}
            >
                <Text>THÊM KHO HÀNG MỚI</Text>
            </Modal>
        )
    }
}