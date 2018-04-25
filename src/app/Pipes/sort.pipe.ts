import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort',
})
export class SortPipe implements PipeTransform {
    transform(arrCourse: string[], args: string) {
        return arrCourse.sort();
    }
}
