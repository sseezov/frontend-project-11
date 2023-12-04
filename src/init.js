import 'bootstrap';
import * as yup from 'yup';
import axios from 'axios';
import i18next from 'i18next';
import translation from './locales/translation.js';

const initState = {
  feeds: [],
  posts: [],
  loadingProcess: {
    status: 'idle',
    error: null,
  },
  form: {
    error: null,
    status: 'filling',
    valid: false,
  },
};

const i18nextInstance = i18next.createInstance();

  const promise = i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  }).then(() => {
    // Тексты не хранятся в стейте
    yup.setLocale(locale);
    const baseUrlSchema = yup.string().url().required();

    const validateUrl = (url, feeds) => {
      const feedUrls = feeds.map((feed) => feed.url);
      const actualUrlSchema = baseUrlSchema.notOneOf(feedUrls);
      // только асинхронные функции
      return actualUrlSchema.validate(url)
        .then(() => null)
        .catch((e) => e.message);
    };
    // Стейт прокидывается как параметр функции, как и экземпляр i18next
    const watchedState = watch(elements, initState, i18nextInstance);

    elements.form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Данные формы извлекаются через FormData
      const data = new FormData(e.target);
      const url = data.get('url');

      validateUrl(url, watchedState.feeds)
        .then((error) => {
          if (!error) {
            watchedState.form = {
              ...watchedState.form,
              valid: true,
              error: null,
            };
            loadRss(watchedState, url);
          } else {
            watchedState.form = {
              ...watchedState.form,
              valid: false,
              error: error.key,
            };
          }
        });
    });

    elements.postsBox.addEventListener('click', (evt) => {
      if (!('id' in evt.target.dataset)) {
        return;
      }

      const { id } = evt.target.dataset;
      watchedState.modal.postId = String(id);
      watchedState.ui.seenPosts.add(id);
    });

    // Только setTimeout (не setInterval), так как сеть не надежна. Надо ждать завершения.
    setTimeout(() => fetchNewPosts(watchedState), fetchingTimeout);
  });

