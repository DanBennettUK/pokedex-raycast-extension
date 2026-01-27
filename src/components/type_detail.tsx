import { Color, Icon, List } from "@raycast/api";
import { typeColor } from "../utils";
import { TypeChartType } from "../types";

export function TypeDetail({
  type,
  allTypes,
}: {
  type: TypeChartType;
  allTypes: TypeChartType[];
}) {
  // Use the localized name if available
  const typeName = type.typenames[0]?.name || type.name;

  // OFFENSE: When this type attacks others
  const efficacyMap = new Map();
  type.typeefficacies.forEach((eff) => {
    efficacyMap.set(eff.target_type_id, eff.damage_factor);
  });

  const attacking = {
    superEffective: [] as { name: string; color: string; icon: string }[],
    notVeryEffective: [] as { name: string; color: string; icon: string }[],
    noEffect: [] as { name: string; color: string; icon: string }[],
  };

  allTypes.forEach((target) => {
    if (target.id >= 10000) return;
    const factor = efficacyMap.has(target.id)
      ? efficacyMap.get(target.id)
      : 100;
    const targetName = target.typenames[0]?.name || target.name;

    if (factor === 200) {
      attacking.superEffective.push({
        name: targetName,
        color: typeColor[target.name],
        icon: `types/${target.name}.svg`,
      });
    } else if (factor === 50) {
      attacking.notVeryEffective.push({
        name: targetName,
        color: typeColor[target.name],
        icon: `types/${target.name}.svg`,
      });
    } else if (factor === 0) {
      attacking.noEffect.push({
        name: targetName,
        color: typeColor[target.name],
        icon: `types/${target.name}.svg`,
      });
    }
  });

  // DEFENSE: When this type is hit by others
  const defending = {
    weakTo: [] as { name: string; color: string; icon: string }[],
    resistantTo: [] as { name: string; color: string; icon: string }[],
    immuneTo: [] as { name: string; color: string; icon: string }[],
  };

  allTypes.forEach((attacker) => {
    if (attacker.id >= 10000) return;
    const attackerName = attacker.typenames[0]?.name || attacker.name;

    const eff = attacker.typeefficacies.find(
      (e) => e.target_type_id === type.id,
    );
    const factor = eff ? eff.damage_factor : 100;

    if (factor === 200) {
      defending.weakTo.push({
        name: attackerName,
        color: typeColor[attacker.name],
        icon: `types/${attacker.name}.svg`,
      });
    } else if (factor === 50) {
      defending.resistantTo.push({
        name: attackerName,
        color: typeColor[attacker.name],
        icon: `types/${attacker.name}.svg`,
      });
    } else if (factor === 0) {
      defending.immuneTo.push({
        name: attackerName,
        color: typeColor[attacker.name],
        icon: `types/${attacker.name}.svg`,
      });
    }
  });

  return (
    <List navigationTitle={`${typeName} | Type Chart`}>
      <List.Section title="Attacking - When this type attacks">
        {attacking.superEffective.length > 0 && (
          <List.Item
            key="super-effective"
            title="Super Effective (2x)"
            icon={{ source: Icon.Star, tintColor: Color.Green }}
            subtitle={attacking.superEffective.map((t) => t.name).join(", ")}
            accessories={attacking.superEffective.slice(0, 4).map((t) => ({
              icon: t.icon,
            }))}
          />
        )}

        {attacking.notVeryEffective.length > 0 && (
          <List.Item
            key="not-very-effective"
            title="Not Very Effective (0.5x)"
            icon={{ source: Icon.XMarkCircle, tintColor: Color.Orange }}
            subtitle={attacking.notVeryEffective.map((t) => t.name).join(", ")}
            accessories={attacking.notVeryEffective.slice(0, 4).map((t) => ({
              icon: t.icon,
            }))}
          />
        )}

        {attacking.noEffect.length > 0 && (
          <List.Item
            key="no-effect"
            title="No Effect (0x)"
            icon={{ source: Icon.XMarkCircle, tintColor: Color.Red }}
            subtitle={attacking.noEffect.map((t) => t.name).join(", ")}
            accessories={attacking.noEffect.slice(0, 4).map((t) => ({
              icon: t.icon,
            }))}
          />
        )}
      </List.Section>

      <List.Section title="Defending - When this type is hit">
        {defending.weakTo.length > 0 && (
          <List.Item
            key="weak-to"
            title="Weak To (2x)"
            icon={{ source: Icon.Warning, tintColor: Color.Red }}
            subtitle={defending.weakTo.map((t) => t.name).join(", ")}
            accessories={defending.weakTo.slice(0, 4).map((t) => ({
              icon: t.icon,
            }))}
          />
        )}

        {defending.resistantTo.length > 0 && (
          <List.Item
            key="resistant-to"
            title="Resistant To (0.5x)"
            icon={{ source: Icon.Shield, tintColor: Color.Green }}
            subtitle={defending.resistantTo.map((t) => t.name).join(", ")}
            accessories={defending.resistantTo.slice(0, 4).map((t) => ({
              icon: t.icon,
            }))}
          />
        )}

        {defending.immuneTo.length > 0 && (
          <List.Item
            key="immune-to"
            title="Immune To (0x)"
            icon={{ source: Icon.Shield, tintColor: Color.Blue }}
            subtitle={defending.immuneTo.map((t) => t.name).join(", ")}
            accessories={defending.immuneTo.slice(0, 4).map((t) => ({
              icon: t.icon,
            }))}
          />
        )}
      </List.Section>
    </List>
  );
}
