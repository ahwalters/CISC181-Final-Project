import { WebzComponent, Notifier, Click } from "@boots-edu/webz";
import html from "./action-view.component.html";
import css from "./action-view.component.css";

export class ActionViewComponent extends WebzComponent {
    public actionSelected = new Notifier<string>();

    constructor() {
        super(html, css);
    }

    @Click("move-button")
    onMoveClick(): void {
        this.actionSelected.notify("move");
    }

    @Click("attack-button")
    onAttackClick(): void {
        this.actionSelected.notify("attack");
    }

    @Click("spawn-button")
    onSpawnClick(): void {
        this.actionSelected.notify("spawn");
    }

    @Click("crack-button")
    onCrackClick(): void {
        this.actionSelected.notify("crack");
    }

    @Click("recruit-button")
    onRecruitClick(): void {
        this.actionSelected.notify("recruit");
    }

    @Click("freeze-button")
    onFreezeClick(): void {
        this.actionSelected.notify("freeze");
    }

    @Click("cancel-button")
    onCancelClick(): void {
        this.actionSelected.notify("cancel");
    }
}
