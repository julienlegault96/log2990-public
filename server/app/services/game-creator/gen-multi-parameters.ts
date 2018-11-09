export interface GenMultiParameters {
    type: string;
    quantity: number;
    modifications: {
        add: boolean;
        delete: boolean;
        color: boolean;
    };
}
