import { Dictionary } from '../Dictionary';
import cart_plus from '../images/icons/cart_plus.svg'
import suggest_dish from '../images/icons/suggest_dish.svg'
import yellow_warning from '../images/icons/triangle_warning.svg'
import circle_warning from '../images/icons/circle red warning.svg'
import overflow_sign from '../images/icons/overflow sign.svg'
import { AddToOrder } from '../pages/inventory_page';
var error_symbol = [circle_warning, yellow_warning, overflow_sign],

    styleArr=["rgba(235, 104, 104, 0.32)","rgba(247, 231, 185, 0.85)","rgba(255, 103, 14, 0.2)"],//red, green, orange

    messages = [Dictionary["just_few"], Dictionary["running_low"], Dictionary["must_use"]],

    text_descp = [Dictionary["add_to_order"],Dictionary["add_to_order"],Dictionary["suggest_dish"]],

    action_symbol = [cart_plus,cart_plus,suggest_dish] ;
  


export const notification_dict = {
    1:{"color":styleArr[0],"error_symbol":error_symbol[0],message:messages[0],"action_symbol":action_symbol[0],"action_desc":text_descp[0]},
    2:{"color":styleArr[1],"error_symbol":error_symbol[1],message:messages[1],"action_symbol":action_symbol[1],"action_desc":text_descp[1]},
    3:{"color":styleArr[2],"error_symbol":error_symbol[2],message:messages[2],"action_symbol":action_symbol[2],"action_desc":text_descp[2]}
}
export function action_btn(defult_val, code){
    switch (code) {
        case 2:
            return suggest_dish
            
        case 0:
        case 1:
        default:
            return <AddToOrder defult_val = {defult_val} />
            
    }
    
    


}