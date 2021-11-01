import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value.seconds)) / 1000);
      if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals = new Map<string, number>();
      intervals.set("year", 31536000);
      intervals.set("month", 2592000);
      intervals.set("week", 604800);
      intervals.set("day", 86400);
      intervals.set("hour", 3600);
      intervals.set("minute", 60);
      intervals.set("second", 1);

      let counter;
      for (const [key, val] of intervals) {
        counter = Math.floor(seconds / val);
        if (counter > 0)
          if (counter === 1) {
            return counter + ' ' + key + ' ago'; // singular (1 day ago)
          } else {
            return counter + ' ' + key + 's ago'; // plural (2 days ago)
          }
      }
    }
    return value;
  }

}