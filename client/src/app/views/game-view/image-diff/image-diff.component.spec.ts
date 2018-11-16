import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ImageDiffComponent } from "./image-diff.component";
import { ImgDiffService } from "src/app/services/img-diff/img-diff.service";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";

describe("ImageDiffComponent", () => {
    let component: ImageDiffComponent;
    let fixture: ComponentFixture<ImageDiffComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ImageDiffComponent
            ],
            providers: [
                ImgDiffService,
            ],
            imports: [
                HttpClientModule,
                RouterTestingModule,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ImageDiffComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

});
