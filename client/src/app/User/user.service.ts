import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private static validationRegEx: RegExp = /([A-Za-z0-9]){1,}/;
    private constructor() { }

    public validateUsername(username: string): boolean {
        return username.match(UserService.validationRegEx) ? true : false ;
    }
}
