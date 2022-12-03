let myForm = document.getElementById('registration-form');
let emailId = document.getElementById('emailIdInput');
let password = document.getElementById('passwordInput');
let firstName = document.getElementById('firstNameInput');
let lastName = document.getElementById('lastNameInput');
let phoneNumber = document.getElementById('phoneNumberInput');
let city = document.getElementById('cityInput');
let state = document.getElementById('stateInput');
let streetAddress = document.getElementById('streetAddressInput');
let errorDiv = document.getElementById('error');
console.log(firstName.value,"hellooo")


function checkString(strVal, varName){
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  }

function createUserValidation(firstName,lastName,password,phoneNumber){   
    // firstName validation
    if(firstName.trim().length<3){ throw "First Name should be atleast of length 3"}
    if(firstName.trim().search(/[^a-zA-Z0-9]/g) != -1){ throw "First Name should be alphanumeric"} 
    // lastName validation
    if(lastName.trim().length<2){ throw "Last Name should be atleast of length 2"}
    if(lastName.trim().search(/[^a-zA-Z0-9]/g) != -1){ throw "Last Name should be alphanumeric"}
    //password validation
    if(password.trim().length<6){ throw "Password should be atleast of length 6"}
    if(password.trim().search(/[A-Z]/g)==-1){throw "Password should contain atleast 1 uppercase character"}
    if(password.trim().search(/[0-9]/g)==-1){throw "Password should contain atleast 1 number"}
    if(password.trim().search(/[^A-Za-z0-9]/g)==-1){throw "Password should contain atleast 1 special character"}
    // phoneNumber validation
    if (!phoneNumber) throw `Error: You must supply a phoneNumber!`;
    if (typeof phoneNumber !== 'string') throw `Error: phoneNumber must be a string!`;
    phoneNumber = phoneNumber.trim();
    if (phoneNumber.length === 0)
      throw `Error: phoneNumber cannot be an empty string or string with just spaces`;
    if(phoneNumber.trim().length!=10){ throw "Phone Number should be 10 numbers"}
    if(phoneNumber.trim().search(/[^0-9]/g)!=-1){throw "Phone Number should be only numbers"}
}

if (myForm) {
    myForm.addEventListener('submit', (event) => {
      event.preventDefault();
    //   emailId
      if (emailId.value.trim()) {
        errorDiv.hidden = true;
      }
      else {
            emailId.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a email-id';
            emailId.focus();
        }
    // password
    if (password.value.trim()) {
        errorDiv.hidden = true;
      }
      else {
            password.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a password';
            password.focus();
        }
    // firstName
    if (firstName.value.trim()) {
        errorDiv.hidden = true;
      }
      else {
            firstName.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a First Name';
            firstName.focus();
        }
    // lastName
    if (lastName.value.trim()) {
        errorDiv.hidden = true;
      }
      else {
            lastName.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a Last Name';
            lastName.focus();
        }
    // phoneNumber
    if (phoneNumber.value.trim()) {
        errorDiv.hidden = true;
      }
      else {
            phoneNumber.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a Phone Number';
            phoneNumber.focus();
        }
    // city
    if (city.value.trim()) {
        errorDiv.hidden = true;
      }
      else {
            city.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a City';
            city.focus();
        }
    // state
    if (state.value.trim()) {
        errorDiv.hidden = true;
      }
      else {
            state.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a State';
            state.focus();
        }
    // streetAddress
    if (streetAddress.value.trim()) {
        errorDiv.hidden = true;
      }
      else {
            streetAddress.value = '';
            errorDiv.hidden = false;
            errorDiv.innerHTML = 'You must enter a Street Address';
            streetAddress.focus();
        }





        try{          
        firstName = checkString(firstName.value,"firstName")
        lastName = checkString(lastName.value,"lastName")
        password = checkString(password.value,"password")
        console.log(firstName.value,lastName.value,password.value,phoneNumber.value)
        createUserValidation(firstName.value,lastName.value,password.value,phoneNumber.value)

        }catch(e){
            throw e
            errorDiv.hidden = false;
            errorDiv.innerHTML = e;
        }
    })
}
