
declare module '@mkrause/match' {
    const defaultCase : unique symbol;
    
    type Discrim = keyof any; // Discriminator is any possible object index (`string | number | symbol`)
    
    // Note: case map should ideally extend from an indexed type `{ [key : Discrim] : unknown }`.
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
    type ResolveCase<C, S> = C extends Function
        ? C extends ((subject : S) => infer R)
            ? R // Return the return type of the callback
            : unknown // Return `unknown` if wrong function type (best thing we can do to make the checker crash)
        : C;
    
    // Type for the default matcher `match`.
    // Note that in the most general case (unknown discriminator), the best we can do is to return the union of
    // all (resolved) case types. However, if we know that the discriminator is a subtype of `keyof C`, then we
    // can specifically return those case types. In particular, if the discriminator is a literal type, then we
    // can return the exact type of the matched case.
    type MatchFn = <C extends CaseMap, D extends Discrim>(
            discriminator : D,
            cases : C,
        )
        => D extends keyof C // Check if the discriminator is known to be a subtype of the possible cases
            ? ResolveCase<C[D], D>
            : ResolveCase<C[keyof C], D>; // Return the union of all possible (resolved) return values
    
    export const match : MatchFn & {
        default : typeof defaultCase,
    };
    
    export const matchType : <C extends CaseMap, T extends Discrim, S extends { type : T }>(
            subject : S,
            cases : C,
        )
        => S['type'] extends keyof C
            ? ResolveCase<C[S['type']], S['type']>
            : ResolveCase<C[keyof C], S['type']>;
    
    export const matchSingleKey : any;
    // export const matchSingleKey : <C extends CaseMap, K extends Discrim, V, S extends { [K] : V }>(
    //         subject : S,
    //         cases : C,
    //     )
    //     => S[K] extends keyof C
    //         ? ResolveCase<C[S[K]], S[K]>
    //         : ResolveCase<C[keyof C], S[K]>;
    
    export const matcher :
        <S, B>(parseSubject : (subject : S) => { discriminator : Discrim, body : B })
        => <C extends CaseMap>(subject : S, cases : C)
        => ResolveCase<C[keyof C], B>;
    
    export default match;
}
