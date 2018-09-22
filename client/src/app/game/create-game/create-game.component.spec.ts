import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { CreateGameComponent } from "./create-game.component";
import { GameService } from "../../services/game.service";
import { CreateGameService } from "../../services/create-game.service";

describe("CreateGameComponent", () => {
    let component: CreateGameComponent;
    let fixture: ComponentFixture<CreateGameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateGameComponent],
            imports: [
                FormsModule,
                HttpClientModule,
            ],
            providers: [
                GameService,
                CreateGameService
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
