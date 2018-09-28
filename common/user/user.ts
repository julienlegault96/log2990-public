export class User {
    private readonly DEFAULT_USERNAME: string = "";
    public _id: string;

    public constructor(username?: string) {
        this._id = (username === undefined ) ? this.DEFAULT_USERNAME : String(username);
    }
}