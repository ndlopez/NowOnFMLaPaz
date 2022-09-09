#!/usr/bin/bash
#
#Get now playing on FM La Paz
#Ultralight Mon @ 9:00~12:00, Tue @ 10:00~13:00
#RockClasico Wed @ 16:00~17:00, Fri @ 10:00~11:00
#PopArt Mon @ 16:00~17:00, Wed & Thu @ 10:00~11:00, Thu @ 16:00~17:00
#

myDir=$HOME/.local/share/gnome-shell/extensions/fmLaPaz@moji.physics
outFile=$myDir/fmLaPaz_now.json
url=https://icecasthd.net:2199/rpc/lapazfm/streaminfo.get

errFile=$myDir/err.log
if [ -f $errFile ];then
	rm $errFile
fi

getVLC=`/usr/bin/pgrep vlc`
if [[ $getVLC > 0 ]];then
	/usr/bin/curl -s $url 2>$errFile 1> $outFile
	err=`ls -l $errFile | awk -F" " '{print $5;}'`
	if [[ $err > 0 ]];then
		#cd $myDir
		echo "Offline"
	else
		/usr/bin/python3.9 $myDir/get_artist.py $outFile
	fi
else
	echo "Closed"
fi
