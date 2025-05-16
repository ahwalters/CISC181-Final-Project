/*Problem 12: [5 points]
Represents a 'recruit' action.

Create a class named ActionRecruit that extends Action.It has the following:
- constructor with three parameters that get passed to the super's constructor
- implementation for method validAction 
    call checkValidRecruit from your rules class and return
    whether this move is valid 
- implement method performAction
    on an recruit:
    - the Piece on the End Square is removed from the opponent's team
    - the Piece on the End Square is added to the current player's team
    - the Piece being recruited speaks
    - the turn of the game is changed to the other player
*/

import { Action } from "./Action";
import { GameS25 } from "../elements/GameS25";
import { Location } from "../elements/Location";

export class ActionRecruit extends Action {
    constructor(game: GameS25, startLocation: Location, endLocation: Location) {
        super(game, startLocation, endLocation);
    }

    validAction(): boolean {
        return this.game
            .getRules()
            .checkValidRecruit(this.startLocation, this.endLocation);
    }

    performAction(): void {
        const board = this.game.getGameBoard();
        const endSquare = board.getSquare(this.endLocation);
        const recruitedPiece = endSquare.getPiece();

        if (!recruitedPiece) return;

        // Remove from opponent's team and add to current team
        this.game.getOpponentTeam().removePieceFromTeam(recruitedPiece);
        this.game.getCurrentTeam().addPieceToTeam(recruitedPiece);

        // Recruited piece speaks
        console.log(recruitedPiece.speak());

        // Change turn
        this.game.changeTurn();
    }
}
