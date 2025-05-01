import {
    BindValue,
    BindValueToNumber,
    Change,
    Click,
    Input,
    ValueEvent,
    WebzComponent,
} from "@boots-edu/webz";
import html from "./text-view.component.html";
import css from "./text-view.component.css";
import { Controller } from "../../Controller";
import { Location } from "../../game/elements/Location";

export class TextViewComponent extends WebzComponent {
    @BindValueToNumber("start-row")
    private startRow: number = 0;

    @BindValueToNumber("start-col")
    private startCol: number = 0;

    @BindValueToNumber("end-row")
    private endRow: number = 0;

    @BindValueToNumber("end-col")
    private endCol: number = 0;

    @BindValue("operation-select")
    operationSelect: string = "move";

    @BindValue("message")
    private message: string = "Start Game";

    @BindValue("game-board")
    private gameString: string = "Board Goes Here";

    constructor(private controller: Controller) {
        super(html, css);
        // set the string representation of the game board
        this.displayGame();
        this.message = "Ready to Play!";
    }

    // Events - when user enters values in the textboxes
    @Input("start-row")
    onStartRowChange(evt: ValueEvent) {
        this.startRow = +evt.value;
    }

    @Input("start-col")
    onStartColChange(evt: ValueEvent) {
        this.startCol = +evt.value;
    }

    @Input("end-row")
    onEndRowChange(evt: ValueEvent) {
        this.endRow = +evt.value;
    }

    @Input("end-col")
    onEndColChange(evt: ValueEvent) {
        this.endCol = +evt.value;
    }
    // Event - when user makes selection from selection box
    @Change("operation-select")
    onOperationSelectChange(event: ValueEvent) {
        this.operationSelect = event.value;
    }

    // Event - when user clicks Go button
    @Click("go")
    onGo() {
        this.controller.carryOutAction(
            new Location(this.startRow, this.startCol),
            new Location(this.endRow, this.endCol),
            this.operationSelect,
        );

        // Update the 'View' with the current status
        // of the game
        // set the string representation of the game board
        this.displayGame();
        // Display whether Game is Over
        if (this.controller.getGame().isGameEnded()) {
            this.message = "Game Over" + this.controller.getGame().getWinner();
        } else {
            this.message = this.controller.getStatus();
        }
    }

    displayGame(): void {
        this.gameString = this.controller.getGame().toString();
    }
}
