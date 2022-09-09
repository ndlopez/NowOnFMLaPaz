/*
  Gnome-Shell Extension
  Display current song from LaPaz.fm
  Data fetched from icecast.
  References:
  [1] https://gitlab.com/justperfection.channel/how-to-create-a-gnome-shell-extension/-/tree/master/example@example.com
  [2] https://smasue.github.io/gnome-shell-tw
  Developer: ndlopez (https://github.com/ndlopez)
  Issue: The extension cannot load due to usage of a deprecated method:
  obj.actor.add_actor
  Another issue with the URL, it returns a request response = 6!?
  Added another URL to test if the JS code is correct, it works. 
  Thus, fm La Paz URL has some issues, expiry code probably?

  Last updated on 2022-05-17
*/
const {St, GLib, Clutter} = imports.gi;
const Main = imports.ui.main;
const Soup = imports.gi.Soup;
const Lang = imports.lang;
const Mainloop = imports.mainloop;
const PanelMenu = imports.ui.panelMenu;
const Me = imports.misc.extensionUtils.getCurrentExtension();

const LAPAZ = 'https://icecasthd.net:2199/rpc/lapazfm/streaminfo.get';
const THIRD_ROCK = 'https://feed.tunein.com/profiles/s151799/nowPlaying';
const ALT_X = 'https://feed.tunein.com/profiles/s293700/nowPlaying'

const stations = ["FM La Paz","3rd Rock Radio","113.fm Alt-x"];
const STREAM_URL = [LAPAZ,THIRD_ROCK,ALT_X]
let _httpSession;

const NowPlaying = new Lang.Class({
    Name:"NowPlaying",Extends:PanelMenu.Button,
    _init:function(){
	    /*let panelBtn = new St.Bin({
		style_class:"panel-button"
	    });*/
        this.parent(0.0,"Now Playing",false);
        this.labelText = new St.Label({
            text:_(stations[1]),
            y_align:Clutter.ActorAlign.CENTER
        });
    	//The following builds a button
	    //let topBox = new St.BoxLayout();
	    //topBox.add_actor(this.buttonText);
	    //topBox.add_actor(this.iconText);//create iconText 1st!
        //this.add_actor(topBox);
	    //panelBtn.set_child(this.buttonText);
	    //this.panelBtn.set_child(this.buttonText);
	this.add_actor(this.labelText);
        this._refresh();
    },
    _refresh:function(){
        this._loadData(this._refreshUI);
        this._removeTimeout();
        this._timeout = Mainloop.timeout_add_seconds(240,Lang.bind(this,this._refresh));
        return true;
    },
    _loadData:function(){
        _httpSession = new Soup.Session();
        let msg = Soup.Message.new('GET',STREAM_URL[1]);
        //log(stations[1] + ", connecting to: " + THIRD_ROCK);
        msg.connect('got_headers', Lang.bind(this, function(message) {
            log(stations[1] + " status: " + message.status_code);
        }));

        _httpSession.queue_message(msg,Lang.bind(this,function(_httpSession,msg){
            if (msg.status_code !== 200){
                log(stations[1] + ": Connection error " + msg.status_code );
                return;}
            let json = JSON.parse(msg.response_body.data);
            this._refreshUI(json);
        }));
    },
    _refreshUI:function(data){
        var musicChar = String.fromCharCode(9835);
        var now = GLib.DateTime.new_now_local();
        var hora = now.format("%H:%M ");
        //let currSong = data['data'][0]['song'];
        let currSong = data['Header']['Subtitle'];
        ////if (currSong == 'Ads - Block'){extend updating time}
        //let listenNow = data['data'][0]['listeners'] + musicChar;
        var currArtist = currSong.split("-");
        let listenNow = currArtist[0] + musicChar;

        //log(hora+"Now Playing "+currSong);
        Main.notify(hora+" Now Playing on "+stations[1],currSong);
        this.labelText.set_text(listenNow);
    },
    _removeTimeout:function(){
        if(this._timeout){
            Mainloop.source_remove(this._timeout);
            this._timeout=null;
        }
    },
    stop:function(){
        if(_httpSession !== undefined){
            _httpSession.abort();
        }
        _httpSession=undefined;
        if(this._timeout){
            Mainloop.source_remove(this._timeout);
        }
        this._timeout=undefined;
        this.menu.removeAll();
    }
});

let nowPlayingMenu;

function init(){
    log(stations[1] + ": Application started");
}

function enable(){
    nowPlayingMenu=new NowPlaying;
    Main.panel.addToStatusArea('np-indicator',nowPlayingMenu);
}

function disable(){
    nowPlayingMenu.stop();
    nowPlayingMenu.destroy();
}
