import "reflect-metadata";
import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Routes } from "./route.manager";
import { Mongo } from "./services/mongo/mongo";
import { GamesRoute } from "./routes/games/games.route";
import { UsersRoute } from "./routes/user/users.route";
import { Imgur } from "./services/imgur/imgur";
import { ImgDiffRoute } from "./routes/img-diff/imgdiff.route";
import { LeaderboardRoute } from "./routes/leaderboard/leaderboard.route";
import { SocketManager } from "./socket.manager";
import { UserSocket } from "./sockets/user/user.socket";
import { MessageSocket } from "./sockets/message/message.socket";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.Routes).to(Routes);
container.bind(Types.UsersRoute).to(UsersRoute);
container.bind(Types.GamesRoute).to(GamesRoute);
container.bind(Types.ImgDiffRoute).to(ImgDiffRoute);
container.bind(Types.LeaderboardRoute).to(LeaderboardRoute);

container.bind(Types.SocketIo).to(SocketManager).inSingletonScope();
container.bind(Types.UserSocket).to(UserSocket);
container.bind(Types.MessageSocket).to(MessageSocket);

container.bind(Types.Mongo).to(Mongo);
container.bind(Types.Imgur).to(Imgur);

export { container };
