import { eniola } from "@/constants/icons_store";
import { player_header, player_stats } from "@/lib/constants";
import { getPlayers, truncateString } from "@/lib/utils";
import { useQuery, gql } from "@apollo/client";
import { Card, Typography } from "@material-tailwind/react";
import { useProvider } from "@starknet-react/core";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { constants } from "starknet";
import { StarknetIdNavigator, StarkProfile } from "starknetid.js";

export default function PlayersLobby({ data }: { data: any }) {

    const { provider } = useProvider();

    const starknetIdNavigator = new StarknetIdNavigator(
        provider,
        constants.StarknetChainId.SN_MAIN
    );

    // Extracting player_one and player_two from the data object
    const players = getPlayers(data);

    const addresses = players?.map((player: any) => player.address);

    const [profiles, setProfiles] = useState<StarkProfile[]>([]);

    useEffect(() => {
        if (!starknetIdNavigator || !addresses) return;
        (async () => {
            const data = await starknetIdNavigator?.getStarkProfiles(addresses)
            if (!data) return;
            setProfiles(data);
        })()
    }, [addresses]);

    return (
        <div className="w-[874px] h-[874px] bg-[url('./assets/lobby-box-long.png')] bg-contain bg-no-repeat p-8">
            <div className="w-full max-h-[500px] overflow-y-scroll hide-scrollbar pb-4">
                <Card className="w-full h-full bg-transparent">
                    <table className="text-left bg-transparent table-auto">
                        <thead className="sticky -top-3.5 bg-[#0F1116] z-10">
                            <tr>
                                {player_header.map((head, index) => (
                                    <th
                                        key={head.id}
                                        className={clsx("p-4", index === 0 ? "text-start" : "text-center")}
                                    >
                                        <Typography
                                            variant="small"
                                            className="font-medium leading-none text-[#BDC2CC]"
                                        >
                                            {head.name}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                            <div className="w-full border-b border-[#313640] h-1 absolute inset-x-0 top-10" />
                        </thead>
                        <tbody>
                            {players?.map(({ address, losses, wins, totalAppearances }: { address: string, losses: number, wins: number, totalAppearances: number }, index: number) => {
                                const isLast = index === players.length - 1;
                                return (
                                    <tr key={index} className={clsx(!isLast ? "border-b border-[#23272F]" : "", "bg-[#0F1116]")}>
                                        <td className="flex flex-row items-center p-4 space-x-5 max-w-fit">
                                            <Typography>
                                                <div className="flex flex-row items-center space-x-5 w-fit">
                                                    <img src={profiles ? profiles[index]?.profilePicture : ""} width={35} height={35} alt={`${profiles ? profiles[index]?.name : truncateString(address)} profile picture`} className="rounded-full" />
                                                    <p
                                                        className="font-normal text-white"
                                                    >
                                                        {profiles[index]?.name ? profiles[index]?.name : truncateString(address)}
                                                    </p>
                                                </div>
                                            </Typography>
                                        </td>
                                        <td>
                                            <Typography className="font-normal text-[#FAB580] text-center">{wins < 4 ? 1 : (Math.floor(wins / 4) + 1)}</Typography>
                                        </td>
                                        <td>
                                            <Typography className="font-normal text-[#FAB580] text-center">{wins * 50}</Typography>
                                        </td>
                                        <td>
                                            <Typography className="font-normal text-[#FAB580] text-center">{totalAppearances}</Typography>
                                        </td>
                                        <td>
                                            <Typography className="font-normal text-[#FAB580] text-center">{wins}</Typography>
                                        </td>
                                        <td>
                                            <Typography className="font-normal text-[#FAB580] text-center">{losses}</Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table >
                </Card >
            </div>
        </div>
    )
}