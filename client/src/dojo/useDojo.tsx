import { useContext } from "react";
import { DojoContext } from "./DojoContext";
import { BigNumberish } from "starknet";
import { useBurner } from "@dojoengine/create-burner";

export const useDojo = () => {
    const context = useContext(DojoContext);
    if (!context)
        throw new Error(
            "The `useDojo` hook must be used within a `DojoProvider`"
        );

    return {
        setup: context,
        account: context.account,
        burner: context.burnerManager,
        system: context.systemCalls
    };
};
