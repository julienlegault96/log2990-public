export class UserConnection {

    public userId: string;
    public currentRoom: string;

    public constructor(userId: string) {
        this.userId = userId;
        this.reset();
    }

    public reset(): void {
        this.currentRoom = "/";
    }

}
