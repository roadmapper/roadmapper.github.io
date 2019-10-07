---
title: Chromecast Audio and Sonos (was almost meant to be)
---

Ever since I invested money into my first Sonos speakers (Sonos One and Sonos Beam), I have been perplexed as to why Sonos supported AirPlay 2 and not the seemingly more robust Chromecast/DASH/Cast protocol instead. When Sonos [announced the Sonos One](https://www.sonos.com/en-us/newsroom/sonos-unveils-smart-speaker-with-support-for-multiple-voice-services) in late 2017 it ushered in a new ecosystem that would be compatible with multiple voice assistants. My hope was be that the Google Assistant integration would also make the Sonos devices targets for Google Cast. Alas, May 2019 rolled around and Sonos launched Google Assistant support (after waiting for 19 months) and Google Cast support would not be available (unless Sonos decides to change their minds).

So, what kind of connectivity/integrations does exist for Sonos in 2019?
A non-exhaustive list:
- Using the Sonos App to play from [large number of supported music streaming providers](https://support.sonos.com/s/article/3459?language=en_US)
- Streaming to your Sonos system through [direct control](https://support.sonos.com/s/article/3549?language=en_US) (e.g. Spotify Connect)
- Summoning music via Alexa on a voice enabled Sonos device (Sonos One or Sonos Beam) or a Alexa capable device
- Summoning music via Google Assistant on a voice enabled Sonos device (Sonos One or Sonos Beam) or a Google Assistant capable device
- Summoning music via Siri (iOS or Homepod) for Apple Music or through Siri Shortcuts and [IFTTT](https://ifttt.com/sonos)
- AirPlay 2 (from Apple devices or through an app like DoubleTwist on Android)

This is already a pretty exhaustive list, but as a SoundCloud user (there seems to be less of us every single day 😢) on Android, I long for the seamless start/stop of my media from the native SoundCloud app to my Sonos system like Spotify Connect or even casting via AirPlay 2. A great way to add that capability is to use a Chromecast Audio (unfortunately discontinued by Google, see notes at the end for using a Chromecast for this).

There are some interesting options that exist to integrate a Chromecast Audio with an existing Sonos:
- Use the 3.5 mm line in on a Sonos Play:5 (comes with auto-detecting capabilities)
- Use the RCA line in on a Sonos Port, Connect, Connect:Amp or Amp

Unfortunately, unless you _already_ have one of these Sonos components, these options are a little bit cost prohibitive (plus I don't think my neighbors would appreciate me adding a 7th speaker to my apartment 😅).

In searching for a way to make better use of my Raspberry PI 3, I stumbled upon quite a few tutorials on how to integrate a Raspberry Pi and a sound card into a Sonos system; the best one I've seen is uses a external sound card from Behringer:
https://www.instructables.com/id/Add-Aux-to-Sonos-Using-Raspberry-Pi/

The set up described above can work with a Chromecast Audio pretty easily by adding a RCA to 3.5mm Y-cable to connect to the sound card to capture the input. However, I wasn't satisfied with just _analog_ audio since the Chromecast Audio actually has the capability to output digital PCM audio (up to 24 bit/96 KHz). Since I like to take on major yak-shaving projects, I thought this would be a great way build my own solution and also learn more about the Chromecast and Sonos APIs so I could provide metadata to Sonos when playing audio.

Parts needed for this project:
- Raspberry Pi (2B, 3B, 3B+ or 4B all have the appropriate GPIO headers and stand off PCB holes for the sound card)
- microSD card (8 GB+ preferred for Raspbian)
- Chromecast Audio
- micro-USB power supply (5V/2A preferred)
- HifiBerry Digi I/O or DAC DSP+ sound card

Luckily, there are still vendors on Google Shopping that will sell you new, old stock Chromecast Audio for an eye-watering $40 (remebering that these devices were available for as low as $15 right before Google discontinued them). If you want to try this with the native Bluetooth radio on the 3B or up that is possible with some caveats (refer to notes at the end).

I won't go into all of the details on setting up a Rasberry PI since the Instuctable does a good job of explaining of how to get Raspbian set up and configured on a Rasberry Pi.

Some key configuration items to note:
/boot/config.txt
```
dtoverlay=hifiberry-digi
```
or
```
dtoverlay=hifiberry-dac
```

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
