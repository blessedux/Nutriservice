import React from 'react';
import {Img, OffthreadVideo, staticFile} from 'remotion';

type Props = {
  transform: string;
  opacity: number;
  screenSrc?: string;
  screenVideoSrc?: string;
};

export const IPhoneMockup: React.FC<Props> = ({
  transform,
  opacity,
  screenSrc = iphoneDefaultScreen,
  screenVideoSrc,
}) => {
  return (
    <div style={{transform, opacity}}>
      <div
        style={{
          width: 220,
          padding: 10,
          borderRadius: 42,
          background: 'linear-gradient(160deg, #3a3f45, #101214)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
      >
        <div
          style={{
            position: 'relative',
            borderRadius: 32,
            overflow: 'hidden',
            background: '#000',
            aspectRatio: '9 / 19.5',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 60,
              height: 18,
              borderRadius: 12,
              background: '#000',
              zIndex: 2,
            }}
          />
          {screenVideoSrc ? (
            <OffthreadVideo
              src={screenVideoSrc}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
              muted
            />
          ) : (
            <Img
              src={screenSrc}
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const iphoneDefaultScreen = staticFile('screenshots/home-mobile.png');
export const iphoneScrollVideo = staticFile('screenshots/homepage-scroll-mobile.webm');
