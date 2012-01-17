function updateTitle(title) {
  $('#preview')
    .find('h1')
    .text(title)
}

function updateTags(tags) {
  $('#preview')
    .find('a')
    .remove()

  _.each(tags.split(','), function(tag) {
    $('#preview')
      .find('.tags')
      .append($('<a>', {href: '#'}).html(tag.trim()))
  })
}

$(function(){
  $('#post-title').keyup(function(ev){
    updateTitle($(this).val())
  }).bind('paste', function(ev) {
    updateTitle($(this).val())
  })

  $('#post-tags').keyup(function(ev){
    updateTags($(this).val())
  }).bind('paste', function(ev) {
    updateTags($(this).val())
  })
})
