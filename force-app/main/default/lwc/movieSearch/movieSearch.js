import { LightningElement, wire } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import MOVIE_CHANNEL from "@salesforce/messageChannel/movieChannel__c";

const DELAY = 500;

export default class MovieSearch extends LightningElement {
  selectedType = "";
  loading = false;
  selectedSearch = "";
  selectedPageNumber = "1";
  delayTimeout;
  searchResult = [];
  selectedMovie = "";

  @wire(MessageContext)
  messageContext;

  get typeOptions() {
    return [
      { label: "None", value: "" },
      { label: "Movie", value: "movie" },
      { label: "Series", value: "series" },
      { label: "Episode", value: "episode" }
    ];
  }

  handleChange(event) {
    let { name, value } = event.target;
    this.loading = true;
    if (name === "type") {
      this.selectedType = value;
    } else if (name === "search") {
      this.selectedSearch = value;
    } else if (name === "pagenumber") {
      this.selectedPageNumber = value;
    }
    clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => {
      this.searchMovies();
    }, DELAY);
  }

  async searchMovies() {
    const url = `https://www.omdbapi.com/?s=${this.selectedSearch}&page=${this.selectedPageNumber}&type=${this.selectedType}&apikey=377602f9`;
    const res = await fetch(url);
    const data = await res.json();
    console.log("🚀 ~ MovieSearch ~ searchMovies ~ data:", data);
    this.loading = false;
    if (data.Response === "True") {
      this.searchResult = data.Search;
    } else {
      this.searchResult = [];
    }
  }

  movieSelectedHandler(event) {
    this.selectedMovie = event.detail;
    const payload = { movieId: this.selectedMovie };
    publish(this.messageContext, MOVIE_CHANNEL, payload);
  }

  get displaySearchResult() {
    return this.searchResult.length > 0 ? true : false;
  }
}