/* eslint-disable no-param-reassign */
import onChange from 'on-change';
import { renderFeeds, renderPosts } from './elementsHandlers.js';

export default (elements, state, i18nInstance) => {
  const watchedState = onChange(state, (path, error) => {
    switch (path) {
      case 'form.error':
        if (error) {
          elements.input.classList.add('is-invalid');
          elements.feedback.textContent = watchedState.form.error;
          elements.feedback.classList.remove('text-success');
          elements.feedback.classList.add('text-danger');
          break;
        } else {
          elements.input.classList.remove('is-invalid');
          elements.feedback.textContent = i18nInstance.t('successfullyLoaded');
          elements.feedback.classList.add('text-success');
          elements.feedback.classList.remove('text-danger');
          break;
        }
      case 'posts':
        renderFeeds(watchedState, elements, i18nInstance);
        renderPosts(watchedState, elements, i18nInstance);
        break;
      default:
    }
  });
  return watchedState;
};
