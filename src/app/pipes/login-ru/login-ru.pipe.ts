import { Pipe, PipeTransform } from '@angular/core';
import { State, StateRU } from '../../shared/types/State';

@Pipe({
    name: 'loginRU'
})
export class LoginRUPipe implements PipeTransform {

    public transform(value: State): StateRU {
        return StateRU[value];
    }

}
