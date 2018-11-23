import { TestBed, inject } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";

import { ImgDiffService } from "./img-diff.service";

describe("ImgDiffService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ImgDiffService],
            imports: [HttpClientModule]
        });
    });

    it("should be created", inject([ImgDiffService], (service: ImgDiffService) => {
        expect(service).toBeTruthy();
    }));
});
