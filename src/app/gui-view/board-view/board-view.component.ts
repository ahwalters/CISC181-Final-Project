import { WebzComponent, Notifier } from "@boots-edu/webz";
import { GameBoard } from "../../../game/elements/GameBoard";
import { Location } from "../../../game/elements/Location";
import { SquareViewComponent } from "../../square-view/square-view.component";
import html from "./board-view.component.html";
import css from "./board-view.component.css";

export class BoardViewComponent extends WebzComponent {
    private boardData: GameBoard;
    private squareViews: SquareViewComponent[][] = [];
    private gridWidth: number = 10;

    public squareClicked = new Notifier<Location>();

    public highlightStart = new Notifier<Location>();
    public highlightEnd = new Notifier<Location>();

    constructor(board: GameBoard) {
        super(html, css);
        this.boardData = board;

        const squareSize = 50; // or getSquareSize() if you use that method

        for (let r = 0; r < 8; r++) {
            const row: SquareViewComponent[] = [];
            for (let c = 0; c < 8; c++) {
                const loc = new Location(r, c);
                const square = board.getSquare(loc);
                const squareView = new SquareViewComponent(square, loc);

                squareView.clickedSquare.subscribe((clickedLoc: Location) => {
                    this.squareClicked.notify(clickedLoc); // forward the event to GuiViewComponent
                });

                this.highlightStart.subscribe((loc: Location) => {
                    squareView.setHighlightStart(loc);
                });

                this.highlightEnd.subscribe((loc: Location) => {
                    squareView.setHighlightEnd(loc);
                });

                squareView.clickedSquare.subscribe((clickedLoc: Location) => {
                    // pass up to gui-view here later
                    console.log(
                        `Clicked (${clickedLoc.getRow()}, ${clickedLoc.getCol()})`,
                    );
                });

                this.addComponent(squareView, "squares");
                row.push(squareView);
            }
            this.squareViews.push(row);
        }

        this.gridWidth = 8 * squareSize;
    }

    public redraw(): void {
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const square = this.boardData.getSquare(new Location(r, c));
                this.squareViews[r][c].setImage(square);
            }
        }
    }
}
