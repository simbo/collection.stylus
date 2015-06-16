/**
 * Retrieves the extension of a filename string
 * =====================================================================
 */

module.exports = function(){
    return function(style){
        style.define('fileExt', function(val) {
            return val.toString().split('.').pop().replace(/['"]/g,'');
        });
    };
};
