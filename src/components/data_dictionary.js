import { download } from './drawer';
import { notifications_levels } from './notifications_data'
import { set_offset } from './time_manager';

export var data_dict;

export function create_initial_data_dict(data) {
    //this function gets a response from the server and breaks it down to 4 dictionary 
    var dict = {}
    if (data) {
        dict["preferences"] = data["preferences"]
        dict["items"] = create_item_dict(data["items"])
        dict["orders"] = create_orders_dict(data["orders"])
        dict["suppliers"] = create_suppliers_dict(data["suppliers"], dict["orders"], dict["items"])
        dict["notifications"] = create_notification_dict(data["notifications"], dict["suppliers"], dict["orders"])
        dict["weights"] = create_weights_dict(data["weights"], dict["suppliers"], dict["notifications"], dict["orders"], dict["items"])


        // download(JSON.stringify(dict), 'dict.json', 'text/plain');
        confirm_papulation(dict, "create_initial_data_dict", "feild not recived from server")
        if (!dict["weights"]) {
            console.log("no weights for user")
            return null
        }
        return dict


    }
    else
        console.log("create_initial_data_dict no data recived")
}


function create_notification_dict(notification_data, suppliers_data, orders_dict) {
    var dict =
    {
        "category": {},
        "supplier": {},
        "alerts": {}
    }

    confirm_papulation(suppliers_data, "suppliers_data create_notification_dict")
    if (!notification_data)
        return null
    Object.keys(notification_data).forEach(key => {
        var notification = notification_data[key]
        if (notification) {
            confirm_papulation(notification, "create_notification_dict")
            var item_name = notification["item_name"],
                item_id = notification["item_id"],
                category_name = notification["category_name"],
                category_id = notification["category_id"],
                notification_level = notification["code"],
                item_weight = notification["weight"],
                date = set_offset(notification["date"]),
                active = notification["active"],
                unit = notification["unit"],
                notification_to_insert = {
                    "notification_level": notification_level,
                    "item_name": item_name,
                    "item_id": item_id,
                    "total_weight": item_weight,
                    "unit": unit,
                    "date": date,
                    "active": active
                },
                suppliers_id = false;
            if (orders_dict && orders_dict["items"] && orders_dict["items"][item_id])
                notification_to_insert["order_details"] = orders_dict["items"][item_id]

            if (suppliers_data && suppliers_data["items"] && suppliers_data["items"][item_id]) {

                suppliers_id = suppliers_data["items"][item_id]["suppliers"]
                if (suppliers_id) {
                    notification_to_insert["suppliers"] = suppliers_data["suppliers"][suppliers_id]
                    notification_to_insert["supplier_id"] = suppliers_id[0];
                }
            }



            if (item_name && item_id && category_name && category_id && notification_level !== undefined && notification_level !== null && item_weight !== undefined && item_weight !== null) {
                if (!dict["category"][notification_level])
                    dict["category"][notification_level] = {}
                if (!dict["category"][notification_level][category_id])
                    dict["category"][notification_level][category_id] = {}
                dict["category"][notification_level][category_id][item_id] = { ...notification_to_insert };

                if (!dict["alerts"][notification_level])
                    dict["alerts"][notification_level] = {}
                dict["alerts"][notification_level][item_id] = { ...notification_to_insert };
                if (suppliers_id)
                suppliers_id.forEach(supplier_id => {
                    if (!dict["supplier"][notification_level])
                        dict["supplier"][notification_level] = {}
                    if (!dict["supplier"][notification_level][supplier_id])
                        dict["supplier"][notification_level][supplier_id] = {}
                    dict["supplier"][notification_level][supplier_id][item_id] = { ...notification_to_insert };
                })
            }

        }
    });
    return dict
}

