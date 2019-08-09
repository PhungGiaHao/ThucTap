import {createStackNavigator} from 'react-navigation'
import TrangChu from '../screens/TrangChu'
import Dashboard from '../screens/Dashboard'
import TongQuan from '../screens/TongQuan'
import QuanLyNganhHang from '../screens/QuanLyNganhHang'
import KhoHang from '../screens/KhoHang'
import NhapSanPham from '../screens/NhapSanPham'
import QuanLyKhoHang from '../screens/Dashboard'
import QuanLyNhanHang from '../screens/QuanLyNhanHang'
import QuetMa from '../screens/QuetMa'
import QuanLySanPham from '../screens/QuanLySanPham'
import ChiTietSanPham from '../screens/ChiTietSanPham'
import NhapHang from '../screens/NhapHang'
import CanhBao from '../screens/CanhBao'
import DieuChuyenNgangCap from '../screens/DieuChuyenNgangCap'
import xuathang from '../screens/xuathang';
import ThuHoi from '../screens/ThuHoi';
import lichsuthuhoi from '../screens/lichsuthuhoi';
import DieuChuyenPhanBo from '../screens/DieuChuyenPhanBo';
import LichSuDieuChuyenPhanBo from '../screens/LichSuDieuChuyenPhanBo'
import LichSuDieuChuyenNgangCap from '../screens/LichSuDieuChuyenNgangCap'
import ChuyenHang from '../screens/ChuyenHang'

const StackApp = createStackNavigator ({
    Trangchu: { screen: TrangChu },
    Dashboard: { screen: Dashboard },
    TongQuan: { screen: TongQuan },
    QuanLyNganhHang: { screen: QuanLyNganhHang },
    KhoHang: { screen: KhoHang },
    QuanLyKhoHang:{ screen: QuanLyKhoHang },
    QuanLyNganhHang: { screen: QuanLyNganhHang },
    QuanLyNhanHang: { screen: QuanLyNhanHang },
    QuanLySanPham: { screen: QuanLySanPham },
    NhapSanPham: { screen: NhapSanPham },
    QuetMa: { screen: QuetMa },
    ChiTietSanPham: { screen: ChiTietSanPham },
    NhapHang: {screen: NhapHang},
    QuetMa: { screen:QuetMa },
    DieuChuyenNgangCap: {screen: DieuChuyenNgangCap},
    XuatHang :{screen:xuathang},
    ThuHoi:{ screen: ThuHoi},
    LichSuThuHoi : { screen: lichsuthuhoi},
    DieuChuyenPhanBo :{ screen: DieuChuyenPhanBo},
    LichSuDieuChuyenPhanBo: { screen:LichSuDieuChuyenPhanBo },
    CanhBao: { screen: CanhBao },
    LichSuDieuChuyenNgangCap: { screen: LichSuDieuChuyenNgangCap },
    ChuyenHang: { screen: ChuyenHang }
})

export default StackApp