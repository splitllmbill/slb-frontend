import "./Drawer.css"
import closeIcon from "../../assets/close_icon.svg"
import { useState } from "react";
import {AiOutlineMenu,AiOutlineClose } from "react-icons/ai";
type DrawerProps = {
    menuItemList :  Array<any>
  };
const Drawer:React.FC<DrawerProps> = ({menuItemList})=>{

    const [isOpen,setIsOpen]= useState(false)
    console.log(typeof(menuItemList))
    return isOpen ?
    (<div className="drawer">
        <div className="close-button">
            <AiOutlineClose onClick={()=>setIsOpen(false)}/>
        </div>
        <div className="menu-list">
            {menuItemList.map(value=>
                <div className="drawerItem">{value.label}</div>
            )}
        </div>
        {/* // (
            menuItem)=>(<p>{menuItem.label}</p>))} */}
    </div>
    ):(
        <div className="drawer-closed">
            <AiOutlineMenu onClick={()=>setIsOpen(true)}/>
        </div>
    )
}

export default Drawer