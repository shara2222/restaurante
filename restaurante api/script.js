const form = document.getElementById('dish-form');
const list = document.getElementById('dish-list');
let dishes = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('dish-name').value;
  const origin = document.getElementById('dish-origin').value;

  const dish = { name, origin };
  dishes.push(dish);
  updateDishList();
  form.reset();
});

function updateDishList() {
  list.innerHTML = '';
  dishes.forEach((dish, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${dish.name} (${dish.origin})</span>
      <button onclick="editDish(${index})">Editar</button>
      <button onclick="deleteDish(${index})">Eliminar</button>
    `;
    list.appendChild(li);
  });
}

function deleteDish(index) {
  dishes.splice(index, 1);
  updateDishList();
}

function editDish(index) {
  const newName = prompt('Nuevo nombre del plato:', dishes[index].name);
  const newOrigin = prompt('Nuevo origen:', dishes[index].origin);
  if (newName && newOrigin) {
    dishes[index].name = newName;
    dishes[index].origin = newOrigin;
    updateDishList();
  }
}

async function loadApiDishes() {
  const container = document.getElementById('api-dishes');
  container.innerHTML = 'Cargando platos...';

  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?f=c');
    const data = await response.json();

    if (!data.meals || data.meals.length === 0) {
      container.innerHTML = 'No se encontraron platos.';
      return;
    }

    container.innerHTML = '';

    const mealsToShow = data.meals.slice(0, 10); // Solo mostrar 10

    for (const meal of mealsToShow) {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea}</p>
      `;
      container.appendChild(div);
    }
  } catch (error) {
    console.error('Error al cargar platos:', error);
    container.innerHTML = 'Error al cargar los platos. Usando datos de ejemplo...';
    loadExampleDishes();
  }
}

function loadExampleDishes() {
  const container = document.getElementById('api-dishes');
  const exampleDishes = [
    { name: 'Tacos', origin: 'México', image: 'https://www.themealdb.com/images/media/meals/qtuwxu1468233098.jpg' },
    { name: 'Sushi', origin: 'Japón', image: 'https://www.themealdb.com/images/media/meals/g046bb1663960946.jpg' },
    { name: 'Paella', origin: 'España', image: 'https://www.themealdb.com/images/media/meals/xrttsx1487339558.jpg' },
    { name: 'Couscous', origin: 'Marruecos', image: 'https://www.themealdb.com/images/media/meals/qxytrx1511304021.jpg' },
    { name: 'Pizza Margherita', origin: 'Italia', image: 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg' }
  ];

  for (const dish of exampleDishes) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}" />
      <h3>${dish.name}</h3>
      <p>${dish.origin}</p>
    `;
    container.appendChild(div);
  }
}

loadApiDishes();

document.getElementById('search-button').addEventListener('click', async () => {
  const searchTerm = document.getElementById('search-input').value.trim();
  if (searchTerm === '') return;

  const container = document.getElementById('api-dishes');
  container.innerHTML = 'Buscando...';

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();

    if (!data.meals) {
      container.innerHTML = 'No se encontraron resultados.';
      return;
    }

    container.innerHTML = '';
    data.meals.forEach(meal => {
      const div = document.createElement('div');
      div.className = 'card';
      div.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
        <h3>${meal.strMeal}</h3>
        <p>${meal.strArea}</p>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error('Error en búsqueda:', error);
    container.innerHTML = 'Error al realizar la búsqueda.';
  }
});
