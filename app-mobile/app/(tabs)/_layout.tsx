import React from "react";
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Link, router, Slot, usePathname } from "expo-router";
import routes from "@/constants/routes";

interface MenuItemProps {
  icon: string;
  label: string;
  active: boolean;
}

export default function TabLayout() {
  const pathname = usePathname();
  
  return (
    <>
      <Slot />
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
            <MenuItem
              icon="home"
              label="Accueil"
              active={pathname === routes.home}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/scanner")}>
            <MenuItem
              icon="camera"
              label="Scanner"
              active={pathname === routes.scanner}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/galerie")}>
            <MenuItem
              icon="image"
              label="Galerie"
              active={pathname === routes.galerie}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace("/(tabs)/activity")}>
            <MenuItem
              icon="activity"
              label="Activities"
              active={pathname === routes.conseils}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
}

const MenuItem = ({ icon, label, active }: MenuItemProps) => {
  return (
    <View style={styles.menuItem}>
      <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
        <Feather
          name={icon}
          size={active ? 24 : 24}
          color={active ? "#ffffff" : "#9ca3af"}
        />
      </View>
      <Text
        style={[
          styles.label,
          active && styles.activeLabel,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  menuItem: {
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  activeIconContainer: {
    backgroundColor: "#16a34a", 
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#9ca3af",
  },
  activeLabel: {
    color: "#16a34a",
    fontWeight: "bold",
  },
});