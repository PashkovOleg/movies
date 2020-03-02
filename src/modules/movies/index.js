import Axios from "axios";

const SET_MOVIES = "SET_MOVIES";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const SET_LIST_LANGUAGES = "SET_LIST_LANGUAGES";
const SET_CURRENT_MOVIE = "SET_CURRENT_MOVIE";
const SET_FILTERS = "SET_FILTERS";

export default {
  state: {
    movies: [],
    listLanguages: [],
    currentPage: 1,
    currentMovie: {},
    filters: {
      title: "",
      overview: "",
      language: null,
      dateFrom: null,
      dateTo: null
    }
  },
  getters: {
    getTotalPages: state => {
      const list = state.movies;
      const count = Math.ceil(list.length / 20);
      return count;
    },
    getMoviesOnPage: state => {
      let index = state.currentPage * 20 - 20;
      const end = state.currentPage * 20;
      let arr = [];
      while (index < end) {
        arr.push(state.movies[index]);
        index++;
      }
      return arr;
    },
    getFilteredMovies: state => {
      const title = state.filters.title;
      const overview = state.filters.overview;
      const language = state.filters.language;
      const dateFrom = state.filters.dateFrom;
      const dateTo = state.filters.dateTo;
      let moviesList = state.movies;
      if (title) {
        moviesList = moviesList.filter(item =>
          item.title.toLowerCase().includes(title.toLowerCase())
        );
      }
      if (overview) {
        moviesList = moviesList.filter(item =>
          item.overview.toLowerCase().includes(overview.toLowerCase())
        );
      }
      if (language) {
        moviesList = moviesList.filter(
          item => item.original_language === language
        );
      }
      if (dateFrom) {
        moviesList = moviesList.filter(item => item.release_date >= dateFrom);
      }
      if (dateTo) {
        moviesList = moviesList.filter(item => item.release_date <= dateTo);
      }
      return moviesList;
    }
  },
  actions: {
    async fetchMovies({ commit }) {
      let i = 1;
      let arrAxios = [];
      while (i <= process.env.VUE_APP_TOTAL_PAGES) {
        arrAxios.push(
          Axios.get(
            `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.VUE_APP_API_KEY}&language=en-US&page=${i}`
          )
        );
        i++;
      }
      let arrMovies = [];
      await Axios.all(arrAxios).then(
        Axios.spread(function(...args) {
          args.forEach(
            item => (arrMovies = [...arrMovies, ...item.data.results])
          );
        })
      );
      commit(SET_MOVIES, arrMovies);
    },
    async fetchLanguage({ commit }) {
      const { data } = await Axios.get(
        `https://api.themoviedb.org/3/configuration/languages?api_key=${process.env.VUE_APP_API_KEY}`
      );
      commit(SET_LIST_LANGUAGES, data);
    },
    setCurrentPage({ commit }, data) {
      commit(SET_CURRENT_PAGE, data);
    },
    async setCurrentMovie({ commit }, id) {
      const { data } = await Axios.get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.VUE_APP_API_KEY}&language=en-US&`
      );
      commit(SET_CURRENT_MOVIE, data);
    },
    setFilters({ commit }, data) {
      commit(SET_FILTERS, data);
    }
  },
  mutations: {
    [SET_MOVIES](state, data) {
      state.movies = [...data];
    },
    [SET_LIST_LANGUAGES](state, data) {
      let arrLang = [...data];
      arrLang.sort((a, b) => {
        return a.english_name == b.english_name
          ? 0
          : +(a.english_name > b.english_name) || -1;
      });
      state.listLanguages = [...arrLang];
    },
    [SET_CURRENT_PAGE](state, value) {
      state.currentPage = value;
    },
    [SET_CURRENT_MOVIE](state, data) {
      state.currentMovie = { ...data };
    },
    [SET_FILTERS](state, data) {
      state.filters = { ...data };
    }
  }
};
