import onChange from 'on-change';

const state = {
  queryForm: {
    state: 'valid',
    input: '',
    errors: []
  },
  feedlist: '',
}

const watchedState = onChange(state, (path, value) => {
  console.log(path, value)
  // if (path === 'registrationForm.state') {
  //   if (value === 'invalid') {
  //     // Отрисовка ошибок, хранящихся где-то в состоянии
  //     // watchedState.registrationForm.errors
  //   }
  // }
});
export { state, watchedState }

