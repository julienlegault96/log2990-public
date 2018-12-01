import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { MessageService } from "./message.service";
import { UserService } from "../user/user.service";
import { SocketService } from "../socket/socket.service";

import { USERS } from "../../../../../common/user/mock-users";
import { GAMES } from "../../../../../common/game/mock-games";
import { SocketMessage, MessageOptions } from "../../../../../common/communication/sockets/socket-message";
import { SocketMessageType } from "../../../../../common/communication/sockets/socket-message-type";
import { SocketHighscore } from "../../../../../common/communication/sockets/socket-highscore";
import { GamePartyMode } from "../../../../../common/game/game-party-mode";
import { SocketGame } from "../../../../../common/communication/sockets/socket-game";

const TIME: number = Date.now(); // HH:MM:SS
const NOM_JOUEUR: string = USERS[0]._id;
const NOM_JEU: string = GAMES[0].title;
enum POSITION {
    FRST = "première",
    SCND = "deuxième",
    THRD = "troisième"
}
enum NB_JOUEURS {
    ONE = "solo",
    TWO = "un contre un"
}
const EXPECTED_CONNECTION_MESSAGE: SocketMessage = {
    userId: NOM_JOUEUR,
    type: SocketMessageType.Connection,
    timestamp: TIME
};
const EXPECTED_DISCONNECTION_MESSAGE: SocketMessage = {
    userId: NOM_JOUEUR,
    type: SocketMessageType.Disconnection,
    timestamp: TIME
};
const EXPECTED_HIGHSCORE: SocketHighscore = {
    position: 1,
    gameMode: GamePartyMode.Multiplayer,
    gameName: NOM_JEU
};
const EXPECTED_GAME: SocketGame = {
    _id: 1,
    Mode: GamePartyMode.Multiplayer,
    Name: NOM_JEU
};
const EXPECTED_MESSAGE_OPTIONS: MessageOptions = {
    HighScore: EXPECTED_HIGHSCORE,
    Game: EXPECTED_GAME
};
const EXPECTED_HIGHSCORE_MESSAGE: SocketMessage = {
    userId: NOM_JOUEUR,
    type: SocketMessageType.Highscore,
    timestamp: TIME,
    extraMessageInfo: EXPECTED_MESSAGE_OPTIONS
};
const EXPECTED_SOLO_DIFF_MESSAGE: SocketMessage = {
    userId: NOM_JOUEUR,
    type: SocketMessageType.ErrorFound,
    timestamp: TIME
};
const EXPECTED_MULTIPLAYER_DIFF_MESSAGE: SocketMessage = {
    userId: NOM_JOUEUR,
    type: SocketMessageType.ErrorFound,
    timestamp: TIME,
    extraMessageInfo: EXPECTED_MESSAGE_OPTIONS
};

const EXPECTED_SOLO_ERR_MESSAGE: SocketMessage = {
    userId: NOM_JOUEUR,
    type: SocketMessageType.NoErrorFound,
    timestamp: TIME
};
const EXPECTED_MULTIPLAYER_ERR_MESSAGE: SocketMessage = {
    userId: NOM_JOUEUR,
    type: SocketMessageType.NoErrorFound,
    timestamp: TIME,
    extraMessageInfo: EXPECTED_MESSAGE_OPTIONS
};

describe("MessageService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MessageService,
                UserService,
                SocketService,
                HttpClient
            ],
            imports: [HttpClientModule]
        });
    });

    it("should be created", inject([MessageService], (service: MessageService) => {
        expect(service).toBeTruthy();
    }));

    it("should format connections correctly", inject([MessageService], (service: MessageService) => {
        service.manage(EXPECTED_CONNECTION_MESSAGE);
        const exp: string = new Date(TIME).toLocaleTimeString() + " – " + NOM_JOUEUR + " vient de se connecter.";

        expect(service.messages[0]).toEqual(exp);
    }));

    it("should format disconnections correctly", inject([MessageService], (service: MessageService) => {
        service.manage(EXPECTED_DISCONNECTION_MESSAGE);
        const exp: string = new Date(TIME).toLocaleTimeString() + " – " + NOM_JOUEUR + " vient de se déconnecter.";

        expect(service.messages[0]).toEqual(exp);
    }));

    it("should format highscores correctly", inject([MessageService], (service: MessageService) => {
        service.manage(EXPECTED_HIGHSCORE_MESSAGE);
        const exp: string = new Date(TIME).toLocaleTimeString() + " – " +
                            NOM_JOUEUR + " obtient la " + POSITION.FRST +
                            " place dans les meilleurs temps du jeu " +
                            NOM_JEU + " en " + NB_JOUEURS.TWO + ".";

        expect(service.messages[0]).toEqual(exp);
    }));

    it("should be format differences correctly", inject([MessageService], (service: MessageService) => {
        service.manage(EXPECTED_SOLO_DIFF_MESSAGE);
        const exp1: string = new Date(TIME).toLocaleTimeString() + " – Différence trouvée.";

        expect(service.messages[0]).toEqual(exp1);

        service.manage(EXPECTED_MULTIPLAYER_DIFF_MESSAGE);
        const exp2: string = new Date(TIME).toLocaleTimeString() + " – Différence trouvée par " + NOM_JOUEUR + ".";

        expect(service.messages[1]).toEqual(exp2);
    }));

    it("should be format errors correctly", inject([MessageService], (service: MessageService) => {
        service.manage(EXPECTED_SOLO_ERR_MESSAGE);
        const exp1: string = new Date(TIME).toLocaleTimeString() + " – Erreur.";

        expect(service.messages[0]).toEqual(exp1);

        service.manage(EXPECTED_MULTIPLAYER_ERR_MESSAGE);
        const exp2: string = new Date(TIME).toLocaleTimeString() + " – Erreur par " + NOM_JOUEUR + ".";

        expect(service.messages[1]).toEqual(exp2);
    }));
});
