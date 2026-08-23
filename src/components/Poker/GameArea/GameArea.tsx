import React from 'react';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { CardPicker } from '../../Players/CardPicker/CardPicker';
import { Players } from '../../Players/Players';
import { GameController } from '../GameController/GameController';

interface GameAreaProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}

export const GameArea: React.FC<GameAreaProps> = ({ game, players, currentPlayerId }) => {
  return (
    <>
      {/* Main Layout: GameController on left, Team Panels on right */}
      <div className='flex flex-col lg:flex-row w-full gap-4 p-4 min-h-[60%] overflow-auto'>
        
        {/* Left Column: GameController - Fixed Width */}
        <div className='w-full lg:w-120 flex-shrink-0'>
          <GameController game={game} players={players} currentPlayerId={currentPlayerId} />
        </div>

        {/* Right Column: Team Panels - Takes remaining space */}
        <div className='w-full lg:flex-1 overflow-y-auto'>
          <Players game={game} players={players} currentPlayerId={currentPlayerId} />
        </div>
      </div>

      {/* Bottom: CardPicker - Full Width */}
      <div className='text-center flex justify-center w-full'>
        <CardPicker game={game} players={players} currentPlayerId={currentPlayerId} />
      </div>
    </>
  );
};

export default GameArea;