
// TODO: { matcher, match, matchType, getSingleKey, matchSingleKey }

// https://github.com/Microsoft/TypeScript/issues/10571

// import { defaultCase } from '../src/symbols.js';


declare module '@mkrause/match' {
    
    // export const defaultKey : typeof defaultCase;
    const defaultCase = '__@@default';
    
    type Discr = string | number | symbol; // Anything that can be used to index into an object
    
    /*
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
    */
    
    /*
    export function match<A, K extends Discr, R, Q>(
            discriminator : K,
            // cases : { [key : string] : R | ((body ?: A) => R) },
            // cases : { [key : string] : R },
            cases : R,
        ) : R extends { [key : K] : Q } ? R[K] : unknown;
    */
    
    /*
    export function match<D extends string, C extends { [key in D] : unknown }>(
            discriminator : D,
            cases : C,
        )
        : C[D];
    */
    
    /*
    export function match<D extends string, C extends object>(
            discriminator : D,
            cases : C,
        )
        : C extends { [key in D] : unknown }
            ? C[D]
            : never;
    */
    
    // Check if the matched case is a function, if so use the return type of that function
    type ResolveCase<C> = C extends ((...args : any[]) => infer R) ? R : C;
    
    export function match<D extends string, C extends object, DEF extends typeof defaultCase>(
            discriminator : D,
            cases : C,
        )
        : D extends keyof C // Check if the discriminator exists within the case list
            ? ResolveCase<C[D]>
            : (
                // Check if the case list has a "default" case, if so return its type
                DEF extends keyof C ? ResolveCase<C[DEF]> : never
            );
    
    export default match;
}
