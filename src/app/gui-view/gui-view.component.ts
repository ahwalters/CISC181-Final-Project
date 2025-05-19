import { WebzComponent, BindValue, WebzDialog } from "@boots-edu/webz";
import html from "./gui-view.component.html";
import css from "./gui-view.component.css";
import { Controller } from "../../Controller";
import { BoardViewComponent } from "./board-view/board-view.component";
import { Location } from "../../game/elements/Location";
import { GameS25 } from "../../game/elements/GameS25";
import { ActionViewComponent } from "./action-view/action-view.component";

export class GuiViewComponent extends WebzComponent {
    private boardView: BoardViewComponent;

    private startLocation: Location | null = null;
    private endLocation: Location | null = null;
    private actionType: string = "";
    private game: GameS25;
    private actionView: ActionViewComponent;

    @BindValue("turn-label")
    private turnLabel: string = "";

    @BindValue("info-panel")
    private infoPanel: string = "Selected: None | Target: None";

    @BindValue("turn-count")
    private turnCountLabel: string = "0 Turns";

    @BindValue("speak-panel")
    private speakMessage: string = "";

    constructor(private controller: Controller) {
        super(html, css);

        this.game = controller.getGame();
        const gameBoard = controller.getBoard();
        this.boardView = new BoardViewComponent(gameBoard);

        this.addComponent(this.boardView, "game-board");

        this.actionView = new ActionViewComponent();
        this.addComponent(this.actionView, "action-view");

        this.actionView.actionSelected.subscribe((action: string): void => {
            this.handleClicks(action);
        });

        this.boardView.squareClicked.subscribe((loc: Location) => {
            this.handleClicks(loc);
        });

        // Set turn label and turn count on init
        this.turnLabel = `${this.controller.getTurn()}'s Turn`;
        const turns = this.game.getNumTurns();
        const turnWord = turns === 1 ? "Turn" : "Turns";
        this.turnCountLabel = `${turns} ${turnWord}`;
    }

    public redraw(): void {
        this.boardView.redraw();
    }

    private reset(): void {
        this.startLocation = null;
        this.endLocation = null;
        this.actionType = "";
        this.infoPanel = "Selected: None | Target: None";
    }

    private handleClicks(clicked: Location | string): void {
        if (clicked instanceof Location) {
            if (!this.startLocation) {
                const square = this.game.getGameBoard().getSquare(clicked);
                const piece = square.getPiece();

                if (!piece) {
                    WebzDialog.popup(this, "No piece on this square.");
                    return;
                }

                const teamColor = this.game.getCurrentTeam().getTeamColor();
                if (piece.getTeamColor() !== teamColor) {
                    WebzDialog.popup(this, "That piece is not yours!");
                    return;
                }

                this.startLocation = clicked;
            } else if (!this.endLocation) {
                const square = this.game.getGameBoard().getSquare(clicked);
                const targetPiece = square.getPiece();

                if (this.startLocation.equals(clicked)) {
                    WebzDialog.popup(
                        this,
                        "End location must be different from start.",
                    );
                    return;
                }

                if (this.actionType) {
                    const startSquare = this.game
                        .getGameBoard()
                        .getSquare(this.startLocation);
                    const startPiece = startSquare.getPiece();

                    if (!startPiece) {
                        WebzDialog.popup(
                            this,
                            "Somehow the start square has no piece.",
                        );
                        return;
                    }

                    const sameTeam =
                        targetPiece &&
                        targetPiece.getTeamColor() ===
                            startPiece.getTeamColor();

                    if (
                        this.actionType === "attack" &&
                        (!targetPiece || sameTeam)
                    ) {
                        WebzDialog.popup(
                            this,
                            "You can only attack an enemy piece.",
                        );
                        return;
                    }

                    if (
                        (this.actionType === "move" ||
                            this.actionType === "spawn") &&
                        targetPiece
                    ) {
                        WebzDialog.popup(
                            this,
                            "You can't move/spawn onto an occupied square.",
                        );
                        return;
                    }

                    if (
                        this.actionType === "recruit" &&
                        (!targetPiece || sameTeam)
                    ) {
                        WebzDialog.popup(
                            this,
                            "You can only recruit an enemy piece.",
                        );
                        return;
                    }

                    // Add "freeze", "crack", etc. here as needed
                }

                this.endLocation = clicked;
            }
        } else {
            if (clicked === "cancel") {
                this.reset();
                return;
            }

            this.actionType = clicked;
        }

        const getLabel = (loc: Location | null): string => {
            if (!loc) return "None";
            const square = this.game.getGameBoard().getSquare(loc);
            const piece = square.getPiece();
            const name = piece ? piece.getType() : null;
            return name ?
                    `${name} (${loc.getRow()}, ${loc.getCol()})`
                :   `(${loc.getRow()}, ${loc.getCol()})`;
        };

        this.infoPanel = `Selected: ${getLabel(this.startLocation)} | Target: ${getLabel(this.endLocation)}`;

        if (this.startLocation && this.endLocation && this.actionType) {
            console.log(
                "Calling carryOutAction with:",
                this.actionType,
                this.startLocation,
                this.endLocation,
            );

            const success = this.controller.carryOutAction(
                this.startLocation,
                this.endLocation,
                this.actionType,
            );

            if (!success) {
                WebzDialog.popup(this, this.controller.getStatus());
            } else {
                this.boardView.redraw();

                const turns = this.game.getNumTurns();
                const turnWord = turns === 1 ? "Turn" : "Turns";
                this.turnLabel = `${this.controller.getTurn()}'s Turn`;
                this.turnCountLabel = `${turns} ${turnWord}`;

                // ✅ NEW: show piece speak message
                const actingSquare = this.game
                    .getGameBoard()
                    .getSquare(this.startLocation);
                const actingPiece = actingSquare.getPiece();

                if (actingPiece) {
                    const message = `${actingPiece.getType()} says: "${actingPiece.speak()}"`;
                    this.speakMessage = message;
                }

                if (this.controller.getGame().isGameEnded()) {
                    WebzDialog.popup(
                        this,
                        "Game over! Winner: " +
                            this.controller.getGame().getWinner(),
                    );
                }
            }

            this.reset();
        }

        console.log("Start:", this.startLocation);
        console.log("End:", this.endLocation);
        console.log("ActionType:", this.actionType);
    }
}
