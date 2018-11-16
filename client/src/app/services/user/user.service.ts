import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AbstractServerService, Endpoints } from "../abstract-server/abstract-server.service";
import { Validator } from "../../validator";

import { User } from "../../../../../common/user/user";

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

    private readonly ALPHANUMERIC_ERROR_MESSAGE: string =
        "Seul des caractères alphanumériques sont acceptés.\n";
    private readonly LENGTH_ERROR_MESSAGE: string =
        "Le nom d'utilisateur doit comprendre entre 1 et 20 caractères.\n";
    private readonly DUPLICATE_USER_MESSAGE: string =
        "Un utilisateur est déjà connecté avec un tel nom.\n";

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
        return this.deleteRequest<User>(Endpoints.Users, userToDelete._id);
    }

    public submitUsername(username: string): void {
        if (this.validateUsername(username)) {
            this.login(new User(username));
        } else {
            throw new Error(this.buildErrorString(username));
        }
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

        if (!this.isUniqueUsername(username)) {
            errorString += this.DUPLICATE_USER_MESSAGE;
        }
        if (!this.validator.isStandardStringLength(username)) {
            errorString += this.LENGTH_ERROR_MESSAGE;
        }
        if (!this.validator.isAlphanumericString(username)) {
            errorString += this.ALPHANUMERIC_ERROR_MESSAGE;
        }

        return errorString;
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
