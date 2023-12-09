import onChange from 'on-change';

export default (elements, initState, i18next) => {
  const handleForm = (state) => {
    const { form: { valid, error } } = state;
    const { input, feedback } = elements;
    if (valid) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
      feedback.classList.add('text-danger');
      feedback.textContent = i18next.t([`errors.${error}`, 'errors.unknown']);
    }
  };

  const watchedState = onChange(initState, ()=>handleForm(initState));

  return watchedState;
};

