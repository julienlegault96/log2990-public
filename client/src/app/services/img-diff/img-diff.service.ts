import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { AbstractServerService, Endpoints, Query } from "../abstract-server/abstract-server.service";
import { Coordinates } from "../../../../../common/game/coordinates";
import { ImageView } from "../../../../../common/game/image-view";

@Injectable()

export class ImgDiffService extends AbstractServerService {

    public getDiff(id: number, imageView: ImageView, x: number, y: number): Observable<Array<Coordinates>> {
        return this.getRequest<Array<Coordinates>>(
            Endpoints.ImgDiff,
            null,
            new Query("id", id),
            new Query("imageView", imageView),
            new Query("x", Math.round(x)),
            new Query("y", Math.round(y)));
    }

}
