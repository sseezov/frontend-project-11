/* eslint-disable no-param-reassign */
import onChange from 'on-change';

export default (elements, state, i18nInstance) => {
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.error':
        if (watchedState.form.error) {
          elements.input.classList.add('is-invalid');
          elements.feedback.textContent = watchedState.form.error;
          elements.feedback.classList.remove('text-success');
          elements.feedback.classList.add('text-danger');
        } else {
          elements.input.classList.remove('is-invalid');
          elements.feedback.textContent = i18nInstance.t('successfullyLoaded');
          elements.feedback.classList.add('text-success');
          elements.feedback.classList.remove('text-danger');
        }
        break;
      default:
        console.log(`invalid data: \n path: ${path} value: ${value}`);
    }
  });
  return watchedState;
};
