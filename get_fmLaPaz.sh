#!/usr/bin/bash
#
#Get now playing on FM La Paz
#Ultralight Mon @ 9:00~12:00, Tue @ 10:00~13:00
#RockClasico Wed @ 16:00~17:00, Fri @ 10:00~11:00
#PopArt Mon @ 16:00~17:00, Wed & Thu @ 10:00~11:00, Thu @ 16:00~17:00
#

myDir=$HOME/.local/share/gnome-shell/extensions/fmLaPaz@moji.physics
outFile=$myDir/fmLaPaz_now.json
url=https://stream.consultoradas.com/cp/get_info.php?p=8042

gotData=`/usr/bin/curl -k --silent $url`

   
getVLC=`/usr/bin/pgrep vlc`
if [[ $getVLC > 0 ]];then
   currSong=$(echo $gotData | cut -f4 -d'"')
   
   if [[ ! $? == 0 ]];
   then
       echo "Cannot access"
   else
       nowListen=$(echo $gotData | cut -f16 -d'"')
       echo $nowListen,$currSong
   fi
else
   echo "Closed"
fi
