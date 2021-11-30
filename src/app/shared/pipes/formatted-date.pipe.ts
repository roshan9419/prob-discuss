import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedDate'
})
export class FormattedDatePipe implements PipeTransform {

  transform(value: any, args?: any): unknown {
    if (value) {
      const seconds = Math.floor(((new Date()).getTime() - (value.seconds * 1000)) / 1000);
      if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
        return 'Just now';
      const intervals = new Map<string, number>();
      intervals.set("day", 86400);
      intervals.set("hour", 3600);
      intervals.set("minute", 60);
      intervals.set("second", 1);

      if (seconds > 604800) { // 
        const valueDate = value.toDate();
        const month = valueDate.toString().split(" ")[1]
        const date = valueDate.getDate();
        const year = valueDate.getFullYear();
        const hour = valueDate.getHours();
        const min = valueDate.getMinutes();
  
        return `${month} ${date} '${year % 100} at ${String(hour).padStart(2,'0')}:${String(min).padStart(2,'0')}`;
      }

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
