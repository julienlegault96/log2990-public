import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

import { AbstractServerService, Endpoints } from "./abstract-server.service";
import { Validator } from "../validator";

import { User } from "../../../../common/user/user";

@Injectable({
    providedIn: "root"
})

/**
 * this class connects implements methods for supervising user logins and logouts
 */
export class UserService extends AbstractServerService {

    public validator: Validator;
    public asyncUserList: User[];
    public loggedUser: User;
    public loggedIn: boolean;

    private readonly ERROR_HEADER: string = "Nom invalide \n ERREURS DÉTECTÉES";
    private readonly ALPHANUMERIC_ERROR_MESSAGE: string =
        "\n- Seul des caractères alphanumériques sont acceptés.";
    private readonly LENGTH_ERROR_MESSAGE: string =
        "\n- Le nom d'utilisateur doit comprendre entre 1 et 20 caractères.";
    private readonly DUPLICATE_USER_MESSAGE: string =
        "\n- Un utilisateur est déjà connecté avec un tel nom.";

    public constructor(protected http: HttpClient) {
        super(http);
        this.asyncUserList = [];
        this.refreshUserList();

        this.loggedUser = new User("Anon");
        this.loggedIn = false;
        this.validator = new Validator();

        window.addEventListener("beforeunload", async (e) => this.onUnloadEvent(e));
    }

    public onUnloadEvent(event: BeforeUnloadEvent): void {
        event.preventDefault();
        if (this.loggedIn) {
            this.removeUser(this.loggedUser).subscribe(/*fire & forget*/);
        }
        // Chrome requires returnValue to be set.
        event.returnValue = "";
    }

    public validateUsername(username: string): boolean {
        return this.validator.isStandardStringLength(username)
            && this.validator.isAlphanumericString(username)
            && this.isUniqueUsername(username);
    }

    public refreshUserList(): void {
        this.getUsers().subscribe((newUsers: User[]) => { this.asyncUserList = newUsers; });
    }

    public getUsers(): Observable<User[]> {
        return this.getRequest<User[]>(Endpoints.Users);
    }

    public addUser(newUser: User): Observable<User> {
        return this.postRequest<User>(Endpoints.Users, newUser);
    }

    public removeUser(userToDelete: User): Observable<User> {
        return this.deleteRequest<User>(Endpoints.Users, userToDelete);
    }

    public submitUsername(username: string): void {
        if (this.validateUsername(username)) {
            this.login(new User(username));
        } else {
            throw new Error(this.buildErrorString(username));
        }
    }

    protected handleError(error: HttpErrorResponse): Observable<never> {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error("An error occurred:", error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }

        return throwError("Something bad happened; please try again later.");
    }

    private login(user: User): void {
        this.addUser(user).subscribe((nullUser: User) => {
            this.getUsers().subscribe((newUsers: User[]) => {
                if (newUsers.filter((value: User) => value._id === user._id).length === 1) {
                    this.asyncUserList.push(user);
                    this.loggedUser = user;
                    this.loggedIn = true;
                }
            });
        });
    }

    private buildErrorString(username: string): string {
        let errorString: string = "";

        if (!this.validator.isAlphanumericString(username)) {
            errorString += this.ALPHANUMERIC_ERROR_MESSAGE;
        }
        if (!this.validator.isStandardStringLength(username)) {
            errorString += this.LENGTH_ERROR_MESSAGE;
        }
        if (!this.isUniqueUsername(username)) {
            errorString += this.DUPLICATE_USER_MESSAGE;
        }

        return this.ERROR_HEADER + errorString;
    }

    private isUniqueUsername(username: string): boolean {
        for (const user of this.asyncUserList) {
            if (user._id === username) {
                return false;
            }
        }

        return true;
    }

}
