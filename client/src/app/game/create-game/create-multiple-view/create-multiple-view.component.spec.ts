import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { CreateMultipleViewComponent } from "./create-multiple-view.component";
import { CreateGameService } from "../../../services/create-game.service";
import { GameService } from "src/app/services/game.service";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

describe("CreateMultipleViewComponent", () => {
    let component: CreateMultipleViewComponent;
    let fixture: ComponentFixture<CreateMultipleViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreateMultipleViewComponent],
            imports: [
                FormsModule,
                HttpClientModule,
                FontAwesomeModule,
            ],
            providers: [
                CreateGameService,
                GameService,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateMultipleViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

});
