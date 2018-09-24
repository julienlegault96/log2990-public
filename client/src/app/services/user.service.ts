import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User, newUserTemplate } from "../../../../common/user/user";
import { AbstractServerService, Endpoints } from "./abstract-server.service";

@Injectable({
    providedIn: "root"
})

export class UserService extends AbstractServerService {
    private static minUsername: number = 1;
    private static maxUsername: number = 20;
    // Disclaimer: cette expression régulière a été prise de https://stackoverflow.com/a/389022
    private static validationRegEx: RegExp = /^[a-zA-Z0-9]+$/i;

    public validateUsername(username: string): string {
        let errorString: string = "";

        if (!this.verifyAlphanumericSymbols(username)) {
            errorString += "\n- Seul des caractères alphanumériques sont acceptés.";
        }
        if (!this.verifyUsernameLength(username)) {
            errorString += "\n- Le nom d'utilisateur doit comprendre entre 1 et 20 caractères.";
        }

        return errorString;
    }

    private verifyAlphanumericSymbols(username: string): boolean {
        return Boolean(username.match(UserService.validationRegEx));
    }

    private verifyUsernameLength(username: string): boolean {
        return username.length >= UserService.minUsername
            && username.length <= UserService.maxUsername;
    }

    public submitUsername(username: string): void {
        if (this.validateUsername(username).length === 0) {
            this.addUser(this.createUser(username));
        } else {
            throw(Error("Nom invalide \n ERREURS DÉTECTÉES" + this.validateUsername(username)));
        }
    }

    public getUsers(): Observable<User[]> {
        return this.getRequest<User[]>(Endpoints.Users);
    }

    public createUser(username: string): User {
        const newUser: User = newUserTemplate;
        newUser._id = username;

        return newUser;
    }

    public addUser(newUser: User): void {
        this.createUser(newUser._id);
        this.postRequest<User>(Endpoints.Users, newUser);
    }

    public removeUser(username: string): void {
         this.deleteRequest<User>(Endpoints.Users, username);
    }
}
