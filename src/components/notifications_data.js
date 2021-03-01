import { Dictionary } from '../Dictionary';
import cart_plus from '../images/icons/cart_plus.svg'
import suggest_dish from '../images/icons/suggest_dish.svg'
import yellow_warning from '../images/icons/triangle_warning.svg'
import circle_warning from '../images/icons/circle red warning.svg'
import overflow_sign from '../images/icons/overflow sign.svg'
import { AddToOrder } from '../pages/inventory_page';

import dairy from '../images/icons/category_symbols/dairy.svg'
import vegetables from '../images/icons/category_symbols/vegetables.svg'
import fruit from '../images/icons/category_symbols/fruit.svg'

export const notifications_levels = [3, 2, 1], notification_colors = ["#FD5E53", "#F1C033", "#F78745"]

var error_symbol = [circle_warning, yellow_warning, overflow_sign],

    styleArr = ["rgba(235, 104, 104, 0.32)", "rgba(247, 231, 185, 0.85)", "rgba(255, 103, 14, 0.2)"],//red, green, orange

    messages = [Dictionary["just_few"], Dictionary["running_low"], Dictionary["must_use"]],

    text_descp = [Dictionary["add_to_order"], Dictionary["add_to_order"], Dictionary["suggest_dish"]],

    action_symbol = [cart_plus, cart_plus, suggest_dish]

export const category_symbols = [vegetables, fruit, dairy, vegetables, fruit, dairy],

    category_colors = ["#509700", "#FF7978", "#EADAC0", "#C21D1D", "#AE7A48", "#00000054"],

    category_names = [Dictionary["vegtables"], Dictionary["fruit"],
    Dictionary["fish"] + " " + Dictionary["and"] + Dictionary["meat"], Dictionary["dairy"],
    Dictionary["dry_foods"], Dictionary["other"]]





export const notification_dict = {
    1: { "color": styleArr[0], "error_symbol": error_symbol[0], message: messages[0], "action_symbol": action_symbol[0], "action_desc": text_descp[0] },
    2: { "color": styleArr[1], "error_symbol": error_symbol[1], message: messages[1], "action_symbol": action_symbol[1], "action_desc": text_descp[1] },
    3: { "color": styleArr[2], "error_symbol": error_symbol[2], message: messages[2], "action_symbol": action_symbol[2], "action_desc": text_descp[2] }
}

export function action_btn(defult_val, code, title, order_details) {
    var val = 10,
        unit = "kg",
        is_in_order = false
    if (order_details && order_details["amount"]) {
        is_in_order = true
        val = order_details["amount"]
        if (order_details["unit"])
            unit = order_details["unit"]
        

    }
    else if (defult_val)
        val = defult_val

    
    switch (code) {
        case 2:
            return <img src={suggest_dish} alt={Dictionary["suggest_dish"]} />

        case 0:
        case 1:
        default:
            return <AddToOrder kind={0} title={title} defult_val={val} unit ={unit} is_in_order={is_in_order}/>

    }




}