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
    private static validationRegEx: RegExp = /([A-Za-z0-9]){1,}/;
    private constructor() { }

    public validateUsername(username: string): boolean {
        return username.match(UserService.validationRegEx) ? true : false;
    }

    public validateUsernameLength(username: string): boolean {
        return (username.length >= UserService.minUsername
                    && username.length <= UserService.maxUsername) ? true : false;
    }

    public submitUsername(username: string): void {
        // this.validateUsername(username) ? "" : "";
    }

    public getUsernames(): Observable<User[]> {
        return of(USERS);
    }
}
