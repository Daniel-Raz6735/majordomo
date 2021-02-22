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
    show_inventory : "show inventory",
    supplier:'Supplier',
    item_type:'Item Type',
    show_items:"Show items",
    

    //bottom bar
    home:"Home",
    inventory:"Inventory",
    orders:"Orders",
    profile:"Profile",


    
    
    //containers
    unknown_date : "unknown date",

    //notifications
    just_few:"Just a few left",
    
    running_low:"Running low",
    must_use:"Must use ASAP",
    add_to_order :"Add to order",
    suggest_dish :"Suggest Dish",
    kg:" kg",
    looks_good:"Inventory looks good",
    serach_placeholder:"what are you looking for?",

    //category names
    fish:"Fish",
    meat:"Meat",
    vegtables:"Vegtables",
    fruit:"fruit",
    dairy:"Dairy",
    dry_foods:"Dry foods",
    other:"other",
    and:" &",

    
    
    


    
    
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
    show_items:"צפייה במוצרים",


    //bottom bar
    home:"בית",
    inventory:"מלאי",
    orders:"הזמנות",
    profile:"פרופיל",
    
    //containers
    add_to_order :"הוסף להזמנה",
    unknown_date : "תאריך לא ידוע",
    
    //notifications
    just_few:"נותרו רק כמה",
    running_low:"אוזל",
    must_use:"צריך להשתמש בדחיפות",
    kg:" ק''ג",
    looks_good:"המלאי נראה טוב",
    suggest_dish :"הצע מנה",
    serach_placeholder:"?מה אתה מחפש",

    //category names
    fish:"דגים",
    meat:"בשר",
    vegtables:"ירקות",
    fruit:"פירות",
    dairy:"חלבי",
    dry_foods:"מאכלים יבשים",
    other:"אחר",
    and:"ו",
    
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
              <img alt="hebrew" src={israelFlag} id={HEId} className="langButtons" onClick={changeLanguage("HE")}></img>
              <div>עברית</div>
              </div>
            </li>
            <li>
            <div className="flags">
              <img alt="usa" src ={usaFlag} id={ENId} className="langButtons " onClick={changeLanguage("EN")} ></img>
              <div>English</div>
            </div>
            </li>
          </ul>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
