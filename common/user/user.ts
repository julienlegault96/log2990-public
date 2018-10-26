// exterior const to avoid cluttering the db object
const DEFAULT_USERNAME: string = "";

export class User {

    public _id: string;

    public constructor(username?: string) {
        this._id = (username === undefined) ? DEFAULT_USERNAME : String(username);
    }

}