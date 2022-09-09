/*
  New fmLaPaz@moji.physics Gnome 42 extension
*/
'use strict';

const {St, Gio, Clutter, Soup, Glib} = imports.gi;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;

let panelBtn;
let panelBtnLbl;
let _httpSession;
let _musicSymbol;
let sourceId = null;

function init(){
}

function enable(){
    panelBtn = new St.Bin({
	style_class : "panel-btn",
    });

    json_async_load();
    Main.panel._leftBox.insert_child_at_index(panelBtn,0);

}
