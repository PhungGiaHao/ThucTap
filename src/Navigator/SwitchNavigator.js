import {createSwitchNavigator} from 'react-navigation' 
import DangNhap from '../screens/DangNhap'
import StackApp from './StackApp';

const SwitchNavigator = createSwitchNavigator ({
    DangNhap: {screen: DangNhap},
    TrangChu : {screen: StackApp}
})

export default SwitchNavigator;