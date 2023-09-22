'use strict';
var logger = require('../helpers/logger')();
var moment = require("moment");
exports.decorate = (req, res) => {

    const log = logger.start({ location: req.method + ' ' + req.url, method: req.method, url: req.url })
    res.log = log
    res.logger = log

    if (req.body) {
        log.debug(req.body)
    }

    res.success = (message, code, version) => {
        let val = {
            isSuccess: true,
            message: message,
            code: code,
            version: version
        }
        log.silly(message || 'success', val)
        log.end()
        res.json(val)
    }
    res.failure = (error, message) => {
        var val = {
            isSuccess: false,
            error: message,
            message: error.stack || error.message || error,
        };
        res.log.error(message || 'failed', val);
        res.json(val);
    }
    res.accessDenied = (error, message) => {
        let errorStatus = 400
        if (error && error.status) {
            errorStatus = error.status
        }
        res.status(errorStatus)
        let val = {
            isSuccess: false,
            message: message || 'Insufficient Permission',
            error: 'ACCESS_DENIED',
            code: 'ACCESS_DENIED'
        }
    }

    res.data = (item, message, code) => {
        let val = {
            isSuccess: true,
            message: message,
            data: item,
            code: code
        }
        log.silly(message || 'success', val)
        log.end()

        if (item.timeStamp) {
            res.set('Last-Modified', moment(item.timeStamp).toISOString())
        }

        res.json(val)
    }
    res.page = (items, pageNo, pageSize, total, stats) => {
        let val = {
            isSuccess: true,
            pageNo: pageNo || 1,
            items: items,
            pageSize: pageSize || items.length,
            stats: stats,
            count: total,
            total: total || items.length || pageSize, // TODO: obsolete
            totalRecords: total // TODO: obsolete
        }

        log.silly('page', val)
        log.end()
        res.json(val)
    }

    res.pageWithPaging = (items, pageNo, pageSize, totalRecords) => {
        if (!pageSize) pageSize = items.length;

        let val = {
            isSuccess: true,
            items: items,
            total: items.length,
            pageNo: pageNo || 1,
            pageSize: items.length > pageSize ? items.length : pageSize,
            totalRecords: totalRecords || items.length,
        };

        res.log.info('page', val);
        res.json(val);
    }
}