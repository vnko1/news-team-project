const submitBtn = document.getElementById('queryBtn');
const inputField = document.querySelector('.search-input');
const form = document.getElementById('search-form');
const container = document.querySelector('.gallery > .container');
// console.log(container);

const url = 'https://api.nytimes.com/svc/search/v2/articlesearch.json';
const apiKey = '6NeZFvbRUjOlM3jxAALEHJAyoskEi5UY'; //

submitBtn.addEventListener('click', funvb);

function funvb(e) {
  e.preventDefault();

  container.innerHTML = '';

  const searchTerm = inputField.value.trim();
  if (!searchTerm) {
    alert('Please enter a search term.');
    return;
  }

  const queryParams = {
    'api-key': apiKey,
    q: searchTerm, // запит
    fl: 'web_url,section_name,lead_paragraph,pub_date,headline, multimedia,_id', // вибераємо потрібні поля
    fq: 'document_type:("article") AND type_of_material:("news")',
    sort: 'relevance', // сортування за релевантністю
  };

  const urlParams = new URLSearchParams(queryParams);
  const fullUrl = `${url}?${urlParams}`;

  //приводимо дату до потрібного формату
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0'); // додаємо нуль, якщо число менше 10
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // додаємо нуль, якщо місяць менше 10
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  fetch(fullUrl)
    .then(response => response.json())
    .then(data => {
      if (data.response.docs.length === 0) {
        const noResults = document.createElement('div');
        noResults.innerHTML = `
          <p>We haven’t found news from this category</p>
          <img width='300' src="https://klike.net/uploads/posts/2020-09/1599896421_21.jpg">

        `;
        container.appendChild(noResults);
        return;
      }

      // Відображаємо лише 8 елементів
      const slicedData = data.response.docs.slice(0, 8);

      container.innerHTML = slicedData.reduce((acc, article) => {
        const multimedia = article.multimedia.find(
          media => media.subtype === 'xlarge'
        );
        const image = multimedia
          ? `<img  src="https://www.nytimes.com/${multimedia.url}" loading="lazy" width="100%">`
          : `<img  src="https://klike.net/uploads/posts/2020-09/1599896421_21.jpg" loading="lazy" width="100%">`;

        //перевірка опису новини : якщо більше за 200 символів то обрізаємо та додаємо ''
        const infoText =
          article.lead_paragraph.length <= 200
            ? `<p class="news-card__info-text">${article.lead_paragraph}</p>`
            : `<p class="news-card__info-text">${
                article.lead_paragraph.slice(0, 200) + '...'
              }</p>`;

        const listItem = `<li class="item">
  <div class="news-card">
      <div class="news-card__img">
        <p class="news-card__theme">${article.section_name}</p>
        ${image}
        <div class="news-card__favorite">
          <input type="checkbox" class="input-favorite" id="favorite" />
          <label for="favorite" class="label-favorite">Add to favorite</label>
        </div>
      </div>
      <div class="news-card__info">
        <h2 class="news-card__info-title">${article.headline.main}</h2>
         ${infoText}
      </div>
      <div class="news-card__additional">
        <p class="news-card__date">${formatDate(article.pub_date)}</p>
        <a class="news-card__more" href="${
          article.web_url
        }" target='_blank'>Read more</a>
      </div>
    </div>
</li>`;
        return (acc += listItem);
      }, '');

      // localStorage.setItem('list', JSON.stringify(slicedData));
    })
    .catch(error => console.error(error));
  form.reset();
}
