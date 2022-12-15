let myForm = document.getElementById("editUser-form");
let emailId = document.getElementById("emailIdInput");
let firstName = document.getElementById("firstNameInput");
let lastName = document.getElementById("lastNameInput");
let gender = document.getElementById("genderInput");
let phoneNumber = document.getElementById("phoneNumberInput");
let city = document.getElementById("cityInput");
let state = document.getElementById("stateInput");
let streetAddress = document.getElementById("streetAddressInput");
let ott = document.getElementById("interestedOTT");
let musicStreaming = document.getElementById("interestedMusicStreaming");
let networkServiceProviders = document.getElementById(
  "interestedNetworkServiceProviders"
);
let education = document.getElementById("interestedEducation");
let eCommerce = document.getElementById("interestedECommerce");
let other = document.getElementById("interestedOther");
let errorDiv = document.getElementById("error");
errorDiv.innerHTML = "";

function checkString(strVal, varName) {
  if (!strVal) throw `Error: You must supply a ${varName}!`;
  if (typeof strVal !== "string") throw `Error: ${varName} must be a string!`;
  strVal = strVal.trim();
  if (strVal.length === 0)
    throw `Error: ${varName} cannot be an empty string or string with just spaces`;
  if (!isNaN(strVal))
    throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
  return strVal;
}

function editUserValidation(
  emailId,
  firstName,
  lastName,
  phoneNumber,
  ott,
  musicStreaming,
  networkServiceProviders,
  education,
  eCommerce,
  other,
  gender
) {
  // Email-id Validation
  if (emailId.trim().length < 4) {
    throw "Enter a valid length email-id";
  }
  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(emailId.trim())) {
    throw "Enter a valid email-id";
  }
  // firstName validation
  if (firstName.trim().length < 3) {
    throw "First Name should be atleast of length 3";
  }
  if (firstName.trim().search(/[^a-zA-Z0-9]/g) != -1) {
    throw "First Name should be alphanumeric";
  }
  // lastName validation
  if (lastName.trim().length < 2) {
    throw "Last Name should be atleast of length 2";
  }
  if (lastName.trim().search(/[^a-zA-Z0-9]/g) != -1) {
    throw "Last Name should be alphanumeric";
  }
  // phoneNumber validation
  if (!phoneNumber) throw `Error: You must supply a phoneNumber!`;
  if (typeof phoneNumber !== "string")
    throw `Error: phoneNumber must be a string!`;
  phoneNumber = phoneNumber.trim();
  if (phoneNumber.length === 0)
    throw `Error: phoneNumber cannot be an empty string or string with just spaces`;
  if (phoneNumber.trim().length != 10) {
    throw "Phone Number should be 10 numbers";
  }
  if (phoneNumber.trim().search(/[^0-9]/g) != -1) {
    throw "Phone Number should be only numbers";
  }
  // Gender Validation
  let validGenderList = ["Male", "Female", "Other"];
  let validGender = false;
  for (let i in validGenderList) {
    if (validGenderList[i] == gender) {
      validGender = true;
      break;
    }
  }
  if (validGender == false) {
    throw "Select a valid gender";
  }
  //interestedIn validation
  if (ott != "OTT") {
    throw "Select valid OTT choice from checkbox for Interested-in categories";
  }
  if (musicStreaming != "Music Streaming") {
    throw "Select valid Music Streaming choice from checkbox for Interested-in categories";
  }
  if (networkServiceProviders != "Network Service Providers") {
    throw "Select valid Network Service Providers choice from checkbox for Interested-in categories";
  }
  if (education != "Education") {
    throw "Select valid Education choice from checkbox for Interested-in categories";
  }
  if (eCommerce != "E-Commerce") {
    throw "Select valid E-Commerce choice from checkbox for Interested-in categories";
  }
  if (other != "Other") {
    throw "Select valid Other choice from checkbox for Interested-in categories";
  }
}

if (myForm) {
  myForm.addEventListener("submit", (event) => {
    event.preventDefault();
    emailId = document.getElementById("emailIdInput");
    firstName = document.getElementById("firstNameInput");
    lastName = document.getElementById("lastNameInput");
    gender = document.getElementById("genderInput");
    phoneNumber = document.getElementById("phoneNumberInput");
    city = document.getElementById("cityInput");
    state = document.getElementById("stateInput");
    streetAddress = document.getElementById("streetAddressInput");
    ott = document.getElementById("interestedOTT");
    musicStreaming = document.getElementById("interestedMusicStreaming");
    networkServiceProviders = document.getElementById(
      "interestedNetworkServiceProviders"
    );
    education = document.getElementById("interestedEducation");
    eCommerce = document.getElementById("interestedECommerce");
    other = document.getElementById("interestedOther");
    errorDiv = document.getElementById("error");
    errorDiv.innerHTML = "";
    //   emailId
    if (emailId.value.trim()) {
      errorDiv.hidden = true;
    } else {
      emailId.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a email-id";
      emailId.focus();
    }
    // firstName
    if (firstName.value.trim()) {
      errorDiv.hidden = true;
    } else {
      firstName.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a First Name";
      firstName.focus();
    }
    // lastName
    if (lastName.value.trim()) {
      errorDiv.hidden = true;
    } else {
      lastName.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a Last Name";
      lastName.focus();
    }
    // city
    console.log(city.value.trim(), "in here");

    if (city.value.trim()) {
      errorDiv.hidden = true;
    } else {
      console.log(city.value.trim(), "in here");
      city.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a City";
      city.focus();
    }
    // state
    if (state.value.trim()) {
      errorDiv.hidden = true;
    } else {
      state.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a State";
      state.focus();
    }
    // streetAddress
    if (streetAddress.value.trim()) {
      errorDiv.hidden = true;
    } else {
      streetAddress.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a Street Address";
      streetAddress.focus();
    }
    // phoneNumber
    if (phoneNumber.value.trim()) {
      errorDiv.hidden = true;
    } else {
      phoneNumber.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a Phone Number";
      phoneNumber.focus();
    }
    try {
      emailId = checkString(emailId.value, "emailId");
      firstName = checkString(firstName.value, "firstName");
      lastName = checkString(lastName.value, "lastName");
      phoneNumber = phoneNumber.value;
      if (ott.value) {
        ott = checkString(ott.value, "OTTString");
      }
      if (musicStreaming.value) {
        musicStreaming = checkString(
          musicStreaming.value,
          "musicStreamingString"
        );
      }
      if (networkServiceProviders.value) {
        networkServiceProviders = checkString(
          networkServiceProviders.value,
          "networkServiceProvidersString"
        );
      }
      if (education.value) {
        education = checkString(education.value, "EducationString");
      }
      if (eCommerce.value) {
        eCommerce = checkString(eCommerce.value, "eCommerceString");
      }
      if (other.value) {
        other = checkString(other.value, "otherString");
      }
      gender = checkString(gender.value, "genderString");
      editUserValidation(
        emailId,
        firstName,
        lastName,
        phoneNumber,
        ott,
        musicStreaming,
        networkServiceProviders,
        education,
        eCommerce,
        other,
        gender
      );
    } catch (e) {
      errorDiv.hidden = false;
      errorDiv.innerHTML = e;
    }
    if (errorDiv.innerHTML == "") {
      event.target.submit();
    }
  });
}
