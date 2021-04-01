import { Dictionary } from '../Dictionary';
import cart_plus from '../images/icons/orders/cart_plus.svg'
import suggest_dish from '../images/icons/suggest_dish.svg'
import yellow_warning from '../images/icons/triangle_warning.svg'
import circle_warning from '../images/icons/circle red warning.svg'
import overflow_sign from '../images/icons/overflow sign.svg'
import white_circle from '../images/icons/white circle warning.svg';
import white_triangle from '../images/icons/white triangle_warning.svg';
import white_overflow from '../images/icons/white overflow sign.svg';
import { AddToOrder } from '../pages/inventory_page';
import meet_and_fish from '../images/icons/category_symbols/meet_and_fish.svg'
import dry_food from '../images/icons/category_symbols/dry_food.svg'
import others from '../images/icons/category_symbols/others.svg'
import dairy from '../images/icons/category_symbols/dairy.svg'
import vegetables from '../images/icons/category_symbols/vegetables.svg'
import fruit from '../images/icons/category_symbols/fruit.svg'
import inventory_looks_good from '../images/icons/inventory looks good.svg'

export const notifications_levels = [3, 2, 1], notification_colors = ["#FD5E53", "#F1C033", "#F78745"],
    action_symbol = [cart_plus, cart_plus, suggest_dish]

export const styleArr = ["rgba(235, 104, 104, 0.32)", "rgba(247, 231, 185, 0.85)", "rgba(255, 103, 14, 0.2)", "rgba(115, 213, 4, 1)"]//red, green, orange

var error_symbol = [circle_warning, yellow_warning, overflow_sign, white_circle, white_triangle, white_overflow, inventory_looks_good],


    messages = [Dictionary["just_few"], Dictionary["running_low"], Dictionary["must_use"], Dictionary["looks_good"]],

    text_descp = [Dictionary["add_to_order"], Dictionary["add_to_order"], Dictionary["suggest_dish"]]


export const category_symbols = [vegetables, fruit, meet_and_fish, dairy, dry_food, others],

    category_colors = ["#509700", "#FF7978", "#C21D1D", "#EADAC0", "#AE7A48", "#00000054"],

    category_names = [Dictionary["vegtables"], Dictionary["fruit"],
    Dictionary["fish"] + " " + Dictionary["and"] + Dictionary["meat"], Dictionary["dairy"],
    Dictionary["dry_foods"], Dictionary["other"]]

export const notification_dict = {
    "-1": { "color": styleArr[3], "error_symbol": error_symbol[6], "alert_filter_symbol": error_symbol[6], message: messages[3], "action_symbol": action_symbol[0], "action_desc": text_descp[0] },
    1: { "color": styleArr[0], "error_symbol": error_symbol[0], "alert_filter_symbol": error_symbol[3], message: messages[0], "action_symbol": action_symbol[0], "action_desc": text_descp[0] },
    2: { "color": styleArr[1], "error_symbol": error_symbol[1], "alert_filter_symbol": error_symbol[4], message: messages[1], "action_symbol": action_symbol[1], "action_desc": text_descp[1] },
    3: { "color": styleArr[2], "error_symbol": error_symbol[2], "alert_filter_symbol": error_symbol[5], message: messages[2], "action_symbol": action_symbol[2], "action_desc": text_descp[2] }
}

export function action_btn(defult_val, level, title, order_details, item_id, supplier_id) {
    var val,
        unit = 1,
        is_in_order = false
    console.log(order_details)
    if (order_details && order_details["amount"]) {
        is_in_order = true
        val = order_details["amount"]
        if (order_details["unit"])
            unit = order_details["unit"]
    }
    else if (defult_val)
        val = defult_val

    switch (level) {
        case 2: //item is going bad
            return <img src={suggest_dish} alt={Dictionary["suggest_dish"]} />
        case 0:// item is critical 
        case 1:// item is in danger
        case 3:// item looks good
        default:
            console.log(supplier_id)
            return <AddToOrder kind={0} title={title} defult_val={val} unit={unit} is_in_order={is_in_order} business_id={1} item_id={item_id} supplier_id={supplier_id} />

    }
}