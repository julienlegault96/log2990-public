import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AbstractServerService, Endpoints } from "../abstract-server/abstract-server.service";
import { Validator } from "../validator/validator";

import { User } from "../../../../../common/user/user";
import { SocketService } from "../socket/socket.service";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";
import { SocketMessage } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";

@Injectable({
    providedIn: "root"
})

/**
 * this class connects implements methods for supervising user logins and logouts
 */
export class UserService extends AbstractServerService {

    public validator: Validator;
    public userList: User[];
    public loggedUser: User;
    public loggedIn: boolean;

    private readonly ALPHANUMERIC_ERROR_MESSAGE: string =
        "Seul des caractères alphanumériques sont acceptés.\n";
    private readonly LENGTH_ERROR_MESSAGE: string =
        "Le nom d'utilisateur doit comprendre entre 1 et 20 caractères.\n";
    private readonly DUPLICATE_USER_MESSAGE: string =
        "Un utilisateur est déjà connecté avec un tel nom.\n";

    public constructor(protected http: HttpClient, private socketService: SocketService) {
        super(http);
        this.userList = [];
        this.refreshUserList();

        this.loggedUser = new User("Anon");
        this.loggedIn = false;
        this.validator = new Validator();

        socketService.registerFunction(SocketEvents.Message, this.syncUserList.bind(this));
    }

    public validateUsername(username: string): boolean {
        return this.validator.isStandardStringLength(username)
            && this.validator.isAlphanumericString(username)
            && this.isUniqueUsername(username);
    }

    public refreshUserList(): void {
        this.getUsers().subscribe((newUsers: User[]) => { this.userList = newUsers; });
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
        this.socketService.emit<User>(SocketEvents.UserConnection, user);

        this.socketService.emit<SocketMessage>(
            SocketEvents.Message,
            {
                userId: user._id,
                type: SocketMessageType.Connection,
                timestamp: Date.now()
            }
        );

        this.addUser(user).subscribe((nullUser: User) => {
            if (this.userList.filter((value: User) => value._id === user._id).length === 1) {
                this.loggedUser = user;
                this.loggedIn = true;
            }
        });
    }

    private syncUserList(msg: SocketMessage): void {
        if (msg.type === SocketMessageType.Disconnection) {
            this.userList = this.userList.filter((value: User) => value._id !== msg.userId);
        } else if (msg.type === SocketMessageType.Connection) {
            this.userList.push(new User(msg.userId));
        }
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
        for (const user of this.userList) {
            if (user._id === username) {
                return false;
            }
        }

        return true;
    }

}
