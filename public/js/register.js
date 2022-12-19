let myForm = document.getElementById("registration-form");
let emailId = document.getElementById("emailIdInput");
let password = document.getElementById("passwordInput");
let rePassword = document.getElementById("rePasswordInput");
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

function createUserValidation(
  emailId,
  firstName,
  lastName,
  password,
  rePassword,
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
    throw "emailId should be atleast of length 4";
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
  //password validation
  if (password.trim().length < 6) {
    throw "Password should be atleast of length 6";
  }
  if (password.trim().search(/[A-Z]/g) == -1) {
    throw "Password should contain atleast 1 uppercase character, 1 number and 1 special character";
  }
  if (password.trim().search(/[0-9]/g) == -1) {
    throw "Password should contain atleast 1 uppercase character, 1 number and 1 special character";
  }
  if (password.trim().search(/[^A-Za-z0-9]/g) == -1) {
    throw "Password should contain atleast 1 uppercase character, 1 number and 1 special character";
  }
  // Re-Password Validation
  if (rePassword.trim() != password.trim()) {
    throw "Re-entered pasword should match initial password";
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
    password = document.getElementById("passwordInput");
    rePassword = document.getElementById("rePasswordInput");
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
      return;
    }
    // password
    if (password.value.trim()) {
      errorDiv.hidden = true;
    } else {
      password.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a password";
      password.focus();
      return;
    }
    // firstName
    if (firstName.value.trim()) {
      errorDiv.hidden = true;
    } else {
      firstName.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a First Name";
      firstName.focus();
      return;
    }
    // lastName
    if (lastName.value.trim()) {
      errorDiv.hidden = true;
    } else {
      lastName.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a Last Name";
      lastName.focus();
      return;
    }
    // city
    if (city.value.trim()) {
      errorDiv.hidden = true;
    } else {
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
      return;
    }
    // streetAddress
    if (streetAddress.value.trim()) {
      errorDiv.hidden = true;
    } else {
      streetAddress.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a Street Address";
      streetAddress.focus();
      return;
    }
    // phoneNumber
    if (phoneNumber.value.trim()) {
      errorDiv.hidden = true;
    } else {
      phoneNumber.value = "";
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a Phone Number";
      phoneNumber.focus();
      return;
    }
    try {
      emailId = checkString(emailId.value, "emailId");
      firstName = checkString(firstName.value, "firstName");
      lastName = checkString(lastName.value, "lastName");
      password = checkString(password.value, "password");
      rePassword = checkString(rePassword.value, "re-enteredPassword");
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
      createUserValidation(
        emailId,
        firstName,
        lastName,
        password,
        rePassword,
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
      return;
    }
    if (errorDiv.innerHTML == "") {
      event.target.submit();
    }
  });
}
