import { Injectable } from '@angular/core';
import algoliasearch, { SearchClient } from 'algoliasearch/lite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private client: SearchClient

  constructor() {
    this.client = algoliasearch(
      environment.algolia.appId,
      environment.algolia.apiKey
    );
  }

  async getSearchResults(query: string) {
    const results = await this.client.initIndex(environment.algolia.indexName).search(query);
    // console.log(results.hits);
    return results.hits;
  }
}
