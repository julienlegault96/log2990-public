import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../../../common/user/user";
import { AbstractServerService, Endpoints } from "./abstract-server.service";
import { HttpErrorResponse } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})

/**
 * this class connects implements methods for supervising user logins and logouts
 */
export class UserService extends AbstractServerService {
    private readonly MIN_USERNAME_LENGTH: number = 1;
    private readonly MAX_USERNAME_LENGTH: number = 20;
    private readonly ALPHANUMERIC_ERROR_MESSAGE: string =
        "\n- Seul des caractères alphanumériques sont acceptés.";
    private readonly LENGTH_ERROR_MESSAGE: string =
        "\n- Le nom d'utilisateur doit comprendre entre 1 et 20 caractères.";

    // Disclaimer: cette expression régulière a été prise de https://stackoverflow.com/a/389022
    private readonly VALIDATION_REGEX: RegExp = /^[a-zA-Z0-9]+$/i;

    public validateUsername(username: string): boolean {
        return this.verifyUsernameLength(username)
            && this.verifyAlphanumericSymbols(username) ;
    }

    private verifyUsernameLength(username: string): boolean {
        return username.length >= this.MIN_USERNAME_LENGTH
            && username.length <= this.MAX_USERNAME_LENGTH;
    }

    private verifyAlphanumericSymbols(username: string): boolean {
        return Boolean(username.match(this.VALIDATION_REGEX));
    }

    public getUsers(): Observable<User[]> {
        return this.getRequest<User[]>(Endpoints.Users);
    }

    public createUser(username: string): User {
        return new User(username);
    }

    public addUser(newUser: User): void {
        this.postRequest<User>(Endpoints.Users, newUser);
    }

    public removeUser(userToDelete: User): void {
        this.deleteRequest<User>(Endpoints.Users);
    }

    /**
     * Validates a username and then sends it to the server if it passes
     * else it throws an error.
     * @param username the username of the user logging in
     * @throws an error explaining why the username was bad
     */
    public submitUsername(username: string): void {
        if (this.validateUsername(username)) {
            this.addUser(this.createUser(username));
        } else {
            throw new Error(this.buildErrorString(username));
        }
    }

    private buildErrorString(username: string): string {
        let errorString: string = "";

        if (!this.verifyAlphanumericSymbols(username)) {
            errorString += this.ALPHANUMERIC_ERROR_MESSAGE;
        }
        if (!this.verifyUsernameLength(username)) {
            errorString += this.LENGTH_ERROR_MESSAGE;
        }

        return "Nom invalide \n ERREURS DÉTECTÉES" + errorString;
    }

    public handleError(error: HttpErrorResponse): Observable<never> {
        /*if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error("An error occurred:", error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }*/
        throw new Error("overriden method");
    }

}
