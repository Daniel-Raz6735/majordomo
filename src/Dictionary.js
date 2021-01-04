import React from 'react';
import LocalizedStrings from 'react-localization';
import Dropdown, { DropdownContent, DropdownTrigger } from 'react-simple-dropdown';
import './Dictionary.css';
import globe from './images/globe.png';


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
    inventory : "show inventory",
    
    
    
  },
  HE: {
    //login page
    enterMail: `אנא הכניס דוא''ל`,
    enterPass: `אנא הכנס סיסמא`,
    login: `התחבר`,
    signOut: `התנתק`,
    inventory : "הצגת מלאי"
    
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


  return (
    <div id="languages">
      <Dropdown >

        <DropdownTrigger>
          <div id="displayAndGlobe">
            <div>
              <img src={globe} id="globus" alt="lang" />
            </div>
            <div>
              <a id="currentLangDisplay">{Dictionary.getLanguage()}</a>
            </div>
          </div>
        </DropdownTrigger>

        <DropdownContent>

          <ul id="langlist">
            <li>
              <button id={HEId} className="langButtons" onClick={changeLanguage("HE")}>עברית</button>
            </li>
            <li>
              <button id={ENId} className="langButtons " onClick={changeLanguage("EN")} >English</button>
            </li>
          </ul>
        </DropdownContent>
      </Dropdown>
    </div>
  );
}
