import { describe, expect, test, beforeAll } from "@jest/globals";
import { BoardViewComponent } from "./board-view.component";
import { bootstrap } from "@boots-edu/webz";

describe("BoardViewComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<BoardViewComponent>(BoardViewComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(BoardViewComponent);
        });
    });
});
