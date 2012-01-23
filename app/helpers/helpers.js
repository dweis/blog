var config = require('config').config
  , gravatar = require('gravatar')
  , moment = require('moment')
  , jade = require('jade')
  , markdown = require('markdown').markdown

exports.dynamicHelpers = {
  flash_error: function(req, res) {
    try {
      return req.flash('error')
    } catch (e) {
      return []
    }
  },

  flash_info: function(req, res) {
    try {
      return req.flash('info')
    } catch (e) {
      return []
    }
  },

  is_authenticated: function(req, res) {
    if (typeof req.getAuthDetails().user != 'undefined') {
      return true
    }

    return false
  }, 

  is_admin: function(req, res) {
    try {
      if (typeof req.session.admin != 'undefined') {
        return req.session.admin
      }
    } catch (e) {
    }

    return false
  },

  user: function(req, res) {
    if (typeof req.getAuthDetails().user != 'undefined') {
      return req.getAuthDetails().user
    }

    return null
  },

  current_user_photo: function(req, res) {
    if (typeof req.getAuthDetails().user != 'undefined') {
      return gravatar.url(req.getAuthDetails().user.email, {s: '64', r: 'pg', d: '404'})
    }

    return ''
  }
}

exports.helpers = {
  theme_css: function() {
    return '/styles/' + config.theme + '.css'
  },

  site_name: function() {
    return config.siteName
  },

  absolute_to: function(asset) {
    return config.baseUrl + asset
  },

  user_photo: function(email) {
    if (email) {
      return gravatar.url(email, {s: '64', r: 'pg', d: '404'})
    }

    return ''
  },

  pluralize: function(word, count) {
    if (count == 1 || count == -1) {
      return count + ' ' + word
    } else {
      return count + ' ' + word + 's'
    }
  },

  pretty_date: function(datestamp) {
    return moment(datestamp).fromNow()
  },

  ads_code: function() {
    return typeof config.adCode != 'undefined' ? config.adCode : ''
  },

  analytics_code: function() {
    return typeof config.analyticsCode != 'undefined' ? config.analyticsCode : ''
  },

  markdown: function(md) {
    return markdown.toHTML(md)
  },

  custom_links: function() {
    return config.customLinks
  }
}
