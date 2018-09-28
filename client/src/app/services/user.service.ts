import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

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
    private readonly ERROR_HEADER: string = "Nom invalide \n ERREURS DÉTECTÉES";
    private readonly ALPHANUMERIC_ERROR_MESSAGE: string =
        "\n- Seul des caractères alphanumériques sont acceptés.";
    private readonly LENGTH_ERROR_MESSAGE: string =
        "\n- Le nom d'utilisateur doit comprendre entre 1 et 20 caractères.";
    private readonly DUPLICATE_USER_MESSAGE: string =
        "\n- Un utilisateur est déjà connecté avec un tel nom.";

    public validator: Validator;
    public asyncUserList: User[];
    public loggedUser: User;
    public loggedIn: boolean;

    public constructor(protected http: HttpClient) {
        super(http);
        this.asyncUserList = [];
        this.initialise();
     }

    private initialise(): void {
        this.refreshUserList();
        this.loggedUser = new User("Anon");
        this.loggedIn = false;
        this.validator = new Validator();

        window.addEventListener("beforeunload", async (e) => this.onUnloadEvent(e));
    }

    public onUnloadEvent(e: BeforeUnloadEvent): void {
        e.preventDefault();
        if (this.loggedIn) {
        this.removeUser( this.loggedUser );
        }
        // Chrome requires returnValue to be set.
        e.returnValue = "";
    }

    public validateUsername(username: string): boolean {
        return this.validator.isStandardStringLength(username)
            && this.validator.isAlphanumericString(username)
            && this.isUniqueUsername(username) ;
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

    public refreshUserList(): void {
        this.getUsers().subscribe( (newUsers: User[]) => {this.asyncUserList = newUsers; });
    }

    public getUsers(): Observable<User[]> {
        return this.getRequest<User[]>(Endpoints.Users);
    }

    public addUser(newUser: User): Observable<{} | User> {
        return this.postRequest<User>(Endpoints.Users, newUser);
    }

    public removeUser(userToDelete: User): void {
        this.deleteRequest<User>(Endpoints.Users, userToDelete);
    }

    /**
     * Validates a username and then sends it to the server if it passes
     * else it throws an error.
     * @param username the username of the user logging in
     * @throws an error explaining why the username was bad
     */
    public submitUsername(username: string): void {
        if (this.validateUsername(username)) {
            const clientUser: User = new User(username);
            this.addUser(clientUser).subscribe( (serverUser: User) => { });

            this.asyncUserList = this.asyncUserList.concat(clientUser);
            this.loggedUser = clientUser;
            this.loggedIn = true;
        } else {
            throw new Error(this.buildErrorString(username));
        }
    }

    protected handleError (error: HttpErrorResponse): Observable<never> {
        return new Observable<never>();
    }

}
