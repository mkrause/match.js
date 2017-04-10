'use strict';

const _ = require('lodash');


// Utility

const getSingleKey = obj => {
    if (!_.isPlainObject(obj)) {
        throw new Error(`Error: expected object, given '${JSON.stringify(obj)}'`);
    }
    
    const keys = Object.keys(obj);
    if (keys.length !== 1) {
        throw new Error(`Error: expected object with single key, given '${JSON.stringify(obj)}'`);
    }
    
    const key = keys[0];
    return { key, value: obj[key] };
};


// Common definitions
const defaultCase = Symbol('match.default');
const defs = {
    case: (predicate, value) => [predicate, value],
    otherwise: fn => [defaultCase, fn ],
    default: defaultCase,
};


// Match against an object, where each property is one case:
//   match('x', { x: 1, y: 2 })
const matchAgainstObject = (discriminator, body, cases) => {
    let matchedCase;
    if (cases.hasOwnProperty(discriminator)) {
        matchedCase = cases[discriminator];
    } else if (cases.hasOwnProperty(defs.default)) {
        matchedCase = cases[defs.default];
    } else {
        throw new Error(`[match.js] Unmatched case: ${JSON.stringify(discriminator)}`);
    }
    
    // If the property is a function, pass the subject body
    let result;
    if (_.isFunction(matchedCase)) {
        result = matchedCase(body);
    } else {
        result = matchedCase;
    }
    
    return result;
};

// Match against a list of predicate functions:
//   match({ type: 'x' }, [{ type: 'x' }, 1], [{ type: 'y' }, 2])
const matchAgainstPredicates = (discriminator, body, predicates) => {
    for (let [predicate, predicateCase] of predicates) {
        // If given an object
        if (_.isObjectLike(predicate)) {
            predicate = _.matches(predicate);
        }
        
        let matchedCase;
        if (predicate === discriminator) {
            matchedCase = predicateCase;
        } else if (_.isFunction(predicate) && predicate(discriminator) == true) {
            // Note: using weak equality (==) for predicate check
            matchedCase = predicateCase;
        } else if (predicate === defs.default) {
            matchedCase = predicateCase;
        }
        
        if (matchedCase !== undefined) {
            if (_.isFunction(matchedCase)) {
                return matchedCase(body);
            } else {
                return matchedCase;
            }
        }
    }
    
    // Fall-through: no match
    throw new Error(`[match.js] Unmatched case: ${JSON.stringify(discriminator)}`);
};


// Create a new matcher using the given parser
const matcher = parseSubject => {
    const matcher = (subject, ...args) => {
        const { discriminator, body } = parseSubject(subject);
        
        let result;
        if (args.length === 1 && _.isPlainObject(args[0])) {
            const cases = args[0];
            result = matchAgainstObject(discriminator, body, cases);
        } else if (args.length === 1 && _.isArray(args[0])) {
            const predicates = args[0];
            result = matchAgainstPredicates(discriminator, body, predicates);
        } else if (args.length >= 1) {
            const predicates = args;
            result = matchAgainstPredicates(discriminator, body, predicates);
        } else {
            throw new Error(`[match.js] Invalid arguments given`);
        }
        
        return result;
    };
    
    return Object.assign(matcher, defs);
};


// Specific matchers

// Generic match. Accept any subject, and discriminate using the value itself
const match = matcher(subject => ({ discriminator: subject, body: subject }));

// Match on objects with a `type` property
const matchType = matcher(subject => {
    if (!_.isObjectLike(subject)) {
        throw new Error(`[match.js] Expected an object, given ${JSON.stringify(subject)}`);
    }
    if (!subject.hasOwnProperty('type')) {
        throw new Error(`[match.js] Missing 'type' property, given ${JSON.stringify(subject)}`);
    }
    
    return { discriminator: subject.type, body: subject };
});

const matchSingleKey = matcher(subject => {
    if (!_.isObjectLike(subject)) {
        throw new Error(`[match.js] Expected an object, given ${JSON.stringify(subject)}`);
    }
    
    const keys = Object.keys(subject);
    
    if (keys.length !== 1) {
        throw new Error(`[match.js] Expected an object with a single key, given ${JSON.stringify(subject)}`);
    }
    
    const discriminator = keys[0];
    return { discriminator, body: subject[discriminator] };
});

module.exports = { matcher, match, matchType, getSingleKey, matchSingleKey };

// ES6 module interop
module.exports['default'] = match;
module.exports.__esModule = true;
