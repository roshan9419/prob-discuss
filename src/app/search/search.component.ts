import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import algoliasearch from 'algoliasearch/lite';
import { environment } from 'src/environments/environment';
import { Question } from '../core/models/question';

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

  config = {
    indexName: environment.algolia.indexName,
    searchClient
  };

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.searchQuery = params.q;
    });
  }

  searchChanged(query: any) {
    if (typeof(query) === 'string') {
      this.showResults = query.trim().length !== 0;
    } else {
      this.showResults = false;
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
