import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import algoliasearch from 'algoliasearch/lite';
import { environment } from 'src/environments/environment';

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

  searchChanged(query: Event) {
    console.log(query);
    // this.showResults = query !== 0;
  }

}
