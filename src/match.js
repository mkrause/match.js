
const _ = require('lodash');

/*
Similar:
- https://github.com/eddieantonio/single-key
- https://github.com/FGRibreau/match-when
*/

const match = (value, ...cases) => {
    if (cases.length === 1 && _.isPlainObject(cases[0])) {
        const mapping = cases[0];
        let result;
        if (mapping.hasOwnProperty(value)) {
            result = mapping[value];
        } else if (mapping.hasOwnProperty(match.default)) {
            result = mapping[match.default];
        } else {
            throw new Error(`[match.js] Unmatched case: ${JSON.stringify(value)}`);
        }
        
        if (_.isFunction(result)) {
            return result(value);
        } else {
            return result;
        }
    } else {
        for (let [guard, result] of cases) {
            if (_.isObjectLike(guard)) {
                guard = _.matches(guard);
            }
            
            if (guard(value)) {
                if (_.isFunction(result)) {
                    return result(value);
                } else {
                    return result;
                }
            }
        }
        
        throw new Error(`[match.js] Unmatched case: ${JSON.stringify(value)}`);
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
