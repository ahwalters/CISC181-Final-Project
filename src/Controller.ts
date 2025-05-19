/*Problem 15: [15 points] - This class will be graded manually by the TAs
Create a new class named Controller. 
This class will interact with the game elements and actions,
and the view used to capture user input.
It should have the following members:
- member field to represnt the game - GameS25 object
- constructor with two parameters:
    - number of rows for the gameboard
    - number of columns for the gameboard
    - calls createGame and assigns it’s return value to the GameS25 property
- method createGame has two parameters: number of rows and number of columns
    and returns a GameS25 object
    this method should create a GameS25 with the following:
        - the GameBoard property should have the number of rows and columns passed in
        - the teamA object should have with 3 Piece objects: 
            a PieceBluehen, a PieceMinion, a PieceScrat
            the color of the team is your choice (don't choose black or white)
        - the teamB object should also have 3 Piece objects: 
            a PieceBluehen, a PieceMinion, a PieceScrat
             the color of the team is your choice (don't choose black or white or 
             the color you chose for teamA)
        - the turn should be set to the color of teamA
    -Note: you can create helper functions as you see fit
- accessor 
    - getGame
- method getTurn 
    has no parameters and returns a string
    indicating whose turn it is
- method getStatus
    has no parameters and returns a string
    with the current message in the Rules instance
    Note: Use the UML diagram to see how to access the Rules
    member message field
- method carryOutAction that three parameters in this order:
    - a start square location, an end square location, and a string for action type
    - this method should create the appropriate action based on action type:
        "move" -> ActionMove
        "attack" -> ActionAttack
        "recruit" -> ActionRecruit
        "spawn" -> ActionSpawn
        "crack" -> ActionCrack
    - the method should check if the action is valid and if so it should perform the action
        (use your methods created in the Action classes!)
    - this method should return whether or not this action was valid

Once you have finished this method, you should be able to use: 
    npm run start 
to play your game with a text based interface.
Play your game to check if it is behaving as described in class.
*/

import { GameS25 } from "./game/elements/GameS25";
import { GameBoard } from "./game/elements/GameBoard";
import { Team } from "./game/elements/Team";
import { PieceBlueHen } from "./game/elements/PieceBlueHen";
import { PieceMinion } from "./game/elements/PieceMinion";
import { PieceScrat } from "./game/elements/PieceScrat";
import { PieceKilljoy } from "./game/elements/PieceKilljoy";
import { Location } from "./game/elements/Location";
import { ActionMove } from "./game/actions/ActionMove";
import { ActionAttack } from "./game/actions/ActionAttack";
import { ActionRecruit } from "./game/actions/ActionRecruit";
import { ActionSpawn } from "./game/actions/ActionSpawn";
import { ActionCrack } from "./game/actions/ActionCrack";
import { Action } from "./game/actions/Action";
import { ActionFreeze } from "./game/actions/ActionFreeze";

export class Controller {
    private game: GameS25;

    constructor(rows: number, cols: number) {
        this.game = this.createGame(rows, cols);
    }

    private createGame(rows: number, cols: number): GameS25 {
        const board = new GameBoard(rows, cols);

        // Create Team A (e.g., Red)
        const teamAColor = "Red";
        const teamA = new Team(teamAColor, [
            new PieceBlueHen("H", teamAColor, false, true, 0),
            new PieceMinion("M", teamAColor, false, true, 0),
            new PieceScrat("S", teamAColor, false, true, 0, 0),
            new PieceKilljoy(teamAColor, false, true),
        ]);

        // Create Team B (e.g., Blue)
        const teamBColor = "Blue";
        const teamB = new Team(teamBColor, [
            new PieceBlueHen("H", teamBColor, false, true, 0),
            new PieceMinion("M", teamBColor, false, true, 0),
            new PieceScrat("S", teamBColor, false, true, 0, 0),
            new PieceKilljoy(teamBColor, false, true),
        ]);

        return new GameS25(board, teamA, teamB, teamAColor);
    }

    getGame(): GameS25 {
        return this.game;
    }

    getTurn(): string {
        return this.game.getCurrentTeam().getTeamColor();
    }

    getStatus(): string {
        return this.game.getRules().getMessage();
    }

    carryOutAction(
        start: Location,
        end: Location,
        actionType: string,
    ): boolean {
        let action: Action | null = null;

        switch (actionType.toLowerCase()) {
            case "move":
                action = new ActionMove(this.game, start, end);
                break;
            case "attack":
                action = new ActionAttack(this.game, start, end);
                break;
            case "recruit":
                action = new ActionRecruit(this.game, start, end);
                break;
            case "spawn":
                action = new ActionSpawn(this.game, start, end);
                break;
            case "crack":
                action = new ActionCrack(this.game, start, end);
                break;
            case "freeze":
                action = new ActionFreeze(this.game, start, end);
                break;
            default:
                return false; // unknown action type
        }

        if (action.validAction()) {
            action.performAction();

            this.game
                .getCurrentTeam()
                .getTeamPieces()
                .forEach((piece) => {
                    if (
                        "updateFreezeStatus" in piece &&
                        typeof piece.updateFreezeStatus === "function"
                    ) {
                        piece.updateFreezeStatus();
                    }
                });

            return true;
        }

        return false;
    }

    getBoard(): GameBoard {
        return this.game.getGameBoard();
    }
}
