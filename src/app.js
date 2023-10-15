import * as yup from 'yup';
import onChange from 'on-change';
import render from './view.js';
import i18next from 'i18next';
import { setLocale } from 'yup';

i18next.init({
  debug: true,
  lng: 'ru',
  resources: {
    ru: {
      translation: {
        urlShouldBeValid: 'Ссылка должна быть валидным URL'
      }
    },
    en: {
      translation: {
        urlShouldBeValid: 'The link must be a valid URL'
      }
    }
  }
})

const validation = (url, state) => {
  const stateForm = state.form;
  const schema = yup.string().url().required().notOneOf([state.repeatUrls], `"${url}" is not allowed`);
  schema.validate(url)
    .then(() => {
      stateForm.valid = true;
      state.repeatUrls.push(url);
    })
    .catch(() => {
      stateForm.valid = false;
      stateForm.error = i18next.t('urlShouldBeValid', { lng: 'en' });
    });
};

export default () => {
  const container = {
    form: document.querySelector('form'),
    input: document.querySelector('input'),
    feedback: document.querySelector('.feedback'),
  };

  // model
  const initialState = {
    repeatUrls: [],
    form: {
      valid: true,
      error: '',
    },
  };

  const watchedState = onChange(initialState, (path) => {
    switch (path) {
      case 'form.valid':
        render(watchedState, container);
        break;
      case 'repeatUrls':
        render(watchedState, container);
        break;
      case 'form.error':
        render(watchedState, container);
        break;
      default:
        throw new Error(`${path} is a wrong path`);
    }
  });

  // control
  container.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const repeatUrls = formData.get('url');
    validation(repeatUrls, watchedState);
    container.form.reset();
    container.input.focus();
  });
};