import React from 'react';
import LocalizedStrings from 'react-localization';
import Dropdown, { DropdownContent, DropdownTrigger } from 'react-simple-dropdown';
import './Dictionary.css';
import israelFlag from './images/icons/israel.svg';
import usaFlag from './images/icons/USA.svg';




/* LocalizedStrings is holding our Dictionary so that all of the pages wiil be able to be translated.
to set a language you can call 'Dictionart.setLanguage([the language])'
all pages can reference the text with 'Dictionery.[reference]
the references were devided to the main pages that is using them*/
export const Dictionary = new LocalizedStrings({
  EN: {
    //login page
    enterMail: `Please enter email`,
    enterPass: `Password`,
    login: `Log in`,
    signOut: `Sign out`,
    show_inventory: "show inventory",
    supplier: 'Supplier',
    item_type: 'Item Type',
    alerts: 'Alerts',
    show_items: "Show items",


    //bottom bar
    home: "Home",
    inventory: "Inventory",
    orders: "Orders",
    profile: "Profile",





    //containers
    unknown_date: "unknown date",
    last_registred: "last registred at",
    see_full: "See full inventory",
    go_to_orders: "Go to orders",
    30: "Past month",
    7: "Past week",
    1: "Past day",
    min: "Minimum",
    max: "Maximum",
    unset:"Unset",
    item_weight:"Item weight",
    no_data: "No data to show",

    //notifications
    notifications: "Notifications",
    just_few: "Just a few left",
    running_low: "Running low",
    must_use: "Must use ASAP",
    add_to_order: "Add to order",
    edit_order: "Edit order",
    suggest_dish: "Suggest Dish",
    kg: "kg",
    lb: "lbs",
    un: "units",
    looks_good: "Inventory looks good",
    serach_placeholder: "what are you looking for",
    item_added: "Item added successfully",
    item_added_failed: "Item added failed",

    //category names
    fish: "Fish",
    meat: "Meat",
    vegtables: "Vegtables",
    fruit: "Fruit",
    dairy: "Dairy",
    dry_foods: "Dry foods",
    other: "Other",
    and: " &",

    //order page
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    add_item: "Add item",
    new_item: "New item",
    unknown: "Unknown",
    cart: "Cart",
    export_lists:"Export Lists",

    //settings page
    language: "Language",

    //messages
    page_not_found: "Sorry, the page you were looking for was not found",
    status_code: "Status code",

    //qr barcode
    container_id:"Container ID",
    item:"Item",
    container_pairing:"Container Pairing",
    container_not_in_list:"Container not in list",
    item_not_in_list:"Item not in list",

    




  },
  HE: {
    //login page
    enterMail: `אנא הכניס דוא''ל`,
    enterPass: `אנא הכנס סיסמא`,
    login: `התחבר`,
    signOut: `התנתק`,
    show_inventory: "הצגת מלאי",
    supplier: 'ספק',
    alerts: 'התראות',
    item_type: 'סוג מוצר',
    show_items: "צפייה במוצרים",


    //bottom bar
    home: "בית",
    inventory: "מלאי",
    orders: "הזמנות",
    profile: "פרופיל",

    //containers
    unknown_date: "תאריך לא ידוע",
    last_registred: "נרשם לאחרונה ב",
    see_full: "לצפייה בכל המלאי",
    go_to_orders: "מעבר להזמנות",
    30: "חודש שעבר",
    7: "שבוע שעבר",
    1: "יום שעבר",
    min: "מינימום",
    max: "מקסימום",
    unset:"לא נקבע",
    item_weight:"משקל מוצר",
    no_data: "אין מידע להציג",

    //notifications
    notifications: "התראות",
    just_few: "נותרו רק כמה",
    running_low: "אוזל",
    must_use: "צריך להשתמש בדחיפות",
    add_to_order: "הוסף להזמנה",
    edit_order: "ערוך הזמנה",
    kg: "ק''ג",
    lb: "פאונד",
    un: "יח'",
    looks_good: "המלאי נראה טוב",
    suggest_dish: "הצע מנה",
    serach_placeholder: "מה אתה מחפש",
    item_added: "מוצר התווסף בהצלחה",
    item_added_failed: "הוספת מוצר נכשלה",

    //category names
    fish: "דגים",
    meat: "בשר",
    vegtables: "ירקות",
    fruit: "פירות",
    dairy: "חלבי",
    dry_foods: "מאכלים יבשים",
    other: "אחר",
    and: "ו",

    //order page
    email: "דואר אלקטרוני",
    phone: "טלפון",
    whatsapp: "ווטסטאפ",
    add_item: "הוסף מוצר",
    new_item: "מוצר חדש",
    unknown: "לא ידוע",
    export_lists:"ייצא רשימה",

    //settings page
    language: "שפה",

    //messages
    page_not_found: "מתנצלים, הדף שחיפשתם לא נמצא.",
    status_code: "קוד שגיאה",

    //qr barcode
    container_id:"מזהה מיכל",
    item:"מוצר",

  }
});


//language array
export const langs = ["EN", "HE"];

//set language that is in the session Storage
var language = sessionStorage.getItem("current_language");
if (language === null) {
  language = langs[0];
}
Dictionary.setLanguage(language);

//save new language in session storage and reload page
export function changeLanguage(lang) {

  return function () {
    sessionStorage.setItem("current_language", lang);
    sessionStorage.setItem('tab_name', "SettingPage")
    window.location.reload();
  }
}
//get the current page direction needed
export function getRTL(lang) {
  let targetLang = lang ? lang : Dictionary.getLanguage();

  switch (targetLang) {
    case "EN":
      return "ltr";
    case "HE":
    default:
      return "rtl";
  }
}

export function getLeftRight(lang) {
  let targetLang = lang ? lang : Dictionary.getLanguage();

  switch (targetLang) {
    case "EN":
      return "left";
    case "HE":
    default:
      return "right";
  }
}

export function getTime() {
  let temp = Date.now()
  let now = new Date(temp)
  let date = now.getDate()
  let months = now.getMonth() + 1
  let year = now.getFullYear()
  let date_str = date + "." + months + "." + year
  return date_str
}


//sets a globe image with three language buttons 
export const LangBtn = () => {
  var currentLng = Dictionary.getLanguage();
  var HEId = "",
    ENId = "";

  if (currentLng === "EN") ENId = "chosen";
  else HEId = "chosen";
  var lang_arr = { "EN": usaFlag, "HE": israelFlag }
  return (
    <div id="languages">
      <Dropdown >

        <DropdownTrigger>
          <div id="displayAndGlobe">
            <div>
              <img src={lang_arr[Dictionary.getLanguage()]} id="globus" alt="lang" />
            </div>
          </div>
        </DropdownTrigger>

        <DropdownContent>

          <ul id="langlist">
            <li>
              <div className="flags">
                <img alt="hebrew" src={israelFlag} id={HEId} className="langButtons" onClick={changeLanguage("HE")}></img>
                <div>עברית</div>
              </div>
            </li>
            <li>
              <div className="flags">
                <img alt="usa" src={usaFlag} id={ENId} className="langButtons " onClick={changeLanguage("EN")} ></img>
                <div>English</div>
              </div>
            </li>
          </ul>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
