import { WebzComponent } from "@boots-edu/webz";
import html from "./gui-view.component.html";
import css from "./gui-view.component.css";
import { Controller } from "../../Controller";

export class GuiViewComponent extends WebzComponent {
    constructor(private controller: Controller) {
        super(html, css);
    }
}
