'use strict';

const _ = require('lodash');

/*
Similar:
- https://github.com/eddieantonio/single-key
- https://github.com/FGRibreau/match-when
*/

const match = (subject, ...cases) => {
    if (cases.length === 1 && _.isPlainObject(cases[0])) {
        const mapping = cases[0];
        let result;
        if (mapping.hasOwnProperty(subject)) {
            result = mapping[subject];
        } else if (mapping.hasOwnProperty(match.default)) {
            result = mapping[match.default];
        } else {
            throw new Error(`[match.js] Unmatched case: ${JSON.stringify(subject)}`);
        }
        
        if (_.isFunction(result)) {
            return result(subject);
        } else {
            return result;
        }
    } else {
        for (let [guard, result] of cases) {
            if (_.isObjectLike(guard)) {
                guard = _.matches(guard);
            }
            
            if (guard(subject)) {
                if (_.isFunction(result)) {
                    return result(subject);
                } else {
                    return result;
                }
            }
        }
        
        throw new Error(`[match.js] Unmatched case: ${JSON.stringify(subject)}`);
    }
};

match.case = (guard, fn) => [guard, fn];
match.otherwise = fn => [ _.constant(true), fn ];
match.default = Symbol();

module.exports = match;


/*
const matcher = parse => (subject, cases) {
    const [ discriminator, body ] = parse(subject);
    //...
};


const matchValue = matcher(subject => ([ subject, subject ]);
const matchType = matcher(subject => ([ subject.type, subject ]);
const matchSingleKey = matcher(subject => ([ Object.keys(subject)[0], subject[Object.keys(subject)[0]] ]));
*/
