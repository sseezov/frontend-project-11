/* eslint-disable no-param-reassign */
import _ from 'lodash';

export const parseRss = (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data.contents, 'application/xml');
  const posts = Array.from(parsedData.querySelectorAll('item'))
    .map((post) => ({
      title: post.querySelector('title').textContent,
      description: post.querySelector('description').textContent,
      href: post.querySelector('link').textContent,
      id: _.uniqueId(),
    }));
  if (posts.length === 0) {
    throw new Error('noData');
  }
  const title = parsedData.querySelector('title').textContent;
  const description = parsedData.querySelector('description').textContent;
  return { title, description, posts };
};

export default (link, i18nextInstance, watchedState) => {
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('networkError');
    })
    .then((data) => {
      const { title, description, posts } = parseRss(data);
      watchedState.feeds.push({ title, description });
      watchedState.posts = watchedState.posts.concat(posts);
      watchedState.form.error = null;
    })
    .catch((err) => {
      watchedState.form.error = i18nextInstance.t(`errors.${err.message}`);
    });
};
