export class UserConnection {

    public userId: string;
    public gameRoomName: string;
    public isPlayingMultiplayer: boolean;

    public constructor(userId: string) {
        this.userId = userId;
        this.reset();
    }

    public reset(): void {
        this.gameRoomName = "";
        this.isPlayingMultiplayer = false;
    }

}
