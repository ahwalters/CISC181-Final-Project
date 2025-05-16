import { Action } from "./Action";

export class ActionFreeze extends Action {
    validAction(): boolean {
        const rules = this.game.getRules();
        return rules.checkValidFreeze(this.startLocation, this.endLocation);
    }

    performAction(): void {
        const fromSquare = this.game
            .getGameBoard()
            .getSquare(this.startLocation);
        const toSquare = this.game.getGameBoard().getSquare(this.endLocation);

        const fromPiece = fromSquare.getPiece();
        const toPiece = toSquare.getPiece();

        if (
            fromPiece &&
            toPiece &&
            "freeze" in fromPiece &&
            typeof fromPiece.freeze === "function"
        ) {
            fromPiece.freeze(toPiece, this.endLocation, this.game);
        }
    }
}
