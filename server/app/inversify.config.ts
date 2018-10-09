import "reflect-metadata";
import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Routes } from "./routes";
import { Mongo } from "./services/mongo";
import { Games } from "./routes/games";
import { Users } from "./routes/users";
import { Imgur } from "./routes/imgur/imgur";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.Mongo).to(Mongo);
container.bind(Types.Users).to(Users);
container.bind(Types.Games).to(Games);
container.bind(Types.Imgur).to(Imgur);

export { container };
