import { createContext, useState, ReactNode, useContext } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList : Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  play: (episode : Episode) => void;
  playList: (list: Episode[], index: number) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  setPlayingState: (state: boolean) => void;
  hasNext : boolean;
  hasPrevious : boolean;
  isLooping: boolean;
  isShuffling: boolean;
  toggleShuffle: () => void;
  toggleLoop: () => void;
  clearPlayerState: () => void;
}
type PlayerContextProviderProps = {
  children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
   
  const [ episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);


  function play(episode){
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying)
  }
  function toggleLoop(){
    setIsLooping(!isLooping)
  }
  function toggleShuffle(){
    setIsShuffling(!isShuffling);
  }


  function setPlayingState(state : boolean){
    setIsPlaying(state);
  }

  const hasNext = isShuffling || (currentEpisodeIndex +1) < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext(){
    const nextEpisodeIndex = currentEpisodeIndex +1;

    if(isShuffling){
     const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
     setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    }else if(hasNext){
      setCurrentEpisodeIndex(currentEpisodeIndex +1);
    }
  }

  function playPrevious(){
    if(hasPrevious){
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function clearPlayerState(){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }
  
  return (
  <PlayerContext.Provider 
  value={{
    episodeList,
    setPlayingState, 
    currentEpisodeIndex, 
    play, 
    isPlaying, 
    togglePlay,
    playList,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    toggleLoop,
    isShuffling,
    toggleShuffle,
    clearPlayerState
    }}>
    {children}
  </PlayerContext.Provider>
   )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}
