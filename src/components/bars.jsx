import "./bars.css"
import inventory from '../images/icons/inventory.svg'
import home from '../images/icons/home.svg'
import cart from '../images/icons/cart.svg'
import profile from '../images/icons/profile.svg'
import {base_url} from '../index'


export const BottomBar = (props) =>{

    return(
        <footer id = "bottom-bar">
            <img className="bottom-bar-btn" src={home} onClick={()=> alert("yess")}></img>
            <img className="bottom-bar-btn" src={inventory}></img>
            <img className="bottom-bar-btn" src={cart}></img>
            <img className="bottom-bar-btn" src={profile}></img>
        </footer>

    )


}