import React, { useEffect, useState } from 'react';
import { Game } from '../../types/game';
import { Player } from '../../types/player';
import { PlayerCard } from './PlayerCard/PlayerCard';
import { ThemeName } from '../../utils/themeUtils';

interface PlayersProps {
  game: Game;
  players: Player[];
  currentPlayerId: string;
}

const TEAMS = ['Back End Developers', 'Front End Developers', 'Quality Assurance'];

export const Players: React.FC<PlayersProps> = ({ game, players, currentPlayerId }) => {
  const [resetEmoji, setResetEmoji] = useState('🤔');

  // Update emoji when game theme changes
  useEffect(() => {
    const emojiMap: Record<ThemeName, string> = {
      light: '🤔',
      dark: '🤔',
      halloween: '👻',
      christmas: '🎅',
      stPatricks: '🍀',
      easter: '🐰',
    };
    if (game.theme) {
      setResetEmoji(emojiMap[game.theme]);
    }
  }, [game.theme]);

  // Also listen for manual theme changes (user selecting from dropdown)
  useEffect(() => {
    const handleThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<ThemeName>;
      const selectedTheme = customEvent.detail;
      const emojiMap: Record<ThemeName, string> = {
        light: '🤔',
        dark: '🤔',
        halloween: '👻',
        christmas: '🎅',
        stPatricks: '🍀',
        easter: '🐰',
      };
      setResetEmoji(emojiMap[selectedTheme]);
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  // Group players by team
  const playersByTeam = TEAMS.reduce((acc, team) => {
    acc[team] = players.filter((player) => player.team === team);
    return acc;
  }, {} as Record<string, Player[]>);

  // Get observers separately
  const observers = players.filter((player) => player.team === 'Observer');

  return (
    <div className='pt-3 px-2'>
      <div className='flex flex-row justify-center gap-3 flex-wrap'>
        {TEAMS.map((team) => {
          const teamPlayers = playersByTeam[team];

          // Skip rendering panel if team has no players
          if (teamPlayers.length === 0) return null;

          return (
            <div
              key={team}
              id={`team-panel-${team.replace(/\s+/g, '-')}`}
              className='border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 flex-1 min-w-72 max-w-none'
            >
              <h3 className='text-base font-semibold mb-4 text-gray-700 dark:text-gray-300'>
                {team}
              </h3>
              <div className='grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2 justify-items-center w-full'>
                {teamPlayers.length > 0 ? (
                  teamPlayers.map((player: Player) => (
                    <PlayerCard
                      key={player.id}
                      game={game}
                      player={player}
                      currentPlayerId={currentPlayerId}
                      resetEmoji={resetEmoji}
                    />
                  ))
                ) : (
                  <p className='text-gray-500 dark:text-gray-400 text-sm'>
                    No members joined yet
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* Observers Panel */}
        {observers.length > 0 && (
          <div
            key='observers'
            id='team-panel-observers'
            className='border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800 flex-1 min-w-72 max-w-none'
          >
            <h3 className='text-base font-semibold mb-4 text-gray-700 dark:text-gray-300'>
              Observers
            </h3>
            <div className='grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2 justify-items-center w-full'>
              {observers.map((player: Player) => (
                <PlayerCard
                  key={player.id}
                  game={game}
                  player={player}
                  currentPlayerId={currentPlayerId}
                  resetEmoji={resetEmoji}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};