exports.items = ['items'];

exports.itemTotal = [exports.items, function(items){
    return items && items.size || 0
}]
