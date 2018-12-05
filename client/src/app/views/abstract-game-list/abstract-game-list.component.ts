import { OnInit } from "@angular/core";

import { GameService } from "../../services/game/game.service";

import { Game } from "../../../../../common/game/game";
import { GameType } from "../../../../../common/game/game-type";
import { SocketService } from "src/app/services/socket/socket.service";
import { SocketEvents } from "../../../../../common/communication/sockets/socket-requests";

export abstract class AbstractGameListComponent implements OnInit {

    public singleViewGames: Game[];
    public doubleViewGames: Game[];
    public gamesLoaded: boolean;

    public constructor(protected gameService: GameService, protected socketService: SocketService) {
        this.singleViewGames = new Array();
        this.doubleViewGames = new Array();
        this.gamesLoaded = false;
    }

    public ngOnInit(): void {
        this.getGames();
    }

    protected getGames(): void {
        this.gameService.getGames()
            .subscribe((games: Game[]) => {
                this.filterGames(games);
                this.gamesLoaded = true;
                this.socketService.emit(SocketEvents.GameStateRequest, undefined);
            });
    }

    protected filterGames(games: Game[]): void {
        this.singleViewGames = games.filter((game: Game) => game.type === GameType.SingleView);
        this.doubleViewGames = games.filter((game: Game) => game.type === GameType.DoubleView);
    }

}
