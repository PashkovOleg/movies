<template>
  <div class="wrapper">
    <v-pagination
      class="pagination"
      v-model="page"
      color="#2196f3"
      :length="getTotal"
      :total-visible="getVisible"
      prev-icon="mdi-chevron-left"
      next-icon="mdi-chevron-right"
      @input="changePage"
    ></v-pagination>
    <div class="content">
      <div class="content__filters" data-app>
        <v-row>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              class="content_-filters-item"
              label="Title"
              v-model="filters.title"
              prepend-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-text-field
              class="content-_filters-item"
              label="Overview"
              v-model="filters.overview"
              prepend-icon="mdi-magnify"
            ></v-text-field>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-select
              class="content_-filters-item"
              :items="listLanguages"
              v-model="filters.language"
              item-text="english_name"
              item-value="iso_639_1"
              label="Original language"
              prepend-icon="mdi-web"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex" cols="12" sm="4">
            <v-menu
              ref="menuFrom"
              v-model="menuFrom"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="filters.dateFrom"
                  label="Release date from"
                  persistent-hint
                  prepend-icon="mdi-calendar-range"
                  v-mask="dateMask"
                  @blur="date = parseDate(filters.dateFrom)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                color="#2196f3"
                v-model="filters.dateFrom"
                no-title
                @input="menuFrom = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex" cols="12" sm="4">
            <v-menu
              ref="menuTo"
              v-model="menuTo"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="filters.dateTo"
                  label="Release date to"
                  persistent-hint
                  prepend-icon="mdi-calendar-range"
                  v-mask="dateMask"
                  @blur="date = parseDate(filters.dateTo)"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                color="#2196f3"
                v-model="filters.dateTo"
                no-title
                @input="menuTo = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col class="d-flex button">
            <v-btn color="#2196f3" @click="clearFilters"
              >Clear all filters</v-btn
            >
          </v-col>
        </v-row>
      </div>
      <div v-if="listMovies.length > 0" class="content__movies">
        <div
          v-for="(item, index) in getFilteredMoviesOnPage"
          :key="`movie-${index}`"
          class="content__movies-item"
          @click="openInfo(item.id)"
        >
          <img
            v-if="item.poster_path"
            class="content__movies-item-pic"
            :src="`https://image.tmdb.org/t/p/w200/${item.poster_path}`"
          />
          <p class="content__movies-item-title">{{ item.title }}</p>
        </div>
      </div>
    </div>
    <!-- При необходимости использования нескольких одинаковых пагинаторов можно будет создать отдельный компонент. -->
    <v-pagination
      class="pagination"
      v-model="page"
      color="#2196f3"
      :length="getTotal"
      :total-visible="getVisible"
      prev-icon="mdi-chevron-left"
      next-icon="mdi-chevron-right"
      @input="changePage"
    ></v-pagination>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import router from "@/router";
export default {
  name: "ListMovies",
  components: {},
  data() {
    return {
      page: 1,
      dateMask: "####-##-##",
      menuFrom: false,
      menuTo: false,
      filters: {
        title: "",
        overview: "",
        language: null,
        dateFrom: null,
        dateTo: null
      }
    };
  },
  async created() {
    const existList = this.getFilteredMovies;
    if (existList.length < 1) {
      await this.fetchLanguage();
      await this.fetchMovies();
    }
    this.page = this.currentPage;
  },
  computed: {
    ...mapState({
      listMovies: state => state.movies.movies,
      currentPage: state => state.movies.currentPage,
      listLanguages: state => state.movies.listLanguages
    }),
    ...mapGetters(["getTotalPages", "getFilteredMovies"]),
    getVisible() {
      return this.getTotalPages > 10 ? 10 : this.getTotalPages;
    },
    getTotal() {
      return Math.ceil(this.getFilteredMovies.length / 20);
    },
    getFilteredMoviesOnPage() {
      const moviesList = this.getFilteredMovies;
      let moviesListOnPage = [];
      if (moviesList.length > 0) {
        let index = this.currentPage * 20 - 20;
        const end = this.currentPage * 20;
        while (index < end && index < moviesList.length) {
          moviesListOnPage.push(moviesList[index]);
          index++;
        }
      }
      return moviesListOnPage;
    }
  },
  methods: {
    ...mapActions([
      "fetchMovies",
      "setCurrentPage",
      "fetchLanguage",
      "setCurrentMovie",
      "setFilters"
    ]),
    changePage(page) {
      this.setCurrentPage(page);
    },
    openInfo(id) {
      router.push({ path: `/movies/${id}` });
    },
    clearFilters() {
      this.$set(this, "filters", {});
    },
    parseDate(date) {
      /* необходимо сделать проверку на формат даты */
      if (!date) return null;
      if (!date.includes("/")) return;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
  },
  watch: {
    filters: {
      immediate: false,
      deep: true,
      handler: function(value) {
        this.setFilters(value);
        this.page = 1;
        this.setCurrentPage(1);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;

  .button {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    @media (max-width: 600px) {
      justify-content: center;
      margin-bottom: 30px;
    }
  }

  .pagination {
    margin-bottom: 30px;

    &:first-child {
      margin: 30px 0px;
    }
  }

  .content {
    width: 100%;
    height: 100%;
    max-width: 1100px;
    padding: 0px 25px;
    @media (max-width: 600px) {
      padding: 0px 25px;
    }

    &__filters {
      display: flex;
      flex-direction: column;

      &-item {
        margin: 0px 10px;

        &:first-child {
          margin-left: 0px;
        }
        &:last-child {
          margin-right: 0px;
        }
      }
    }

    &__movies {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      @media (max-width: 600px) {
        margin-bottom: 30px;
      }

      &-item {
        cursor: pointer;
        margin: 0px 10px 0px 0px;
        align-items: center;
        width: 100%;
        max-width: 200px;
        height: 365px;
        display: flex;
        flex-direction: column;

        @media (max-width: 600px) {
          height: 275px;
          max-width: 150px;

          &:nth-child(2n) {
            margin-right: 0px;
          }
        }

        &-pic {
          height: 300px;
          width: 200px;
          @media (max-width: 600px) {
            height: 225px;
            width: 150px;
          }
        }

        &-title {
          margin: 5px 0px;
        }
      }
    }
  }
}
</style>
