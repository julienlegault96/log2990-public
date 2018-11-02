const DEFAULT_USERNAME: string = "";

export class User {

    public _id: string;

    public constructor(username?: string) {
        this._id = (username === undefined) ? DEFAULT_USERNAME : String(username);
    }

}

export const RANDOM_USER_NAMES: string[] = [
    "Farrah",
    "Barb",
    "Mckinley",
    "Tameka",
    "Caroyln",
    "Anisha",
    "Kesha",
    "Werner",
    "Katina",
    "Brigette",
    "Wai",
    "Nguyet",
    "Dominick",
    "Chadwick",
    "Jazmin",
    "Jarrett",
    "Maude",
    "Aracely",
    "Kenia",
    "Sommer",
    "Barrie",
    "Stephane",
    "Noreen",
    "Ocie",
    "Shelton",
    "Broderick",
    "Artie",
    "Kristi",
    "Faustino",
    "Gloria",
    "Rosalva",
    "Lesha",
    "Kenton",
    "Taneka",
    "Monty",
    "Tonya",
    "Donnetta",
    "Deidre",
    "Daisey",
    "Caprice",
    "Porter",
    "Petra",
    "Carolyne",
    "Ricarda",
    "Louise",
    "Jerrold",
    "Mattie",
    "Darnell",
    "Nisha",
    "Ralph",
];