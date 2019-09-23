
declare module '@mkrause/match' {
    const defaultCase : unique symbol;
    
    type Discr = keyof any; // Discriminator is any possible object index (`string | number | symbol`)
    type CaseList = object; // Case list can be any arbitrary object
    
    // Resolve the given case to its result type. For example:
    // - In `{ foo: 42 }`, `foo` has result type `number`
    // - In `{ foo: () => 42 }`, `foo` also has result type `number` (will take the function return type)
    // Note: this type will also work if `C` is a union (see: "distributive conditionals" in TypeScript). Thus,
    // this will also work for multiple cases at once.
    type ResolveCase<C> = C extends ((discr : Discr) => infer R) ? R : C;
    
    // Type for the default matcher `match`.
    // Note that in the most general case (unknown discriminator), the best we can do is to return the union of
    // all (resolved) case types. However, if we know that the discriminator is a subtype of `keyof C`, then we
    // can specifically return those case types. In particular, if the discriminator is a literal type, then we
    // can return the exact type of the matched case.
    type MatchFn = <D extends Discr, C extends CaseList>(
            discriminator : D,
            cases : C,
        )
        => D extends keyof C // Check if the discriminator exists within the case list
            ? ResolveCase<C[D]>
            : ResolveCase<C[keyof C]>; // Return the union of all possible (resolved) return values
    
    export const match : MatchFn & {
        default : typeof defaultCase,
    };
    
    export default match;
}
