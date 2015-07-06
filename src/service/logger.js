import fs from 'fs';
import util from 'util';
import config from '../../config';

/**
 * Construct a logger, it can record the verbose, info , warning, error message and
 * write it to the file you specified.
 *
 * Options:
 *     infoFile: Path of the file for recording verbose and info message.
 *     errFile: Path of the file for recording warning and error message.
 *     append: Decide append or truncate the file if it exists. Default to be true.
 *     timestamp: Output the timestamp or not. Default to be true.
 *
 * @param {Object} opts - options
 * @returns {Object} The logger
 */
function createLogger(opts) {
    let { infoFile, errFile, append = true, timestamp = true } = opts,
        flag = append ? 'a' : 'w',
        infoStream = infoFile && fs.createWriteStream(infoFile, { flags: flag }),
        errStream = errFile && fs.createWriteStream(errFile, { flags: flag }),
        logger = {};

    logger.verbose = function() {
        infoStream && log(infoStream, '[Verbose]').apply(this, arguments);
    };
    logger.info = function() {
        infoStream && log(infoStream, '[Info]').apply(this, arguments);
    };
    logger.warning = function() {
        errStream && log(errStream, '[Warning]').apply(this, arguments);
    };
    logger.error = function() {
        errStream && log(errStream, '[Error]').apply(this, arguments);
    };

    function log(stream, prefix) {
        let msg = prefix + ' ' + (timestamp ? getCurrentDateString(): '') + ' ';
        return function () {
            let args = Array.prototype.slice.call(arguments);
            stream.write(util.format.apply(this, [].concat(msg, args)) + '\n');
        };
    }

    function getCurrentDateString() {
        return Date();
    }

    return logger;
}

export default createLogger({
    infoFile: config.log && config.log.info,
    errFile: config.log && config.log.err
});
