import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
selector: '[moveNextByMaxLength]'
})
export class MoveNextByMaxLengthDirective {

constructor(private _el: ElementRef) { }

@HostListener('keyup', ['$event']) onKeyDown(e: any) {
    if (e.srcElement.maxLength === e.srcElement.value.length) {

        e.preventDefault();

        let nextControl: any = e.srcElement.nextElementSibling;
        console.log(nextControl);
       // Searching for next similar control to set it focus
        while (true)
        {
            if (nextControl)
            {
                if (nextControl.type === e.srcElement.type)
                {
                    nextControl.focus();
                    return;
                }
                else
                {
                    nextControl = nextControl.nextElementSibling;
                }
            }
            else
            {
                return;
            }
        }
    }
}

}