export default (link) => {
  const parser = new DOMParser();
  fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      const parsedData = parser.parseFromString(data.contents, 'application/xml');
      const items = parsedData.querySelectorAll('item');
      items.forEach((item) => console.log(item.querySelector('title').textContent));
    });
};
