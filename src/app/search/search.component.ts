import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import algoliasearch from 'algoliasearch/lite';
import { environment } from 'src/environments/environment';
import { Question } from '../core/models/question';
import { SearchService } from '../core/services/search.service';

const searchClient = algoliasearch(
  environment.algolia.appId,
  environment.algolia.apiKey
);


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  searchQuery: string = ''
  showResults = false;
  initialSearch = true;
  hits: any = [];

  config = {
    indexName: environment.algolia.indexName,
    searchClient
  };

  constructor(private activatedRoute: ActivatedRoute, private searchService: SearchService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchQuery = params.q;
      if (params.q) {
        this.loadResult();
      }
    });
  }

  async loadResult() {
    console.log(this.searchQuery);
    this.hits = await this.searchService.getSearchResults(this.searchQuery);
  }

  searchChanged(query: any) {
    this.initialSearch = false;
    this.hits = [];
    if (typeof(query) === 'string') {
      this.showResults = query.trim().length !== 0;
      this.searchQuery = query.trim();
    } else {
      this.showResults = this.searchQuery.length !== 0;
    }
  }

  getQuestion(obj: any) {
    return obj as Question;
  }

  getQuestionTitle(obj: any) {
    return obj._highlightResult.title.value;
  }

  getQuestionDesc(obj: Object) {
    const htmlEl = document.createElement('body');
    htmlEl.innerHTML = this.getQuestion(obj).content;
    return htmlEl.innerText;
  }

}
