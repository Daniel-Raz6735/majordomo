import React from 'react';
import LocalizedStrings from 'react-localization';
import Dropdown, { DropdownContent, DropdownTrigger } from 'react-simple-dropdown';
import './Dictionary.css'


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
    userDoesntExists: `Permission denied`,
    logOutSuccessful: `User successfully logged out`,


    //admin page
    adminAddWoman: 'Add Woman',
    adminEditWoman: 'Edit Woman',
    adminFeedback: 'Watch Feedback',
    adminEditAbout: 'Edit About',
    adminAddCategory: 'Add Category',
    adminUserManagement: 'Users Management',
    welcomeManager: `Welcome to the management platform`,
    manageCategory: `Manage Category`,
    addUserBtn: `Add User`,
    userAddedSuccefully: `New User Added Succefully`,
    homePageBack: `Home Page`,
    signOut: `Sign out`,
    admin: `Admin`,
    feedbackTitle: 'Feedbacks',
    didYouKnowTitle: 'Facts',
    usersTitle: 'Users',
    categoriesTitle: 'Categories',
    suggest_womenTitle: 'Suggest Women',
    manageOffers: 'Manage Suggestions',
    HE: `The form was uploaded to the Hebrew tab`,
    AR: `The form was uploaded to the Arabic tab`,
    EN: `The form was uploaded to the English tab`,
    backedUpSuccessfully: "was backed up successfully",
    women: "Women",
    backupWomen: "Create Backup for women",
    backupdidYouKnow: "Create Backup for did you know",
    noFactToAdd:"No fact to add",
    


    //woman page
    edit: 'Edit',
    Previous: `Previous`,

    //main user page
    about: `Na'amat is a Movement for the advancement of the Status of Women and the Social Force for women in Israel. Na'amat’s top priority is to advance and strengthen the status of women in the family and in the work force. Na'amat is striving to achieve equality between the sexes and full participation of women in social, economic and political spheres. Na'amat, previously called Moetzet Hapoalot (Council of Working Women), was established in 1921 by young working women, pioneers who came to Palestine in the early 1920’s. Moetzet Hapoalot was organized as an autonomous movement with affiliation to the Histadrut (The General Federation of Labor). Today Na'amat is a non-profit organization, a socio-political, multi-party women’s movement comprised of women from diverse sectors of the population, communities, countries of origin and religious streams.`,
    aboutTitle: "About Na'amat",
    feedback: `Visit feedback`,
    categories: `Categories`,
    search: `Search`,
    addWoman: `Add woman`,
    addcategory: `Add category`,

    //forms
    name: `Full Name`,
    yourName:"Your name",
    display: "display name",
    birth: `Date of birth`,
    submit: `Submit`,
    death: `Date of death`,
    highlights: `Highlights`,
    biography: `Biography`,
    quotes: `Quotes and notable works`,
    history: `History`,
    feminism: `Contribution to feminism`,
    facts: `Interesting facts / stories`,
    media: `Media:`,
    upload: `Upload`,
    chooseFile: `Choose file`,
    HowWasVisit: `How was your visit?`,
    seggestions: `Seggestions for improvament`,
    close: `Close`,
    profilepic: 'Profile Picture',
    anotherpictures: 'More photos',
    mustfilled: ' required field *',
    delete: `Delete`,
    next: 'Next',
    suggest: `Did not find who you were looking for? Suggested a woman`,
    popup: 'Please fill all details',
    editExistVal: 'Do you want to edit exist value?',
    action: `Action`,
    nothingToShow: "Nothing to show",
    deletedSuccessfully: "Deleted successfully",
    addMore: "Add more",
    bibliography: "Further reading",
    description: "Description",
    link: "Link",
    links: "Links",
    categoryInputHE: "Enter a category name in Hebrew",
    categoryInputEN: "Enter a category name in English",
    categoryInputAR: "Enter a category name in Arabic",
    moreText: "Accompanying text",
    searchSummary: "Here will be initial information that will appear in the search, up to 170 characters can be typed",
    summary: "Search summary",
    fillLinkDescription: "Please enter a description and a link",
    enterScore: "Please rate your visit",
    addBibiloraphy: "Please enter a bibliography",
    isAdmin: "Admin user",
    choseCategory: "Please mark the relevent categories",
    summeryHighlight: "This summary will appear in photo carousel and categories",
    didYouKnow: 'Did You Know?',
    AddNewFact: 'Add new Fact',
    language: 'language',
    FactAddedSuccefully: 'Fact added succefully',
    langs: 'Here will be shown all the facts in system language',
    createdAt: "Date",
    iAgree: "I allow Naamat to send me messages",
    addEngFact: "Add a fact in English",
    addHebFact: "Add a fact in Hebrew",
    addArFact: "Add a fact in Arabic",
    addEngDesc: "Add a description in English",
    addHebDesc: "Add a description in Hebrew",
    addArDesc: "Add a description in Arabic",
    uploadProfileImage:"Please Choose a profile photo and then press upload",
    uploadMultiImage:"Please Choose photos of this woman to add",
    thereAre:"There are ",
    photosWating:" photos waiting for upload",
    photoWating:"There is one photo waiting for upload.",
    

    
    




    ImportantMSG: 'Note that after pressing the "Next" button you will not be able to change the required fields',
    acceptFiles: "accept only image files",
    mustUpload: "please upload profile picture",
    furtherReading: "further reading",
    enterDescription: "Enter a description",

    //components
    builders: `This site was built by: Shlomo Carmi, Daniel Raz, Sahar Cohen, Adiel Tsayag, Matan Yamin`,
    managmentPlatform: 'Managment Platform',
    NaamatInFacebook: 'Naamat in Facebook',
    NaamatInYoutube: 'Naamat in Youtube',
    email: 'Email',
    back: 'back',
    areYouSure: 'Are you sure?',
    error: 'Error',
    uploadSuccess: 'File Uploaded successfully',
    score: 'score',
    improvement: 'improvement',

  },
  HE: {
    //login page
    enterMail: `אנא הכניס דוא''ל`,
    enterPass: `אנא הכנס סיסמא`,
    login: `התחבר`,
    userDoesntExists: `גישה נדחתה`,
    logOutSuccessful: `משתמשת התנתקה בהצלחה`,


    //admin page
    adminAddWoman: 'הוסיפי אישה',
    adminEditWoman: 'ערכי אישה',
    adminFeedback: 'צפייה במשובים',
    adminEditAbout: 'עריכת אודות',
    adminAddCategory: 'הוסיפי קטגוריה',
    adminUserManagement: 'ניהול משתמשים',
    welcomeManager: `ברוכים הבאים למערכת הניהול`,
    manageCategory: `ניהול קטגוריות`,
    addUserBtn: `הוסיפי משתמש`,
    userAddedSuccefully: `משתמש חדש נוסף בהצלחה`,
    homePageBack: `עמוד הבית`,
    signOut: `התנתק`,
    admin: `מנהל`,
    feedbackTitle: 'משובים',
    didYouKnowTitle: 'עובדות',
    usersTitle: 'משתמשים',
    categoriesTitle: 'קטגוריות',
    suggest_womenTitle: 'נשים מוצעות',
    manageOffers: 'ניהול הצעות להוספה',
    backedUpSuccessfully: "גובה בהצלחה",
    women: "נשים",
    backupWomen: "צרי גיבוי לנשים",
    backupdidYouKnow: "צרי גיבוי להידעת",
    noFactToAdd:"אין עובדה להוסיף",


    //woman page
    edit: 'ערכי',
    Previous: `הקודם`,
    //main user page
    about: `נעמת היא תנועה לקידום מעמד האישה והכוח החברתי לנשים. העדיפות העליונה של נעמת היא קידום וחיזוק מעמד האישה במשפחה ובכוח העבודה. נעמת שואפת להשיג שוויון בין המינים והשתתפות מלאה של נשים בתחומים חברתיים, כלכליים ופוליטיים. נעמת, שכונתה בעבר "מועצת הנשים העובדות", הוקמה בשנת 1921 על ידי נשים עובדות, חלוצות שהגיעו לארץ ישראל בראשית שנות העשרים. מוצת הפועלות הייתה מאורגנת כתנועה אוטונומית עם שיוך להסתדרות (הסתדרות העובדים הכללית). כיום נעמת היא ארגון ללא מטרות רווח, תנועת נשים סוציו-פוליטית ורב-מפלגתית המורכבת מנשים ממגזרים שונים באוכלוסייה, קהילות, ארצות מוצא וזרמים דתיים.`,
    aboutTitle: `אודות נעמת`,
    feedback: ` משוב ביקור`,
    categories: `קטגוריות`,
    search: `חיפוש`,
    addWoman: `הוסיפי אישה`,
    addcategory: `הוסיפי קטגוריה`,
    HE: `הטופס עלה ללשונית עברית`,
    AR: `הטופס עלה ללשונית ערבית`,
    EN: `הטופס עלה ללשונית אנגלית`,

    //forms
    name: `שם מלא`,
    yourName:"שמך",
    display: "שם תצוגה",
    birth: `תאריך לידה`,
    submit: `שלחי`,
    death: `תאריך פטירה`,
    highlights: `תקציר`,
    biography: `ביוגרפיה`,
    quotes: `ציטוטים ויצירות בולטות`,
    history: `היסטוריה`,
    feminism: `תרומה לפמיניזם`,
    facts: `עובדות / סיפורים מעניינים`,
    media: `מדיה: `,
    upload: `העלי`,
    chooseFile: `בחרי קובץ`,
    HowWasVisit: `איך היה הביקור שלך?`,
    seggestions: `הצעות לשיפור`,
    close: `סגרי`,
    profilepic: 'תמונת פרופיל',
    anotherpictures: 'תמונות נוספות',
    mustfilled: '* שדות חובה',
    delete: `מחקי`,
    next: 'הבא',
    suggest: `לא מצאת את מי שחיפשת? הציעי אישה`,
    action: `פעולה`,
    nothingToShow: "אין אישה להציג",
    deletedSuccessfully: "נמחק בהצלחה",
    bibliography: "ביבליוגרפיה",
    description: "תיאור",
    link: "קישור",
    links: "קישורים",
    categoryInputHE: "הכנסי שם קטגוריה בעברית",
    categoryInputEN: "הכנסי שם קטגוריה באנגלית",
    categoryInputAR: "הכנסי שם קטגוריה בערבית",
    moreText: "מלל נלווה",
    searchSummary: "כאן יהיה מידע ראשוני שיופיע בחיפוש , ניתן להקליד עד 170 תווים",
    summary: "תקציר לחיפוש",
    fillLinkDescription: "בבקשה הכנסי תיאור וקישור",
    enterScore: "אנא דרגי את ביקורך",
    addBibiloraphy: "אנא הכניסי ביבילוגרפיה",
    isAdmin: "משתמש מנהל",
    choseCategory: "אנא סמני את הקטגוריות הרלוונטיות",
    iAgree: "אני מאשרת קבלת הודעות מאת נעמת",
    addEngFact: "הוסיפי עובדה באנגלית",
    addHebFact: "הוסיפי עובדה בעברית",
    addArFact: "הוסיפי עובדה בערבית",
    addEngDesc: "הוסיפי תיאור באנגלית",
    addHebDesc: "הוסיפי תיאור בעברית",
    addArDesc: "הוסיפי תיאור בערבית",
    uploadProfileImage:"אנא בחרי תמונת פרופיל ואז לחצי על העלאה",
    uploadMultiImage:"אנא בחרי תמונות של אישה זו להוסיף",
    thereAre:"ישנם ",
    photosWating:" תמונות שממתינות להעלאה.",
    photoWating:"ישנה תמונה אחת שממתינה להעלאה",
    


    



    acceptFiles: "מקבל קבצי תמונות בלבד",
    summeryHighlight: "תקציר זה יופיע בקרוסלת התמונות ובקטגוריות",
    mustUpload: "אנא העלי תמונת פרופיל",
    didYouKnow: 'הידעת ?',
    AddNewFact: 'הוסיפי עובדה חדשה',
    language: 'שפה',
    FactAddedSuccefully: 'עובדה הועלתה בהצלחה',
    langs: 'כאן יופיעו כל העובדות בשפת המערכת',
    createdAt: "תאריך",
    furtherReading: "לקריאה נוספת",
    enterDescription: "הזיני תיאור",

    //components
    builders: 'אתר זה נבנה על ידי: שלמה כרמי, דניאל רז, סהר כהן, עדיאל צייג, מתן ימין ©',
    CategoryName: 'שם קטגוריה',
    managmentPlatform: 'ממשק ניהול',
    NaamatInFacebook: 'נעמת בפייסבוק',
    NaamatInYoutube: 'נעמת ביוטיוב',
    email: 'דואר אלקטרוני',
    back: 'חזרי',
    areYouSure: 'האם את בטוחה?',
    error: 'שגיאה',
    uploadSuccess: 'ההעלאה הסתיימה בהצלחה',
    popup: ' מלאי בבקשה את פרטי החובה',
    editExistVal: 'האם תרצי לערוך ערך קיים?',
    score: 'דירוג',
    improvement: 'הצעות לשיפור',
    addMore: "הוסיפי עוד",
    ImportantMSG: 'שימי לב, לאחר לחיצה על כפתור "הבא" לא תוכלי לשנות את שדות החובה',



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
            {/* <div>
              <img src={globe} id="globus" alt="lang" />
            </div> */}
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
