import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'members'
})
export class MembersPipe implements PipeTransform {
    transform(members: string[]) {
        if (members.length < 3) {
            return members.toString();
        }
        return `${members.length} Members`;
    }
}
