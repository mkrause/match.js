
declare module '@mkrause/match' {
    const defaultCase : unique symbol;
    
    type Discrim = keyof any; // Discriminator is any possible object index (`string | number | symbol`)
    type CaseList = object; // Case list can be any arbitrary object
    
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
    type MatchFn = <C extends CaseList, D extends Discrim>(
            discriminator : D,
            cases : C,
        )
        => D extends keyof C // Check if the discriminator is known to be a subtype of the possible cases
            ? ResolveCase<C[D], D>
            : ResolveCase<C[keyof C], D>; // Return the union of all possible (resolved) return values
    
    export const match : MatchFn & {
        default : typeof defaultCase,
    };
    
    export const matchType : <C extends CaseList, T extends Discrim, S extends { type : T }>(
            subject : S,
            cases : C,
        )
        => S['type'] extends keyof C
            ? ResolveCase<C[S['type']], S['type']>
            : ResolveCase<C[keyof C], S['type']>;
    
    export const matchSingleKey : any;
    // export const matchSingleKey : <C extends CaseList, K extends Discrim, V, S extends { [K] : V }>(
    //         subject : S,
    //         cases : C,
    //     )
    //     => S[K] extends keyof C
    //         ? ResolveCase<C[S[K]], S[K]>
    //         : ResolveCase<C[keyof C], S[K]>;
    
    export const matcher :
        <S, B>(parseSubject : (subject : S) => { discriminator : Discrim, body : B })
        => <C extends CaseList>(subject : S, cases : C)
        => ResolveCase<C[keyof C], B>;
    
    export default match;
}
