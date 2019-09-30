
declare module '@mkrause/match' {
    const defaultCase : unique symbol;
    
    type MatchProps = {
        default : typeof defaultCase,
    };
    
    
    type Tag = keyof any; // Tag is any possible object index (i.e. `string | number | symbol`)
    
    // Note: case map should ideally extend from an indexed type `{ [key : Tag] : unknown }`.
    // But until the following issue is fixed we currently cannot use `symbol` in an index type:
    // https://github.com/microsoft/TypeScript/issues/1863
    //type CaseMap = { [key : string | number | symbol] : unknown }
    //type CaseMap = { [key : string | number] : unknown, [defaultCase] ?: unknown }
    type CaseMap = object;
    
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
                ? ResolveCase<C[T], T>
                : ResolveCase<C[keyof C], T> // Return the union of all possible (resolved) return values
    );
    
    export const matchType : MatchProps & (
        <C extends CaseMap, T extends Tag, S extends { type : T }>(subject : S, cases : C) =>
            S['type'] extends keyof C
                ? ResolveCase<C[S['type']], S['type']>
                : ResolveCase<C[keyof C], S['type']>
    );
    
    
    export const matchSingleKey : any;
    // export const matchSingleKey : MatchProps & (
    //     <C extends CaseMap, K extends Tag, V, S extends { [K] : V }>(subject : S, cases : C) =>
    //         S[K] extends keyof C
    //             ? ResolveCase<C[S[K]], S[K]>
    //             : ResolveCase<C[keyof C], S[K]>
    // );
    
    
    export const matcher : <S, B>(parseSubject : (subject : S) => { tag : Tag, body : B }) =>
        MatchProps & (
            <C extends CaseMap>(subject : S, cases : C) =>
                ResolveCase<C[keyof C], B>
        );
    
    
    export default match;
}
