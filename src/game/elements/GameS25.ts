/*Problem 7: [8 points]
Create a class named GameS25 that extends Game. 
This will represent the game that we build for our Homework 10 
this semester.
This class should have the following members:
- a member field for the Rules of this game
- constructor with the same number of parameters as its
   superclass. It should:
   - call the super class constructor
   - set the rules field to a new Rules object
           =  new Rules(this)
- acessor methods:
    - getRules    
- implement isGameEnded method
    - for our game - the game has ended when either one or both teams
        has no pieces left
- implement getWinner method
    - for our game the winner is the one that still has pieces - if both
        teams have no pieces - return "Tie"

*/

import { Team } from "./Team";
import { GameBoard } from "./GameBoard";
import { Rules } from "./Rules";
import { Game } from "./Game";

export class GameS25 extends Game {
    private rules: Rules;

    constructor(gameBoard: GameBoard, teamA: Team, teamB: Team, turn: string) {
        super(gameBoard, teamA, teamB, turn);
        this.rules = new Rules(this);
    }

    getRules(): Rules {
        return this.rules;
    }

    isGameEnded(): boolean {
        return this.numTurns === 10;
    }

    getWinner(): string {
        const teamAHasPieces = this.teamA.getTeamPieces().length > 0;
        const teamBHasPieces = this.teamB.getTeamPieces().length > 0;

        // Game ends automatically if either team has no pieces
        if (!teamAHasPieces && !teamBHasPieces) {
            return "Tie";
        } else if (!teamAHasPieces) {
            return this.teamB.getTeamColor();
        } else if (!teamBHasPieces) {
            return this.teamA.getTeamColor();
        }

        if (!this.isGameEnded()) {
            return "Game in progress!";
        }

        // Fall back to existing logic
        const aCount = this.teamA.getTeamPieces().length;
        const bCount = this.teamB.getTeamPieces().length;

        if (aCount > bCount) {
            return this.teamA.getTeamColor();
        } else if (bCount > aCount) {
            return this.teamB.getTeamColor();
        } else {
            return "Tie";
        }
    }

    public getNumTurns(): number {
        return this.numTurns;
    }
}
