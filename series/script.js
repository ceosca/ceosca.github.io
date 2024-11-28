const seriesDataUrl = 'https://ceosca.github.io/series/series.json'; // Ruta del archivo JSON
let isPlaying = false; // Estado de reproducción
let currentLanguageIndex = 0; // Índice del idioma seleccionado
let currentChapterIndex = 0; // Índice del capítulo seleccionado
let chapters = []; // Lista de capítulos cargados
let currentEnlaces = []; // Lista de enlaces del audio
let audioPlayer = document.getElementById('audio-player'); // Elemento de audio
let timeInfoInterval; // Intervalo para actualizar información del tiempo

// --------------------- Inicialización ---------------------
window.onload = loadCountriesAndSeries; // Cargar datos al iniciar

/**
 * Carga los países y series desde el JSON.
 */
function loadCountriesAndSeries() {
  fetch(seriesDataUrl)
    .then(response => response.json())
    .then(data => populateCountries(data.series))
    .catch(error => console.error('Error al cargar los datos de las series:', error));
}

/**
 * Llena el select de países basado en las series disponibles.
 * @param {Array} series - Lista de series.
 */
function populateCountries(series) {
  const countrySelect = document.getElementById('pais');
  const countries = [...new Set(series.map(serie => serie.pais_origen))].sort(); // Países únicos, ordenados
  countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
}

// --------------------- Filtros y Selecciones ---------------------

/**
 * Filtra las series según el país seleccionado.
 */
function filterSeriesByCountry() {
  const countrySelect = document.getElementById('pais');
  const selectedCountry = countrySelect.value;
  const seriesSelect = document.getElementById('serie');
  const seriesContainer = document.getElementById('series-container');

  seriesSelect.innerHTML = '<option value="">Seleccione una serie</option>';

  fetch(seriesDataUrl)
    .then(response => response.json())
    .then(data => {
      const filteredSeries = data.series.filter(serie => serie.pais_origen === selectedCountry);
      filteredSeries.sort((a, b) => a.nombre.localeCompare(b.nombre));
      populateSeriesSelect(filteredSeries, seriesSelect);
      seriesContainer.style.display = selectedCountry ? 'block' : 'none';
    })
    .catch(error => console.error('Error al filtrar series:', error));
}

/**
 * Llena el select de series con los datos filtrados.
 * @param {Array} series - Lista de series filtradas.
 * @param {HTMLElement} seriesSelect - Select de series.
 */
function populateSeriesSelect(series, seriesSelect) {
  series.forEach(serie => {
    const option = document.createElement('option');
    option.value = JSON.stringify(serie);
    option.textContent = serie.nombre;
    seriesSelect.appendChild(option);
  });
}

// --------------------- Información de la Serie ---------------------

/**
 * Muestra la información de la serie seleccionada.
 */
function updateSerieInfo() {
  const serieSelect = document.getElementById('serie');
  const selectedSerie = serieSelect.value ? JSON.parse(serieSelect.value) : null;
  const serieInfo = document.getElementById('serie-info');

  if (selectedSerie) {
    serieInfo.innerHTML = `
      <div><strong>Título:</strong> ${selectedSerie.nombre}</div>
      <div><strong>Género:</strong> ${selectedSerie.genero}</div>
      <div><strong>Año:</strong> ${selectedSerie.anio}</div>
      <div><strong>Reparto:</strong> ${selectedSerie.reparto.join(', ')}</div>
      <div><strong>País de origen:</strong> ${selectedSerie.pais_origen}</div>
      <div><strong>Episodios:</strong> ${selectedSerie.cantidad_episodios}</div>
      ${selectedSerie.sinopsis ? `<div><strong>Sinopsis:</strong> ${selectedSerie.sinopsis}</div>` : ''}
    `;
  }
}

// --------------------- Idiomas y Capítulos ---------------------

/**
 * Carga los idiomas disponibles para la serie seleccionada.
 */
function loadLanguages() {
  const serieSelect = document.getElementById('serie');
  const selectedSerie = serieSelect.value ? JSON.parse(serieSelect.value) : null;
  const languageSelect = document.getElementById('language');
  const languagesContainer = document.getElementById('languages-container');

  if (selectedSerie) {
    currentEnlaces = selectedSerie.enlaces.map(enlace => enlace.enlace);
    languageSelect.innerHTML = '';
    selectedSerie.enlaces.forEach((enlace, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = enlace.idioma;
      languageSelect.appendChild(option);
    });
    languagesContainer.style.display = 'block';
  }
}

/**
 * Carga los capítulos de la serie seleccionada.
 */
function loadChapters() {
  const serieSelect = document.getElementById('serie');
  const selectedSerie = serieSelect.value ? JSON.parse(serieSelect.value) : null;

  if (selectedSerie) {
    const chaptersSelect = document.getElementById('capitulo');
    chapters = selectedSerie.capitulos;
    chaptersSelect.innerHTML = '';
    chapters.forEach((capitulo, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = capitulo.titulo;
      chaptersSelect.appendChild(option);
    });

    audioPlayer.src = currentEnlaces[currentLanguageIndex];
    audioPlayer.load();
    updateChapterInfo();
    resetPlaybackTime();
  }
}

// --------------------- Controles de Reproducción ---------------------

/**
 * Reproduce el capítulo seleccionado.
 */
function playChapter() {
  const chapterSelect = document.getElementById('capitulo');
  currentChapterIndex = parseInt(chapterSelect.value, 10) || 0;
  audioPlayer.currentTime = chapters[currentChapterIndex].inicio / 1000;
  audioPlayer.play();
  isPlaying = true;
  updateChapterInfo();
}

/**
 * Actualiza la información del capítulo actual.
 */
function updateChapterInfo() {
  const chapterInfo = document.getElementById('chapter-info');
  const chapter = chapters[currentChapterIndex];
  chapterInfo.textContent = chapter ? `Reproduciendo: ${chapter.titulo}` : 'Capítulo no disponible';
}

/**
 * Alterna entre reproducir y pausar el audio.
 */
function togglePlayPause() {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    document.getElementById('play-pause-button').textContent = 'Reproducir';
  } else {
    audioPlayer.play();
    isPlaying = true;
    document.getElementById('play-pause-button').textContent = 'Pausar';
  }
}

// --------------------- Funciones Auxiliares ---------------------

function forward() {
  audioPlayer.currentTime += 15;
}

function backward() {
  audioPlayer.currentTime -= 15;
}

function increaseVolume() {
  audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.05);
}

function decreaseVolume() {
  audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.05);
}