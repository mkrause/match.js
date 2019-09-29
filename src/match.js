
import msg from 'message-tag';


// Utilities

// Version of `obj.hasOwnProperty()` that works regardless of prototype
const hasOwnProperty = (obj, propName) => Object.prototype.hasOwnProperty.call(obj, propName);


const defaultTag = Symbol('match.default');


const matchProps = {
    default: defaultTag,
};


// Matcher: subject is of type `Tag`.
export const match = (tag, cases) => {
    let matchedCase;
    
    if (hasOwnProperty(cases, tag)) {
        matchedCase = cases[tag];
    } else if (hasOwnProperty(cases, defaultTag)) {
        matchedCase = cases[defaultTag];
    } else {
        throw new TypeError(msg`Unmatched case: ${tag}`);
    }
    
    if (typeof matchedCase === 'function') {
        return matchedCase(tag);
    } else {
        return matchedCase;
    }
};
Object.assign(match, matchProps);


// Matcher: subject is of type `{ type : Tag }`.
export const matchType = (subject, cases) => {
    if (typeof subject !== 'object' || subject === null) {
        throw new TypeError(msg`Expected object, given ${subject}`);
    }
    
    // Note: use `in` operator rather than `hasOwnProperty`, it's fine if the type is further up the prototype chain
    if (!('type' in subject)) {
        throw new TypeError(msg`Missing property 'type' on object ${subject}`);
    }
    
    return match(subject[type], cases);
};
Object.assign(matchType, matchProps);


// Builder function for a custom matcher.
export const matcher = parseSubject => {
    const matchFn = (subject, cases) => {
        const { tag, body } = parseSubject(subject);
        
        let matchedCase;
        
        if (hasOwnProperty(cases, tag)) {
            matchedCase = cases[tag];
        } else if (hasOwnProperty(cases, defaultTag)) {
            matchedCase = cases[defaultTag];
        } else {
            throw new TypeError(msg`Unmatched case: ${tag}`);
        }
        
        if (typeof matchedCase === 'function') {
            return matchedCase(body);
        } else {
            return matchedCase;
        }
    };
    
    return Object.assign(matchFn, matchProps);
};


export default match;
