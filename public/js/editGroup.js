//Finding elements by its Id
let updateGroupForm = document.getElementById('updateGroupForm');
let error = document.getElementById('error');
let groupName = document.getElementById('group-name');
let category = document.getElementById('category');
let platformName = document.getElementById('platformName');
let platformEmail = document.getElementById('platformEmail');
let platformPassword = document.getElementById('platformPassword');
let groupLimit = document.getElementById('groupLimit');

// console.log(groupLimit +" JS grouplimit")
// console.log(platformEmail + "JS platformemail")

const updateGroupFormValidation = async (
groupName,
category,
platformName,
platformEmail,
platformPassword,
groupLimit
) => {

//Group name validations
if (!groupName || groupName === 'undefined') {
  throw 'You must provide a Group Name!';
}
groupName = groupName.trim();
if (groupName.length === 0) {
  throw 'Group Name cannot be an empty string or a string with just spaces';
}
if (groupName.length < 2) {
  throw 'The group name must be of atleast two characters';
}
let groupNameReg = new RegExp("^([A-Za-z]|[A-Za-z][0-9]*|[0-9]*[A-Za-z])+$");
if (!groupName.match(groupNameReg)) {
  // throw new Error('Group Name can only be Alphanumerical');
}

//Category validation
if (!category) {
  throw 'You must select a category';
}

//Platform name validations
if (!platformName || platformName === 'undefined') {
  throw 'You must provide a Platform name';
}
platformName = platformName.trim();
if (platformName.length === 0) {
  throw 'Platform name cannot be an empty string or a string with just spaces';
}
if (platformName.length < 2) {
  throw 'The platform name must be of atleast two characters';
}
let platformNameReg = new RegExp("^([A-Za-z]|[A-Za-z][0-9]*|[0-9]*[A-Za-z])+$");
if (!platformName.match(platformNameReg)) {
  // throw new Error('Platform name can only be Alphanumerical');
}

//Platform email validation
if (!platformEmail || platformEmail === 'undefined') {
  throw 'You must provide the Platform email';
}
platformEmail = platformEmail.trim();
if (platformEmail.length === 0) {
  throw 'The platform email cannot be an empty string or a string with just spaces';
}
let platformEmailReg =  new RegExp("^[a-zA-Z]+[a-zA-Z0-9_-]*@([a-zA-Z0-9]+){1}(\.[a-zA-Z0-9]+){1,2}");
if (!platformEmail.match(platformEmailReg)) {
  throw new Error('Platform email must be in a valid email format');
}

//Platform password validation
if (!platformPassword || platformPassword === 'undefined') {
  throw 'You must provide the Platform Password';
}
platformPassword = platformPassword.trim();
if (platformPassword.length === 0) {
  throw 'The platform password cannot be an empty string or a string with just spaces';
}

//Group limit validations
if (groupLimit) {
  if (groupLimit.includes(".")) {
    throw 'Decimals values are not allowed';
  }
  groupLimit = groupLimit.trim();
  if (groupLimit.length === 0)
    throw 'Group Limit cannot be an empty string or a string with just spaces';
  groupLimit = Number(groupLimit);
  if (typeof groupLimit != "number" || Number.isNaN(groupLimit))
    throw 'Group Limit must be an integer';
  if (groupLimit < 1) {
    throw 'The Group limit is atleast 1';
  }
}
    return {
      groupName,
      category,
      platformName,
      platformEmail,
      platformPassword,
      groupLimit
    };
  };

if (updateGroupForm) { 
    updateGroupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        error.hidden = true;
        let validForm;
        try {
          validForm = await updateGroupFormValidation(groupName.value, category.value, platformName.value, platformEmail.value, platformPassword.value, groupLimit.value);
        }
        catch(e) {
          error.hidden = false;
          error.innerHTML = e;
          return;
        }
        event.target.submit();
    });

}