
// TODO: { matcher, match, matchType, getSingleKey, matchSingleKey }

// https://github.com/Microsoft/TypeScript/issues/10571

declare module '@mkrause/match' {
    
    /*
    export const defaultKey : symbol;
    
    type Discr = string | number;
    
    type CaseList = {
        [key : string] : Function | unknown,
    };
    
    export function matchAgainstObject<A, R>(
            discriminator : Discr,
            body : A,
            cases : { [key : string] : R | ((body ?: A) => R) },
        ) : R
    
    export const matcher : <S, A, R>(
            parseSubject : (subject : S) => { discriminator : Discr, body : A }
        )
        => (
            subject : S,
            cases : { [key : string] : R | ((body ?: A) => R) },
        )
        => R;
    
    export function match<A, R>(
            discriminator : Discr,
            cases : { [key : string] : R | ((body ?: A) => R) },
        )
        => R;
    
    export default match;
    */
    
    const match : string;
    
    export default match;
}
