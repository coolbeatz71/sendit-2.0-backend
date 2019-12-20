export const signinValidationError = [
  {
    value: 'wrong-email',
    msg: 'Please enter a valid email address',
    param: 'email',
    location: 'body',
  },
  { msg: 'The password cannot be empty', param: 'password', location: 'body', value: '' },
  {
    msg: 'The password must have at least 6 digits and contain 1 Uppercase, 1 Lowercase, 1 number',
    param: 'password',
    location: 'body',
    value: '',
  },
];

export const signupValidationError = [
  {
    value: 'firstName111',
    msg: 'The first name can only contain alphatic characters',
    param: 'firstName',
    location: 'body',
  },
  {
    value: 'lastName111',
    msg: 'The last name can only contain alphatic characters',
    param: 'lastName',
    location: 'body',
  },
  {
    value: 'wrong-email',
    msg: 'Please enter a valid email address',
    param: 'email',
    location: 'body',
  },
  { value: '', msg: 'The password cannot be empty', param: 'password', location: 'body' },
  {
    value: '',
    msg: 'The password must have at least 6 digits and contain 1 Uppercase, 1 Lowercase, 1 number',
    param: 'password',
    location: 'body',
  },
];

export const parcelValidationError = [
  { value: '', msg: 'The parcel name cannot be empty', param: 'parcelName', location: 'body' },
  { msg: 'The description cannot be empty', param: 'description', location: 'body', value: '' },
  {
    value: '',
    msg: 'The pickup location cannot be empty',
    param: 'pickupLocation',
    location: 'body',
  },
  { value: '', msg: 'The destination cannot be empty', param: 'destination', location: 'body' },
  { value: 'string', msg: 'The parcel weight must be a number', param: 'weight', location: 'body' },
];

export const updateParcelValidationError = [
  { location: 'body', msg: 'The new status cannot be empty', param: 'status', value: '' },
];

export const updateLocationValidationError = [
  {
    location: 'body',
    msg: 'The new present location cannot be empty',
    param: 'presentLocation',
    value: '',
  },
];
