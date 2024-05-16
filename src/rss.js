export const parseRss = (data) => {
  const parser = new DOMParser();
  const parsedData = parser.parseFromString(data.contents, 'application/xml');
  const posts = Array.from(parsedData.querySelectorAll('item')).map((post) => ({
    title: post.querySelector('title').textContent,
    description: post.querySelector('description').textContent,
  }));
  const title = parsedData.querySelector('title').textContent;
  const description = parsedData.querySelector('description').textContent;
  return { title, description, posts };
};

const createCard = (i18nextInstance, type) => {
  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.textContent = i18nextInstance.t(type);
  cardBody.append(cardTitle);
  card.append(cardBody);
  return card;
};

export const renderFeeds = (watchedState, elements, i18nextInstance) => {
  elements.posts.innerHTML = '';
  elements.feeds.innerHTML = '';
  const postsCard = createCard(i18nextInstance, 'posts');
  const feedsCard = createCard(i18nextInstance, 'feeds');
  const postsUl = document.createElement('ul');
  const feedsUl = document.createElement('ul');
  postsUl.classList.add('list-group', 'border-0', 'rounded-0');
  feedsUl.classList.add('list-group', 'border-0', 'rounded-0');
  elements.posts.append(postsCard, postsUl);
  elements.feeds.append(feedsCard, feedsUl);

  watchedState.feeds.forEach((feed) => {
    const feedsLi = document.createElement('li');
    feedsLi.classList.add('list-group-item', 'border-0', 'border-end-0');
    const feedsH3 = document.createElement('h3');
    feedsH3.classList.add('h6', 'm-0');
    feedsH3.textContent = feed.title;
    const feedsP = document.createElement('p');
    feedsP.classList.add('m-0', 'small', 'text-black-50');
    feedsP.textContent = feed.description;
    feedsLi.append(feedsH3, feedsP);
    feedsUl.append(feedsLi);

    feed.posts.forEach((post) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const a = document.createElement('a');
      a.classList.add('fw-bold');
      a.textContent = post.title;
      const btn = document.createElement('button');
      btn.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      btn.textContent = i18nextInstance.t('preview');
      li.append(a, btn);
      postsUl.appendChild(li);
    });
  });
};

export default (link, i18nextInstance, watchedState) => {
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      if (data.status.http_code === 404) throw new Error('noData');
      watchedState.feeds.push(parseRss(data));
    })
    .catch((err) => {
      watchedState.form.error = i18nextInstance.t(`errors.${err.message}`);
    });
};
