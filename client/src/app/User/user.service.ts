import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { User } from "./user";
import { USERS } from "./mock-users";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private static minUsername: number = 1;
    private static maxUsername: number = 20;
    // this regular expression was taken from https://stackoverflow.com/a/389022
    private static validationRegEx: RegExp = /^[a-zA-Z0-9]+$/i;

    private constructor() { }

    public validateUsername(username: string): boolean {
        return this.verifyAlphanumericSymbols(username)
                && this.verifyUsernameLength(username);
    }

    private verifyAlphanumericSymbols(username: string): boolean {
        return username.match(UserService.validationRegEx) ? true : false;
    }

    private verifyUsernameLength(username: string): boolean {
        return (username.length >= UserService.minUsername
                    && username.length <= UserService.maxUsername) ? true : false;
    }

    public submitUsername(username: string): void {
        let errorString: string = "";
        if (!this.verifyAlphanumericSymbols(username)) {
            errorString += "\n- Seul des caractères alphanumériques sont acceptés.";
        }
        if (!this.verifyUsernameLength(username)) {
            errorString += "\n- Le nom d'utilisateur doit comprendre entre 1 et 20 caractères.";
        }
        errorString.length === 0 ? alert("Nom valide") : alert("Nom invalide \n ERREURS DÉTECTÉES" + errorString);
    }

    public getUsernames(): Observable<User[]> {
        return of(USERS);
    }
}
