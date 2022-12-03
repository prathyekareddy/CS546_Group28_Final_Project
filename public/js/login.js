let myForm = document.getElementById('login-form');
let emailId = document.getElementById('emailIdInput');
let password = document.getElementById('passwordInput');

function checkString(strVal, varName) {
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
      throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    if (!isNaN(strVal))
      throw `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`;
    return strVal;
  }

function checkUserValidation(emailId,password){
    // emailId validation
    if(emailId.trim().length<4){ throw "emailId should be atleast of length 4"}
    if(emailId.trim().search(/[^a-zA-Z0-9]/g) != -1){ throw "emailId should be alphanumeric"}
    //password validation
    if(password.trim().length<6){ throw "Password should be atleast of length 4"}
    if(password.trim().search(/[A-Z]/g)==-1){throw "Password should contain atleast 1 uppercase character"}
    if(password.trim().search(/[0-9]/g)==-1){throw "Password should contain atleast 1 number"}
    if(password.trim().search(/[^A-Za-z0-9]/g)==-1){throw "Password should contain atleast 1 special character"}
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
    
    try{          
        emailId = checkString(emailId.value,"username")    
        password = checkString(password.value,"password")
        checkUserValidation(emailId.value,password.value)
        }catch(e){
            errorDiv.hidden = false;
            errorDiv.innerHTML = e;
        }
    })
}