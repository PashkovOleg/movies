import Vue from "vue";
import VueRouter from "vue-router";
import ListMovies from "@/components/ListMovies.vue";
import Movie from "@/components/Movie.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "ListMovies" }
  },
  {
    path: "*",
    redirect: { name: "ListMovies" }
  },
  {
    path: "/movies",
    name: "ListMovies",
    component: ListMovies
  },
  {
    path: "/movies/:id",
    name: "Movie",
    component: Movie
  }
];

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes
});

export default router;