function create_weights_dict(weight_data, suppliers_data, notifications_data, orders_dict, items_dict) {
    var dict =
    {
        "category": {},
        "supplier": {}
    }
    confirm_papulation(suppliers_data, "suppliers_data create_weights_dict")
    confirm_papulation(notifications_data, "notifications_data create_weights_dict")
    if (!weight_data)
        return null
    Object.keys(weight_data).forEach(key => {
        var element = weight_data[key]
        if (element) {
            confirm_papulation(element, "create_weights_dict")
            var item_name = element["item_name"],
                item_id = element["item_id"],
                category_id = element["category_id"],
                category_name = element["category_name"],
                unit = element["unit"],
                barcode = element["barcode"],
                notification_level = -1,
                item_extended = undefined
            if (item_name && item_id && category_id && category_name) {
                if (!dict["category"][category_id])
                    dict["category"][category_id] = {}
                if (items_dict && items_dict[item_id])
                    item_extended = items_dict[item_id]
                if (notifications_data && notifications_data["category"]) {
                    var cat = notifications_data["category"]
                    if (cat)
                        notifications_levels.forEach(level => {
                            if (cat[level] && cat[level][category_id] && cat[level][category_id][item_id])
                                notification_level = level
                        })
                }

                var weight_info = {
                    "cat_name": category_name,
                    "date": set_offset(element["date"]),
                    "item_name": item_name,
                    "total_weight": element["weight"],
                    "unit": unit,
                    "notification_level": notification_level,
                    "barcode": barcode,
                    "suppliers": [],
                    "item_extended_details": item_extended
                }
                if (orders_dict && orders_dict["items"] && orders_dict["items"][item_id])
                    weight_info["order_details"] = orders_dict["items"][item_id]
                dict["category"][category_id][item_id] = { ...weight_info }
                if (suppliers_data && suppliers_data["items"] && suppliers_data["items"][item_id] && suppliers_data["items"][item_id]["suppliers"]) {
                    var suppliers = suppliers_data["items"][item_id]["suppliers"]
                    suppliers.forEach(supplier_id => {
                        if (suppliers_data["suppliers"] && suppliers_data["suppliers"][supplier_id]) {
                            dict["category"][category_id][item_id]["suppliers"].push(supplier_id)
                            var supplier_name = suppliers_data["suppliers"][supplier_id]["name"]



                            if (!dict["supplier"][supplier_id])
                                dict["supplier"][supplier_id] = {}
                            if (supplier_name) {
                                weight_info["cat_name"] = supplier_name
                                dict["supplier"][supplier_id][item_id] = weight_info
                            }


                        }
                    });
                }
            }
        }
    });
    return dict
}
function create_suppliers_dict(suppliers_data, orders_dict, item_data) {
    var dict = {
        "items": {},
        "suppliers": {}
    }
    if (!suppliers_data)
        return null

    Object.keys(suppliers_data).forEach(key => {
        var element = suppliers_data[key]
        if (element) {
            var supplier_info = {},
                temp = {
                    "address": element["address"],
                    "email": element["email_user_name"] + "@" + element["email_domain_name"],
                    "name": element["first_name"] + " " + element["last_name"],
                    "phone_number": element["phone_number"],
                    "preferred_contact": element["preferred_contact"],
                },
                supplier_id = element["supplier_id"],
                item_id = element["item_id"],
                item_info = {
                    "supplier_id": supplier_id,
                    "providing_days": element["days_to_provide"],
                    "frequency": element["frequency"]
                }

            if (item_data && item_data[item_id])
                item_info["item_extended_details"] = item_data[item_id]
            if (orders_dict && orders_dict["items"] && orders_dict["items"][item_id])
                item_info["order_details"] = orders_dict["items"][item_id]

            if (!element["email_user_name"] || !element["email_domain_name"])
                temp["email"] = null
            if (!element["first_name"] || !element["last_name"])
                temp["name"] = null


            Object.keys(temp).forEach(key => {
                if (temp[key])
                    supplier_info[key] = temp[key]
            })
            supplier_info["sells_items"] = {}


            if (item_id && supplier_id && element["frequency"] && element["days_to_provide"]) {
                if (!dict["items"][item_id])
                    dict["items"][item_id] = { "suppliers": [] }
                if (!dict["items"][item_id]["suppliers"].includes(supplier_id))
                    dict["items"][item_id]["suppliers"].push(supplier_id)

                if (!dict["suppliers"][supplier_id])
                    dict["suppliers"][supplier_id] = supplier_info
                dict["suppliers"][supplier_id]["sells_items"][item_id] = item_info

            }
            else {
                console.log("missing objects for " + key + " create_suppliers_dict found: supplier_id:" + supplier_id + " ,item_id:" + item_id + " , frequency: " + element["frequency"] + " , providing_days: " + element["days_to_provide"])
            }
        }
    });
    return dict
}
function create_item_dict(item_data) {
    var dict = {}
    if (!item_data)
        return null
    Object.keys(item_data).forEach(key => {
        var element = item_data[key]
        if (element && element["item_id"]) {
            let item_id = element["item_id"]
            dict[item_id] = element
        }
    });
    return dict
}

function create_orders_dict(orders_data) {
    var dict = {
        "items": {},
        "suppliers": {}
    }
    if (!orders_data)
        return null
    var suppliers = dict["suppliers"],
        items = dict["items"]
    Object.keys(orders_data).forEach(key => {
        var element = orders_data[key]
        if (element && element["supplier_id"]) {
            let supplier_id = element["supplier_id"],
                item_id = element["item_id"],
                amount = element["amount"],
                unit = element["unit"],
                order_id = element["order_id"]
            if (supplier_id && item_id && amount && unit) {

                if (!suppliers[supplier_id])
                    suppliers[supplier_id] = {}
                suppliers[supplier_id][item_id] = {
                    "order_id": order_id,
                    "amount": amount,
                    "unit": unit
                }
                items[item_id] = {
                    "order_id": order_id,
                    "amount": amount,
                    "unit": unit
                }


            }
            else {
                console.log("missing objects for " + supplier_id + " create_orders_dict found: item_id: " + item_id + " amount: " + amount + " unit: " + unit)
            }
        }
    });
    return dict
}


export function confirm_papulation(dict, area_name, message = "", dict_to_test = false) {
    message = message ? "\nmessage: " + message : "";
    var not_found_keys = [];
    if (dict) {
        Object.keys(dict).forEach(key => {
            if (dict_to_test) {
                if (dict_to_test.includes(key))
                    not_found_keys.push(key)
            }
            else if (!dict[key])
                not_found_keys.push(key)
        })

        if (not_found_keys) {
            var keys = ""
            not_found_keys.forEach(key => { keys += key + ", " })

            return keys
        }
    }
    else {


    }

}

export function getUnitById(id) {
    switch (id) {

        default:
        case 1:
            return "kg"
        case 2:
            return "lb"
        case 3:
            return "un"
        case 4:
            return "li"
    }
}

// function download(content, fileName, contentType) {
//     var a = document.createElement("a");
//     var file = new Blob([content], { type: contentType });
//     a.href = URL.createObjectURL(file);
//     a.download = fileName;
//     a.click();
// }
