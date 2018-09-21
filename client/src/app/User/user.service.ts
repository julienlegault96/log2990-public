import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../../../common/user/user";
import { AbstractServerService, Endpoints } from "../services/abstract-server.service";

@Injectable({
    providedIn: "root"
})

export class UserService extends AbstractServerService {
    private static minUsername: number = 1;
    private static maxUsername: number = 20;
    // Disclaimer: cette expression régulière a été prise de https://stackoverflow.com/a/389022
    private static validationRegEx: RegExp = /^[a-zA-Z0-9]+$/i;

    public validateUsername(username: string): boolean {
        return this.verifyAlphanumericSymbols(username)
            && this.verifyUsernameLength(username);
    }

    private verifyAlphanumericSymbols(username: string): boolean {
        return Boolean(username.match(UserService.validationRegEx));
    }

    private verifyUsernameLength(username: string): boolean {
        return Boolean(username.length >= UserService.minUsername
                        && username.length <= UserService.maxUsername);
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
        } else {
            alert("Nom invalide \n ERREURS DÉTECTÉES" + errorString);
        }
    }

    public getUsers(): Observable<User[]> {
        return this.getRequest<User[]>(Endpoints.Users);
    }

    public addUser(username: string): void {
        const newUser: User = {
            name: username
        };
        this.postRequest<User>(Endpoints.Users, newUser);
    }
}
