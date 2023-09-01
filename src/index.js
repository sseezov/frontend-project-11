import validator from './validator.js';
import { state } from './view.js';

// const schema = yup.object().shape({
//   name: yup.string().trim().required(),
//   email: yup.string().required('email must be a valid email').email(),
//   password: yup.string().required().min(6),
//   passwordConfirmation: yup.string()
//     .required('password confirmation is a required field')
//     .oneOf(
//       [yup.ref('password'), null],
//       'password confirmation does not match to password',
//     ),
// });

const input = document.querySelector('#url-input');
const submit = document.querySelector('.btn-primary')

submit.addEventListener('click', (e) => {
  e.preventDefault()
  console.log('sumbit')
})

input.addEventListener('keypress', (e) => {
  console.log('keypress')
  state.queryForm.input = input.value;
  validator(input.value).catch((err) => console.log(state.queryForm.errors = err.message));
  console.log(state.queryForm.errors);

})

