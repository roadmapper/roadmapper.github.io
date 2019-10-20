---
title: Chromecast Audio and Sonos (was almost meant to be)
---

## Background
Ever since I invested money into my first Sonos speakers (Sonos One and Sonos Beam), I have been perplexed as to why Sonos supported AirPlay 2 and not the seemingly more robust Chromecast/DASH/Cast protocol instead. When Sonos [announced the Sonos One](https://www.sonos.com/en-us/newsroom/sonos-unveils-smart-speaker-with-support-for-multiple-voice-services) in late 2017 it ushered in a new ecosystem that would be compatible with multiple voice assistants. My hope was be that the Google Assistant integration would also make the Sonos devices targets for Google Cast. Alas, May 2019 rolled around and Sonos launched Google Assistant support (after waiting for 19 months) and Google Cast support would not be available (unless Sonos decides to change their minds).

So, what kind of connectivity/integrations does exist for Sonos in 2019?
A non-exhaustive list:
- Using the Sonos App to play from [large number of supported music streaming providers](https://support.sonos.com/s/article/3459?language=en_US)
- Streaming to your Sonos system through [direct control](https://support.sonos.com/s/article/3549?language=en_US) (e.g. Spotify Connect)
- Summoning music via Alexa on a voice enabled Sonos device (Sonos One or Sonos Beam) or a Alexa capable device
- Summoning music via Google Assistant on a voice enabled Sonos device (Sonos One or Sonos Beam) or a Google Assistant capable device
- Summoning music via Siri (iOS or Homepod) for Apple Music or through Siri Shortcuts and [IFTTT](https://ifttt.com/sonos)
- AirPlay 2 (from Apple devices or through an app like DoubleTwist on Android)

This is already a pretty exhaustive list, but as a SoundCloud user (there seems to be less of us every single day 😢) on Android, I long for the seamless start/stop of my media from the native SoundCloud app to my Sonos system; similar to Spotify Connect or even casting via AirPlay 2. A great way to add that capability is to use a Chromecast Audio (unfortunately discontinued by Google, see notes at the end for using a regular Chromecast for this).

There are some very expensive network streamers that also support Chromecast built-in, but these device still leave with the issue of not having a way to integrate into the Sonos ecosystem:
https://vssl.com/product/a-1/
https://www.primare.net/products/np5-prisma/

There are some interesting options that exist to integrate a Chromecast Audio with an existing Sonos:
- Use the 3.5 mm line in on a Sonos Play:5 (comes with auto-detecting capabilities)
- Use the RCA line in on a Sonos Port, Connect, Connect:Amp or Amp
- Use the HDMI in on a Sonos Amp with an optical to HDMI adapter and a mini-TOSLINK to TOSLINK connection from the Chromecast Audio

Unfortunately, unless you _already_ have one of these Sonos components, these options are a little bit cost prohibitive (plus I don't think my neighbors would appreciate me adding a 7th speaker to my apartment 😅).


## Research
In searching for a way to make better use of my Raspberry Pi 3, I stumbled upon quite a few tutorials on how to integrate a Raspberry Pi and a sound card into a Sonos system; the best one I've seen is uses a USB external sound card: https://www.instructables.com/id/Add-Aux-to-Sonos-Using-Raspberry-Pi/

The set up described above can work with a Chromecast Audio pretty easily by adding a RCA to 3.5mm Y-cable to connect to the sound card to capture the input. However, I wasn't satisfied with just _analog_ audio since the Chromecast Audio actually has the capability to output digital PCM audio (up to 24 bit/96 KHz). Since I like to take on major yak-shaving projects, I thought this would be a great way build my own solution using the digital audio output and also learn more about the Chromecast and Sonos APIs to provide improved metadata to Sonos when playing audio.

Sonos supports playing a MP3 file over the network and reading metadata in a an Icecast 2 or Shoutcast format


## The Hardware
Parts needed for this project:
- Raspberry Pi (2B, 3B, 3B+ or 4B all have the appropriate GPIO headers and stand off PCB holes for the sound card)
- microSD card (8 GB+ preferred for Raspbian)
- Chromecast Audio
- micro-USB power supply (5V/2A preferred)
- HifiBerry Digi I/O or DAC DSP+ sound card
- mini-TOSLINK to TOSLINK cable

Luckily, there are still vendors on Google Shopping that will sell you new, old stock Chromecast Audio for an eye-watering $40 (remembering that these devices were available for as low as $15 right before Google discontinued them). If you want to try this with the native Bluetooth radio on the Raspberry Pi 3B or up, it is possible to do so with some caveats (refer to notes at the end).





## Setting Up Streaming
I won't go into all of the details on setting up a Raspberry Pi since the Instuctable does a good job of explaining of how to get Raspbian set up and configured on a Raspberry Pi.

To get the Hifiberry sound card to be recognized, the `/boot/config.txt` needs one of the following device tree overlays added: 
```ini
dtoverlay=hifiberry-digi
```
or
```ini
dtoverlay=hifiberry-dac
```

To test that the sound card is correctly configured:
```sh
# List audio capture devices
arecord -l
# Capture audio with CD quality for 60 seconds
arecord -D hw:1,0 -d 60 -f cd /tmp/test-mic.wav
```
This WAV file should have actual audio in it if the Chromecast Audio is hooked up and is already outputting the casted audio.

To broadcast the audio that will come from the sound card input, you will need to install Darkice (live audio streamer) and Icecast 2 (streaming audio server):
```sh
# Compile Darkice source (repository version does not come with LAME encoder)
vi /etc/apt/sources.list
# Uncomment the Debian source line
apt-get update
apt source darkice
cd darkice-1.3/
# Install Darkice
./configure –prefix=/usr –sysconfdir=/usr/share/doc/darkice/examples -–with-lame -–with-lame-prefix=/usr/lib/arm-linux-gnueabihf -–with-alsa -–with-alsa-prefix=/usr/lib/arm-linux-gnueabihf

# Install Icecast 2
apt-get install icecast2
```
Here is a suggestion for the Darkice configuration that lives at `/etc/darkice.cfg` (the input device will be whatever the `arecord -l` shows as the device address for the Hifiberry audio card):
```ini
# this section describes general aspects of the live streaming session
[general]
duration        = 0         # duration of encoding, in seconds. 0 means forever
bufferSecs      = 1         # size of internal slip buffer, in seconds
reconnect       = yes       # reconnect to the server(s) if disconnected
realtime        = yes       # run the encoder with POSIX realtime priority
rtprio          = 3         # scheduling priority for the realtime threads

# this section describes the audio input that will be streamed
[input]
device          = plughw:1,0    # OSS DSP soundcard device for the audio input
sampleRate      = 44100     # other settings have crackling audo, esp. 44100
bitsPerSample   = 16        # bits per sample. try 16
channel         = 2         # channels. 1 = mono, 2 = stereo

# this section describes a streaming connection to an IceCast2 server
# there may be up to 8 of these sections, named [icecast2-0] ... [icecast2-7]
# these can be mixed with [icecast-x] and [shoutcast-x] sections
[icecast2-0]
bitrateMode     = cbr       # provides a more consistent experience
format          = mp3
bitrate         = 320       # if not connected by Ethernet, consider 256 kbps
server          = localhost
port            = 8000
password        = hackme    # or whatever you set your icecast2 password to
mountPoint      = pi.mp3
name            = Chromecast
description     = Chromecast on Raspberry Pi
url             = localhost
public          = no
```

To allow the Sonos to keep the "radio station" playing, one can record a 1 second MP3 that is used as a fallback by Icecast:
```sh
apt-get install ffmpeg
ffmpeg -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -b:a 320k -t 1 /usr/share/icecast2/web/pi.mp3
```
Add a fallback mountpoint to the Icecast 2 config (`/etc/icecast2/icecast.xml`)
```xml
<mount>
    <mount-name>/rapi.mp3</mount-name>
</mount>
```


https://github.com/coreyk/darkice-libaacplus-rpi-guide
https://github.com/x20mar/darkice-with-mp3-for-raspberry-pi


https://www.raspberrypi.org/forums/viewtopic.php?t=165013
https://kbase.io/boadcast-sound-over-network-from-raspberrypi-with-rasbian-stretch-darkice-and-icecast2/
https://www.instructables.com/id/Play-Bluetooth-on-Sonos-Using-Raspberry-Pi/
https://github.com/x20mar/darkice-with-mp3-for-raspberry-pi
https://maker.pro/raspberry-pi/projects/how-to-build-an-internet-radio-station-with-raspberry-pi-darkice-and-icecast
https://github.com/raspberrypi/linux/issues/1402#issuecomment-481501676

https://www.hifiberry.com/shop/boards/hifiberry-digi-io/


Shoutcast
http://download.nullsoft.com/shoutcast/tools/sc_serv2_armv6_rpi-latest.tar.gz
https://github.com/dvdred/shoutcast-server/blob/master/arm_raspberry_pi/shoutcas_server2.tar.gz?raw=true

```
(venv) Vinays-MacBook-Pro:IcyChromecast vinaydandekar$ python icychromecast.py Sonos 192.168.0.100:8000 admin hackme
INFO:pychromecast:Querying device status
INFO:__main__:Found device: Sonos
INFO:__main__:DeviceStatus(friendly_name='Sonos', model_name='Chromecast Audio', manufacturer='Unknown manufacturer', uuid=UUID('5bce5f16-217e-26c8-f36f-a3083660bd39'), cast_type='audio')
INFO:__main__:CastStatus(is_active_input=None, is_stand_by=None, volume_level=0.7399999499320984, volume_muted=False, app_id='9A5289F5', display_name='SoundCloud', namespaces=['urn:x-cast:com.google.cast.debugoverlay', 'urn:x-cast:com.google.cast.cac', 'urn:x-cast:com.soundcloud.chromecast', 'urn:x-cast:com.google.cast.broadcast', 'urn:x-cast:com.google.cast.media'], session_id='7b0b38cc-9bea-44e0-a96a-33b4aff84007', transport_id='7b0b38cc-9bea-44e0-a96a-33b4aff84007', status_text='Ready to play')
INFO:__main__:Media status changed to: PLAYING, The Mat Zo Mix 005 [05-10-13] - Mat Zo
INFO:__main__:Update to Icecast server: 200

http://docs.python-soco.com/en/latest/api/soco.events.html
```


Notes:
https://www.amazon.com/Expert-Connect-Extractor-Coaxial-Optical/dp/B01M1H4X7N

Bluetooth:
https://github.com/raspberrypi/linux/issues/1402#issuecomment-481501676
https://scribles.net/streaming-bluetooth-audio-from-phone-to-raspberry-pi-using-alsa/#Ref01
