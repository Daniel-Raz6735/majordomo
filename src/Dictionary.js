import React from 'react';
import LocalizedStrings from 'react-localization';
import Dropdown, { DropdownContent, DropdownTrigger } from 'react-simple-dropdown';
import './Dictionary.css';
import globe from './images/globe.png';
import israelFlag from './images/icons/israel.svg';
import usaFlag from './images/icons/USA.svg';
import {base_url} from './index'


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
    show_inventory : "show inventory",
    supplier:'Supplier',
    item_type:'Item Type',

    
    
    //containers
    unknown_date : "unknown date",

    //notifications
    just_few:"Just a few left",
    running_low:"Running low",
    must_use:"Must use ASAP",
    add_to_order :"Add to order",
    suggest_dish :"Suggest Dish",
    kg:" kg",

    //inventory
    inventory:"Inventory"
    


    
    
  },
  HE: {
    //login page
    enterMail: `אנא הכניס דוא''ל`,
    enterPass: `אנא הכנס סיסמא`,
    login: `התחבר`,
    signOut: `התנתק`,
    show_inventory : "הצגת מלאי",
    supplier:'ספק',
    item_type:'סוג מוצר',


    //containers
    add_to_order :"הוסף להזמנה",
    unknown_date : "תאריך לא ידוע",
    
     //notifications
     just_few:"נותרו רק כמה",
     running_low:"אוזל",
     must_use:"צריך להשתמש בדחיפות",
     kg:" ק''ג",

     //inventory
     inventory:"מלאי"

     
    
  }});

  
//language array
export const langs = ["HE", "EN"];

//set language that is in the session Storage
var language = sessionStorage.getItem("current_language");
if (language === null) {
  language = langs[0];
}
Dictionary.setLanguage(language);

//save new language in session storage and reload page
function changeLanguage(lang) {
  return function () {
    sessionStorage.setItem("current_language", lang);
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
//sets a globe image with three language buttons 
export const LangBtn = () => {
  var currentLng = Dictionary.getLanguage();
  var HEId = "",
    ENId = "";

  if (currentLng === "EN") ENId = "chosen";
  else HEId = "chosen";

var lang_arr = {"EN":usaFlag,"HE":israelFlag} 

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
              <img src={israelFlag} id={HEId} className="langButtons" onClick={changeLanguage("HE")}></img>
              <div>עברית</div>
              </div>
            </li>
            <li>
            <div className="flags">
              <img src ={usaFlag} id={ENId} className="langButtons " onClick={changeLanguage("EN")} ></img>
              <div>English</div>
            </div>
            </li>
          </ul>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
