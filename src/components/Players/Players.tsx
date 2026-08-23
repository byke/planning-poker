import { Game } from '../../types/game';
import { Player } from '../../types/player';
import { PlayerCard } from './PlayerCard/PlayerCard';

interface PlayersProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}

const TEAMS = ['Back End Developers', 'Front End Developers', 'Quality Assurance'];

export const Players: React.FC<PlayersProps> = ({ game, players, currentPlayerId }) => {
  // Group players by team
  const playersByTeam = TEAMS.reduce((acc, team) => {
    acc[team] = players.filter((player) => player.team === team);
    return acc;
  }, {} as Record<string, Player[]>);

  return (
    <div className='pt-8 px-4'>
      <div className='flex flex-row justify-center gap-6 flex-wrap'>
        {TEAMS.map((team) => (
          <div
            key={team}
            id={`team-panel-${team.replace(/\s+/g, '-')}`}
            className='border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 flex-1 min-w-80 max-w-96'
          >
            <h3 className='text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300'>
              {team}
            </h3>
            <div className='grid grid-cols-3 gap-2 w-full'>
              {playersByTeam[team].length > 0 ? (
                playersByTeam[team].map((player: Player) => (
                  <PlayerCard
                    key={player.id}
                    game={game}
                    player={player}
                    currentPlayerId={currentPlayerId}
                  />
                ))
              ) : (
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                  No members joined yet
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};