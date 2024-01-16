import Drawer from "../Drawer/Drawer";
import DrawerMenu from "./MainPage.constants"

const MainPage = ()=>{
    return (
        <div>
            <Drawer menuItemList={DrawerMenu}/>
        </div>
    )
}

export default MainPage;