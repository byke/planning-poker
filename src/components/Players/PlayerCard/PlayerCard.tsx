import React from 'react';
import { removePlayer } from '../../../service/players';
import { Game } from '../../../types/game';
import { Player } from '../../../types/player';
import { Status } from '../../../types/status';
import { isModerator } from '../../../utils/isModerator';
import { TrashSVG } from '../../SVGs/Trash';
import { getCards } from '../CardPicker/CardConfigs';

interface PlayerCardProps {
  game: Game;
  player: Player;
  currentPlayerId: string;
  resetEmoji: string;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  game,
  player,
  currentPlayerId,
  resetEmoji,
}) => {
  const removeUser = (gameId: string, playerId: string) => {
    removePlayer(gameId, playerId);
  };

  return (
    <div
      className='relative rounded shadow-md w-full max-w-20 h-20 min-w-0 bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-600 border mb-2'
      style={{
        backgroundColor: getCardColor(game, player.value),
      }}
    >
      <div className='absolute -top-3 left-1/2 -translate-x-1/2 w-[95%] text-center bg-white dark:bg-gray-900 border-2 border-gray-400 dark:border-gray-700 rounded-xl flex items-center justify-center px-1.5 py-0.5'>
        <div className='min-h-7 w-full flex items-center justify-center' title={player.name}>
          <div className='text-center font-semibold text-xs leading-tight break-words line-clamp-2'>
            {player.name}
          </div>
        </div>
        {isModerator(game.createdById, currentPlayerId, game.isAllowMembersToManageSession) &&
          player.id !== currentPlayerId && (
            <button
              title='Remove'
              className='cursor-pointer absolute -top-1.5 -right-1.5 h-4 w-4 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 hover:bg-red-100 dark:hover:bg-red-950 shadow-md border-2 border-red-400 transition'
              onClick={() => removeUser(game.id, player.id)}
              data-testid='remove-button'
            >
              <TrashSVG className='h-2 w-2 text-red-400' />
            </button>
          )}
      </div>

      <div className='flex items-center justify-center text-gray-800 h-full pt-2'>
        <span
          className={`${getCardValue(player, game, resetEmoji)?.length < 2 ? 'text-2xl' : 'text-xl'
            }`}
        >
          {getCardValue(player, game, resetEmoji)}
        </span>
      </div>
    </div>
  );
};

const getCardColor = (game: Game, value: number | null | undefined): string => {
  if (game.gameStatus == Status.Finished) {
    const card = getCards(game.gameType).find((card) => card.value === value);
    return card ? card.color : '';
  }
  return '';
};

const getCardValue = (player: Player, game: Game, resetEmoji: string) => {
  // Observers always show 👀
  if (player.team === 'Observer') {
    return '👀';
  }

  if (game.gameStatus !== Status.Finished) {
    // Before game is revealed:
    // Show 👍 only if player has selected a value (not null/undefined)
    // Show 🤔 (or theme emoji) if player hasn't selected or has reset their selection
    if (player.status === Status.Finished && player.value !== null && player.value !== undefined) {
      return '👍';
    }
    return resetEmoji;
  }

  if (game.gameStatus === Status.Finished) {
    if (player.status === Status.Finished) {
      // If value is null, show reset emoji (player reset their selection)
      if (player.value === null || player.value === undefined) {
        return resetEmoji;
      }
      if (player.value === -1) {
        return player.emoji || '☕'; // coffee emoji
      }
      return getCardDisplayValue(game, player.value);
    }
    return resetEmoji;
  }

  return '';
};

const getCardDisplayValue = (game: Game, cardValue: number | null | undefined): string => {
  const cards = game.cards?.length > 0 ? game.cards : getCards(game.gameType);
  return cards.find((card) => card.value === cardValue)?.displayValue || cardValue?.toString() || '';
};