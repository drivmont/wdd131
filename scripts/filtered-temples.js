const menuToggle = document.getElementById('menu-toggle');
const primaryNav = document.getElementById('primary-nav');
const cardsContainer = document.getElementById('temple-cards');
const pageHeading = document.getElementById('page-heading');



const temples = [
  {
    templeName: "Aba Nigeria",
    location: "Aba, Nigeria",
    dedicated: "2005, August, 7",
    area: 11500,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
  },
  {
    templeName: "Manti Utah",
    location: "Manti, Utah, United States",
    dedicated: "1888, May, 21",
    area: 74792,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
  },
  {
    templeName: "Payson Utah",
    location: "Payson, Utah, United States",
    dedicated: "2015, June, 7",
    area: 96630,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
  },
  {
    templeName: "Yigo Guam",
    location: "Yigo, Guam",
    dedicated: "2020, May, 2",
    area: 6861,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
  },
  {
    templeName: "Washington D.C.",
    location: "Kensington, Maryland, United States",
    dedicated: "1974, November, 19",
    area: 156558,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
  },
  {
    templeName: "Lima Perú",
    location: "Lima, Perú",
    dedicated: "1986, January, 10",
    area: 9600,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
  },
  {
    templeName: "Mexico City Mexico",
    location: "Mexico City, Mexico",
    dedicated: "1983, December, 2",
    area: 116642,
    imageUrl:
    "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
  },
  {
    templeName: "Cochabamba Bolivia",
    location: "Cochabamba, Bolivia",
    dedicated: "2000, April, 30",
    area: 35500,
    imageUrl:
    "https://www.churchofjesuschrist.org/imgs/e012ebb4075dc7976a314471fc0a3b3058e37c1a/full/800%2C/0/default?lang=eng"
  },
  {
    templeName: "San Antonio Texas",
    location: "San Antonio, Texas, United States",
    dedicated: "2005, May, 22",
    area: 16800,
    imageUrl:
    "https://www.churchofjesuschrist.org/imgs/1dc0b8602087f0f95c062dd122dd45e080d25432/full/800%2C/0/default?lang=eng"
  },
  {
    templeName: "Frankfurt Germany",
    location: "Frankfurt, Germany",
    dedicated: "2019, October, 20",
    area: 32895,
    imageUrl:
    "https://www.churchofjesuschrist.org/imgs/1dc0b8602087f0f95c062dd122dd45e080d25432/full/800%2C/0/default?lang=eng"
  },  
  // Add more temple objects here...
];

menuToggle.addEventListener('click', () => {
    const isOpen = primaryNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
});


function dedicatedYear(temple) {
    return parseInt(temple.dedicated.split(',')[0], 10);
}

function createTempleCard(temple) {
    const card = document.createElement('figure');
    card.className = 'temple-card';

    card.innerHTML = `
        <img src="${temple.imageUrl}" alt="${temple.templeName}" loading="lazy" width="400" height="250">
        <figcaption>
            <h2>${temple.templeName}</h2>
            <p><span class="label">Location:</span> ${temple.location}</p>
            <p><span class="label">Dedicated:</span> ${temple.dedicated}</p>
            <p><span class="label">Area:</span> ${temple.area.toLocaleString('en-US')} sq ft</p>
        </figcaption>
    `;

    return card;
}

function renderTemples(templeArray) {
    cardsContainer.innerHTML = '';
    templeArray.forEach((temple) => {
        cardsContainer.appendChild(createTempleCard(temple));
    });
}


const filters = {
    home: () => temples,
    old: () => temples.filter((temple) => dedicatedYear(temple) < 1900),
    new: () => temples.filter((temple) => dedicatedYear(temple) > 2000),
    large: () => temples.filter((temple) => temple.area > 90000),
    small: () => temples.filter((temple) => temple.area < 10000),
};

const headings = {
    home: 'Home',
    old: 'Old Temples',
    new: 'New Temples',
    large: 'Large Temples',
    small: 'Small Temples',
};


document.querySelectorAll('#primary-nav a').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        const filterName = link.dataset.filter;

        pageHeading.textContent = headings[filterName];
        renderTemples(filters[filterName]());

        // Close the mobile menu after a selection is made
        if (primaryNav.classList.contains('open')) {
            primaryNav.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', false);
            menuToggle.innerHTML = '&#9776;';
        }
    });
});


renderTemples(filters.home());
