import "reflect-metadata";
import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Routes } from "./routes";
import { Mongo } from "./services/mongo";
import { GamesRoute } from "./routes/games.route";
import { UsersRoute } from "./routes/users.route";
import { Imgur } from "./services/imgur/imgur";
import { ImgDiffRoute } from "./routes/img-diff/imgdiff.route";
import { LeaderboardRoute } from "./routes/leaderboard/leaderboard.route";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.Mongo).to(Mongo);
container.bind(Types.UsersRoute).to(UsersRoute);
container.bind(Types.GamesRoute).to(GamesRoute);
container.bind(Types.Imgur).to(Imgur);
container.bind(Types.ImgDiffRoute).to(ImgDiffRoute);
container.bind(Types.LeaderboardRoute).to(LeaderboardRoute);

export { container };
