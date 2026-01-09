import { Color, Icon, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { fetchNaturesWithCaching } from "./api";

export default function NatureCommand() {
    const { data: natures, isLoading } = usePromise(fetchNaturesWithCaching);

    return (
        <List
            isLoading={isLoading}
            searchBarPlaceholder="Search Nature..."
            throttle
        >
            {natures?.map((nature) => {
                const natureName = nature.naturenames[0]?.name || nature.name;
                const increasedStat = nature.increased_stat?.statnames[0]?.name || nature.increased_stat?.name;
                const decreasedStat = nature.decreased_stat?.statnames[0]?.name || nature.decreased_stat?.name;

                const isNeutral = !increasedStat && !decreasedStat;

                const accessories: List.Item.Accessory[] = [];

                if (!isNeutral) {
                    if (increasedStat) {
                        accessories.push({
                            tag: { value: `+10% ${increasedStat}`, color: Color.Green },
                            tooltip: "Stat increased by 10%",
                        });
                    }
                    if (decreasedStat) {
                        accessories.push({
                            tag: { value: `-10% ${decreasedStat}`, color: Color.Red },
                            tooltip: "Stat decreased by 10%",
                        });
                    }
                } else {
                    accessories.push({
                        tag: { value: "Neutral", color: Color.SecondaryText },
                        tooltip: "No stat changes",
                    });
                }

                return (
                    <List.Item
                        key={nature.id}
                        title={natureName}
                        icon={isNeutral ? Icon.Circle : Icon.List}
                        accessories={accessories}
                    />
                );
            })}
        </List>
    );
}
