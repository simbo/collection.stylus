/**
 * Converts given value to quoted string
 * =====================================================================
 */

module.exports = function(){
    return function(style){
        style.define('toString', function(val) {
            return val.toString();
        });
    };
};
