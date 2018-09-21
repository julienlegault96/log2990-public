import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../../../common/user/user";
import { AbstractServerService } from "../abstract-server.service";

@Injectable({
    providedIn: "root"
})

export class UserService extends AbstractServerService {
    private static minUsername: number = 1;
    private static maxUsername: number = 20;
    // Disclaimer: cette expretion régulaire a été prise de https://stackoverflow.com/a/389022
    private static validationRegEx: RegExp = /^[a-zA-Z0-9]+$/i;

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

        if (errorString.length === 0) {
            this.addUser(username);
            alert("Nom valide");
        } else {
            alert("Nom invalide \n ERREURS DÉTECTÉES" + errorString);
        }
    }

    public getUsers(): Observable<User[]> {
        return this.getRequest<User[]>("users", "getUsers");
    }

    public addUser(username: string): void {
        const newUser: User = {
            name: username
        };
        this.postRequest<User>("users", newUser, "addUser");
    }
}
