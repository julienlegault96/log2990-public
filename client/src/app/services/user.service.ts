import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "../../../../common/user/user";
import { AbstractServerService, Endpoints } from "./abstract-server.service";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root"
})

/**
 * this class connects implements methods for supervising user logins and logouts
 */
export class UserService extends AbstractServerService implements OnInit {
    private readonly MIN_USERNAME_LENGTH: number = 1;
    private readonly MAX_USERNAME_LENGTH: number = 20;
    // Disclaimer: cette expression régulière a été prise de https://stackoverflow.com/a/389022
    private readonly VALIDATION_REGEX: RegExp = /^[a-zA-Z0-9]+$/i;

    private readonly ERROR_HEADER: string = "Nom invalide \n ERREURS DÉTECTÉES";
    private readonly ALPHANUMERIC_ERROR_MESSAGE: string =
        "\n- Seul des caractères alphanumériques sont acceptés.";
    private readonly LENGTH_ERROR_MESSAGE: string =
        "\n- Le nom d'utilisateur doit comprendre entre 1 et 20 caractères.";
    private readonly DUPLICATE_USER_MESSAGE: string =
        "\n- Un utilisateur est déjà connecté avec un tel nom.";

    public asyncUserList: User[];
    public loggedUser: User;
    public loggedIn: boolean;

    public constructor(protected http: HttpClient) {
        super(http);
        this.asyncUserList = [];
        this.ngOnInit();
     }

    public ngOnInit(): void {
        this.refreshUserList();
        this.loggedUser = new User("Anon");
        this.loggedIn = false;

        window.addEventListener("beforeunload", async (e) => this.onUnloadEvent(e));
    }

    public onUnloadEvent(e: BeforeUnloadEvent): void {
        e.preventDefault();
        if (this.loggedIn) {
        super.deleteRequest<User>(Endpoints.Users, this.loggedUser );
        }
        // Chrome requires returnValue to be set.
        e.returnValue = "";
    }

    public validateUsername(username: string): boolean {
        return this.isValidUsernameLength(username)
            && this.isValidAlphanumericSymbols(username)
            && this.isUniqueUsername(username) ;
    }

    private isValidUsernameLength(username: string): boolean {
        return username.length >= this.MIN_USERNAME_LENGTH
            && username.length <= this.MAX_USERNAME_LENGTH;
    }

    private isValidAlphanumericSymbols(username: string): boolean {
        return Boolean(username.match(this.VALIDATION_REGEX));
    }

    private buildErrorString(username: string): string {
        let errorString: string = "";

        if (!this.isValidAlphanumericSymbols(username)) {
            errorString += this.ALPHANUMERIC_ERROR_MESSAGE;
        }
        if (!this.isValidUsernameLength(username)) {
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
