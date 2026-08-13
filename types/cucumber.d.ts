import "@cucumber/cucumber";

interface Donor {
    email: string;
    firstName: string;
    lastName: string;
    password: string | null;
}

// augmenting the IWorld type declared in
// @cucumber/cucumber/lib/support_code_library_builder/world.d.ts
declare module "@cucumber/cucumber" {
    interface IWorld {
        donor?: Donor;
    }
}
