export interface GenMultiParameters {
    type: "geo" | "theme";
    quantity: number;
    modifications: {
        add: boolean;
        delete: boolean;
        color: boolean;
    };
}
