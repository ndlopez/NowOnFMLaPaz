/*
  Display current song from LaPaz.fm
  Data from icecast, data wrangled using bash and Python
  It uses a lot of memory when downloading, and setting.
  Ref https://gitlab.com/justperfection.channel/how-to-create-a-gnome-shell-extension/-/tree/master/example@example.com
*/
const {St,GLib,Clutter} = imports.gi;
const Gio = imports.gi.Gio;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Me = imports.misc.extensionUtils.getCurrentExtension();

let panelBtn, panelBtnTxt, timeout;
let offset;//Confirm whether its Mon, Tue, to add extra time on <timeout>

function setNowPlaying(){
    var arr = [];
    var music = String.fromCharCode(9835); //add music symbol
    var currData=[];

    //display whether an app is running
    /*var [ok,out,err,exit] = GLib.spawn_command_line_sync('pgrep vlc');
    if (out.length > 0){arr.push('LaPaz'+music);}
    else{arr.push('Off');}*/
    
    //display hour:min using GLib
    var now = GLib.DateTime.new_now_local();
    var hora = now.format("%H:%M");//%Y/%m/%d

    //display current song
    var song='';
    var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash '+Me.dir.get_path() +'/get_fmLaPaz.sh');
    if (out.length > 0){
	song = imports.byteArray.toString(out).replace('\n','');
	if(song.length > 8){//={Offline, Not open}
	    currData=song.split(",");
	    arr.push(currData[0]+music);
	    Main.notify(hora+" Now Playing on FM La Paz",currData[1]);}
	else{arr.push(song)}
	//log('This project:'+Me.dir.get_path());
	log(hora + ' Listening: ' + song);
    }    
    else{
	log(hora+ ' VLC Not playing or some error');
    }
    panelBtnTxt.set_text(arr.join(' '));

    //using JS.Fetch and avoid python/ruby
    //log('Output from JSON.parse:' + getData(apiURL));

    //disp 'private' when running certain app
    //var [ok,out,err,exit] = GLib.spawn_command_line_sync('/bin/bash -c "ifconfig -a | grep wlp0"');
    //if (out.length > 0){arr.push('Private');}

    return true;
}

function init(){
    panelBtn = new St.Bin({
	style_class:"panel-button"
    });
    panelBtnTxt = new St.Label({
	style_class:"fmlapazPanel",
	text:"FM La Paz",
	y_align: Clutter.ActorAlign.CENTER,
    });
    panelBtn.set_child(panelBtnTxt);
}

function enable(){
    Main.panel._rightBox.insert_child_at_index(panelBtn,1);
    timeout=Mainloop.timeout_add_seconds(240.0,setNowPlaying);
}

function disable(){
    Mainloop.source_remove(timeout);
    Main.panel._rightBox.remove_child(panelBtn);
}
