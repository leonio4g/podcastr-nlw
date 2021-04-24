import { useEffect, useRef, useState } from 'react';
import Image  from 'next/image';
import { usePlayer } from '../../contexts/playerContext';
import styles from './styles.module.scss'
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import { convertDuration } from '../../utils/ConvertionDuration';

export function Player(){
  const [progress, setProgress] = useState(0)

  const audioRef  = useRef<HTMLAudioElement>(null);

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    togglePlay,
    setPlayingState,
    playNext,
    isShuffling,
    toggleShuffle,
    isLooping,
    toggleLoop,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState
  } = usePlayer();

  const episode = episodeList[currentEpisodeIndex];

  useEffect(() => {
    if(!audioRef.current) {
      return;
    }

    if(isPlaying) {
      audioRef.current.play();
    }else{
      audioRef.current.pause();
    }
  },[isPlaying]);

  function setupProgressListener(){
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', event => {
      setProgress(Math.floor(audioRef.current.currentTime))
    });
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext();
    }else {
      clearPlayerState();
    }
  }
  return(
    <div className={styles.playerContainer} >
      <header>
        <img src="/playing.svg" alt="tocando agora"/>
        <strong>Tocando agora</strong>
      </header>
      { episode ? (
        <div className={styles.currentEpisode} >
          <Image 
          width={592} 
          height={592} 
          src={episode.thumbnail} 
          objectFit="cover" 
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer} >
        <strong>Selecione um podcastr para ouvir</strong>
      </div>
      )}

      <footer className={!episode ? styles.empty : ''} >
        <div className={styles.progress} >
        <span>{convertDuration(progress)}</span>
          {episode ? (
            <Slider 
            max={episode.duration}
            value={progress}
            onChange={handleSeek}
              trackStyle={{backgroundColor: '#04d361'}}
              railStyle={{backgroundColor: '#9f75ff'}}
              handleStyle={{borderColor: '#04d361', borderWidth: 4}}
            />
          ) : (
            <div className={styles.slider} >
          <div className={styles.emptySlider} />
          </div>
          )}
          <span>{convertDuration(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio 
            src={episode.url}
            ref={audioRef}
            autoPlay
            onLoadedMetadata={setupProgressListener}
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
          />
        )}

        <div className={styles.buttons} >
          <button 
          type='button' 
          disabled={!episode || episodeList.length === 1}
          onClick={toggleShuffle}
          className={isShuffling ? styles.isActive : ''}
           >
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious} >
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type='button' onClick={togglePlay} disabled={!episode} className={styles.playButton} >
           {isPlaying 
           ?  <img src="/pause.svg" alt="Tocar"/>
          :  <img src="/play.svg" alt="Tocar"/>
           }
          </button>
          <button type='button' onClick={playNext} disabled={!episode || !hasNext} >
            <img src="/play-next.svg" alt="Tocar Proxima"/>
          </button>
          <button 
          type='button' 
          disabled={!episode} 
          onClick={toggleLoop}
          className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetiir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}