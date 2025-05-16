import { describe, expect, test, beforeAll } from "@jest/globals";
import { SquareViewComponent } from "./square-view.component";
import { bootstrap } from "@boots-edu/webz";

describe("SquareViewComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<SquareViewComponent>(SquareViewComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(SquareViewComponent);
        });
    });
});
