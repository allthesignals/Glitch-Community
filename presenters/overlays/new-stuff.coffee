"use strict"

moment = require 'moment'
markdown = require('markdown-it')({html: true})
  .use(require('markdown-it-sanitizer'))
Observable = require 'o_0'

OverlayNewStuffTemplate = require "../../templates/overlays/new-stuff"


module.exports = (application) ->

  self =

    newStuffLog: require('../new-stuff-log')(self)
    
    checkIfNewStuffVisible: Observable false
    newStuffNotificationVisible: Observable false
    newStuffOverlayVisible: Observable true
    newStuff: Observable []
    
    mdToNode: (md) ->
      node = document.createElement 'span'
      node.innerHTML = markdown.render md
      return node

    visibility: ->
      "hidden" unless self.newStuffOverlayVisible()
        
    newStuffOverlayVisibile: ->
      true

    getUpdates: ->
      MAX_UPDATES = 3
      updates = self.newStuffLog.updates()
      newStuffReadId = application.getUserPref 'newStuffReadId'
      totalUpdates = self.newStuffLog.totalUpdates()

      if newStuffReadId
        unread = totalUpdates - newStuffReadId
        newStuff = updates.slice(0, unread)
        self.newStuff newStuff
      else 
        latestStuff = updates.slice(0, MAX_UPDATES)
        self.newStuff latestStuff

    checked: (event) ->
      showNewStuff = application.getUserPref 'showNewStuff'
      if showNewStuff? and event?
        application.updateUserPrefs 'showNewStuff', event
      else if showNewStuff?
        return showNewStuff
      else
        application.updateUserPrefs 'showNewStuff', true
        true

    newStuffReadDate: ->
      newStuffReadDate = application.getUserPref 'newStuffReadDate'
      if newStuffReadDate
        new Date newStuffReadDate

    updateNewStuffRead: ->
      application.updateUserPrefs 'newStuffReadId', self.newStuffLog.updates()[0].id
      application.updateUserPrefs 'newStuffReadDate', new Date
  
  if self.newStuffOverlayVisible() is true
    self.getUpdates()
    self.updateNewStuffRead()
  
  return OverlayNewStuffTemplate self