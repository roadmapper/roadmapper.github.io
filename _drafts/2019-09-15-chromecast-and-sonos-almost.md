---
title: Chromecast Audio and Sonos (was almost meant to be)
---

Ever since I invested money into my first Sonos speakers (Sonos One and Sonos Beam), I was perplexed why Sonos supported AirPlay 2 and not the seemingly more robust Chromecast/DASH/Cast protocol instead. When Sonos [announced](https://www.sonos.com/en-us/newsroom/sonos-unveils-smart-speaker-with-support-for-multiple-voice-services) the Sonos One in late 2017 it ushered a capable ecosystem that would be compatible with multiple voice assistants. My hope would be that the Google Assistant integration would also make the Sonos devices targets for Google Cast. Alas, May 2019 rolled around with Google Assistant support after waiting for 19 months and Google Cast support would not be available (unless Sonos decides to change their minds).

What kind of connectivity/integrations does exist for Sonos in 2019 then?
A non-exhaustive list:
- Using the Sonos App to play from large list of supported music streaming providers
- Using Spotify Connect
- Summoning music from Alexa on a voice enabled Sonos device (Sonos One or Sonos Beam) or a Alexa capable device
- AirPlay 2 (from Apple devices or you have DoubleTwist on Android)
- Summoning music from Siri (iOS or Homepod) for Apple Music or through Siri Shortcuts and [IFTTT](https://ifttt.com/sonos)
- Summoning music from Google Assistant on a voice enabled Sonos device (Sonos One or Sonos Beam) or a Google Assistant capable device



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
```
