
declare module '@mkrause/match' {
    const defaultCase : unique symbol;
    
    // Additional properties that should be present on all match functions
    type MatchProps = {
        default : typeof defaultCase,
    };
    
    
    export type Tag = keyof any; // Tag is any possible object index (i.e. `string | number | symbol`)
    
    // Note: case map should ideally extend from an indexed type `{ [key : Tag] : unknown }`.
    // But until the following issue is fixed we currently cannot use `symbol` in an index type:
    // https://github.com/microsoft/TypeScript/issues/1863
    //export type CaseMap = { [key : string | number | symbol] : unknown }
    //export type CaseMap = { [key : string | number] : unknown, [defaultCase] ?: unknown }
    //export type CaseMap = object;
    // The following seems to work, only objects can be assigned to this type, such that `keyof caseMap` = `keyof any`.
    // Note that in messages, TS will say that subtypes have type `{ [x: string]: unknown }`, which seems to be a bug.
    export type CaseMap = { [key in keyof any] : unknown };
    
    // Resolve the given case to its result type. For example:
    // - In `{ foo: 42 }`, `foo` has result type `number`
    // - In `{ foo: () => 42 }`, `foo` also has result type `number` (will take the function return type)
    // Note: this type will also work if `C` is a union (see: "distributive conditionals" in TypeScript). Thus,
    // this will also work for multiple cases at once.
    type ResolveCase<C, B> = C extends Function
        ? C extends ((body : B) => infer R)
            ? R // Return the return type of the callback
            : unknown // Return `unknown` if wrong function type (best thing we can do to indicate there's a problem)
        : C;
    
    
    // Note that in the most general case (unknown tag), the best we can do is to return the union of
    // all (resolved) case types. However, if we know that the tag is a subtype of `keyof C`, then we
    // can specifically return those case types. In particular, if the tag is a literal type, then we
    // can return the exact type of the matched case.
    export const match : MatchProps & (
        <C extends CaseMap, T extends Tag>(tag : T, cases : C) =>
            T extends keyof C // Check if the tag is known to be a subtype of the possible cases
                ? ResolveCase<C[T], T> // If so, return only the subset of possible cases, resolved to their type
                : ResolveCase<C[keyof C], T> // Otherwise, return all possible cases (resolved)
    );
    
    
    // Similar to `match`, except that the tag is now in a property `type`, and the body is the whole subject
    export const matchType : MatchProps & (
        <C extends CaseMap, T extends Tag, S extends { type : T }>(subject : S, cases : C) =>
            S['type'] extends keyof C
                ? ResolveCase<C[S['type']], S>
                : ResolveCase<C[keyof C], S>
    );
    
    
    // Note: the following seems to be the best we can do for this function in TypeScript at the moment.
    // Consider the type variable `S`:
    //   - `K extends Tag, S extends { [K] : V }` doesn't work, because index operations must be a constant literal
    //     > also, TypeScript doesn't support exact types, so it cannot enforce that there's only one property
    //   - `S extends { [key : Tag] : V }` doesn't work, because index operations must be a constant literal
    // (1) TS doesn't support exact types
    // (2) TS doesn't support `symbol` in indexer types, so anything involving indexers will also not work
    // export const matchSingleKey : MatchProps & (
    //     <C extends CaseMap, S extends object>(subject : S, cases : C) =>
    //         ResolveCase<C[keyof C], never>
    // );
    
    // Warning: some dark magic below
    type DistributeCond<U, C> = U extends C ? true : never; // Take a union and distribute it over the given cond
    type IsLiteralTag<T> = DistributeCond<Tag, T> extends never ? true : false;
    
    // https://stackoverflow.com/questions/50374908/transform-union-type-to-intersection-type/50375286
    type UnionToIntersection<U> = (U extends any ? (k : U) => void : never) extends (k : infer I) => void ? I : never;
    type IsSingleKey<K> = [K] extends [UnionToIntersection<K>] ? true : false;
    
    export const matchSingleKey : MatchProps & (
        <C extends CaseMap, S extends { [key in keyof any] : unknown }>(subject : S, cases : C) =>
            IsLiteralTag<keyof S> extends false // Check if `keyof S` consists of (a union of) literal types
                ? ResolveCase<C[keyof C], S[keyof S]> // If not a literal, return all possible cases
                : IsSingleKey<keyof S> extends false // Check if `keyof S` consists of a single key
                    ? never // If not, return `never`
                    : keyof S extends keyof C // If all is good, resolve as usual (same as other match functions)
                        ? ResolveCase<C[keyof S], S[keyof S]>
                        : ResolveCase<C[keyof C], S[keyof S]>
    );
    
    
    export const matcher : <S, B>(parseSubject : (subject : S) => { tag : Tag, body : B }) =>
        MatchProps & (
            <C extends CaseMap>(subject : S, cases : C) =>
                ResolveCase<C[keyof C], B>
        );
    
    
    export default match;
}
