#!/usr/bin/ruby
require 'rubygems'
require 'json'

fmLaPazJson = File.read('/home/diego/.local/share/gnome-shell/extensions/fmLaPaz@moji.physics/fmLaPaz_now.json')
obj = JSON.parse(fmLaPazJson,{allow_nan:true})
info=[]

#obj.Results.map{|result| result.Paths.map{|path| info << path.Domain }}
puts obj["data"][0]["song"]
