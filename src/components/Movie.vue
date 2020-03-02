<template>
  <div class="wrapper">
    <div class="content">
      <div class="content__poster">
        <img
          v-if="currentMovie.poster_path"
          class="content__poster-img"
          :src="`https://image.tmdb.org/t/p/w200/${currentMovie.poster_path}`"
        />
        <router-link class="content__poster-link" to="/movies" exact>Back</router-link>
        <!-- <a href="" class="content-poster-link" @click="back">Back</a> -->
      </div>
      <div class="content__info">
        <div class="content__info-row">
          <span class="content__info-title">Title:</span>
          <span>{{ currentMovie.title }}</span>
        </div>
        <div class="content__info-row">
          <span class="content__info-title">Homepage:</span>
          <a
            class="content__info-link"
            :href="currentMovie.homepage"
            target="_blank"
          >{{ currentMovie.homepage }}</a>
        </div>
        <div class="content__info-row">
          <span class="content__info-title">Overview:</span>
          <span>{{ currentMovie.overview }}</span>
        </div>
        <div class="content-info-row">
          <span class="content__info-title">Release date:</span>
          <span>{{ currentMovie.release_date }}</span>
        </div>
        <div class="content__info-row">
          <span class="content__info-title">Production companies:</span>
          <div class="content__info-companies">
            <div
              class="content__info-companies__item"
              v-for="(item, index) in currentMovie.production_companies"
              :key="`company-${index}`"
            >
              <p class="content__info-companies__item-title">{{ item.name }}</p>
              <img
                class="content__info-companies__item-logo"
                v-if="item.logo_path"
                :src="`https://image.tmdb.org/t/p/w200/${item.logo_path}`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import router from "@/router";
export default {
  name: "Movie",
  async created() {
    await this.setCurrentMovie(this.$route.params.id);
  },
  computed: {
    ...mapState({
      currentMovie: state => state.movies.currentMovie,
      listMovies: state => state.movies.movies,
      currentPage: state => state.movies.currentPage
    })
  },
  methods: {
    ...mapActions(["setCurrentMovie"]),
    back() {
      router.push({ path: `/movies/` });
    }
  }
};
</script>
<style scoped lang="scss">
.wrapper {
  display: flex;
  padding: 20px 45px;
  width: 100%;
  height: 100%;

  .content {
    display: flex;
    font-size: 16px;

    @media (max-width: 600px) {
      flex-direction: column;
    }

    &__poster {
      display: flex;
      flex-direction: column;

      @media (max-width: 600px) {
        align-items: center;
      }

      &-img {
        @media (max-width: 600px) {
          max-width: 300px;
        }
      }

      &-link {
        @media (max-width: 600px) {
          margin: 5px 0px;
        }

        &:hover {
          color: $c--blue;
        }
      }
    }

    &__info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      margin-left: 10px;

      @media (max-width: 600px) {
        margin-left: 0px;
      }

      &-companies {
        display: flex;
        flex-wrap: wrap;

        @media (max-width: 600px) {
          justify-content: center;
          margin-top: 10px;
        }

        &__item {
          width: 220px;
          height: 170px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-right: 10px;
          margin-bottom: 10px;
          box-sizing: border-box;
          border: 1px solid $c--black;
          border-radius: 5px;
          padding: 5px;

          &-title {
            margin-bottom: 5px;
            text-align: center;
          }

          &-logo {
            width: 200px;
            height: 120px;
          }
        }
      }

      &-row {
        margin-bottom: 5px;
      }

      &-title {
        font-size: 18px;
        font-weight: 500;
        margin-right: 5px;
      }
    }
  }
}
</style>
