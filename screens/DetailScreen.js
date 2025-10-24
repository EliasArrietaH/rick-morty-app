import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

export default function DetailScreen({ route }) {
  const { character } = route.params;

  // Función para obtener color según el estado
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "alive":
        return "#55cc44";
      case "dead":
        return "#d63d2e";
      default:
        return "#9e9e9e";
    }
  };

  // Función para traducir el estado
  const translateStatus = (status) => {
    switch (status.toLowerCase()) {
      case "alive":
        return "Vivo";
      case "dead":
        return "Muerto";
      default:
        return "Desconocido";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: character.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{character.name}</Text>

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(character.status) },
            ]}
          />
          <Text style={styles.statusText}>
            {translateStatus(character.status)} - {character.species}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Información</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Género:</Text>
            <Text style={styles.infoValue}>
              {character.gender === "Male"
                ? "Masculino"
                : character.gender === "Female"
                ? "Femenino"
                : character.gender}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Especie:</Text>
            <Text style={styles.infoValue}>{character.species}</Text>
          </View>

          {character.type && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tipo:</Text>
              <Text style={styles.infoValue}>{character.type}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Origen:</Text>
            <Text style={styles.infoValue}>{character.origin.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ubicación:</Text>
            <Text style={styles.infoValue}>{character.location.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Episodios:</Text>
            <Text style={styles.infoValue}>{character.episode.length}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e1e1e",
  },
  image: {
    width: width,
    height: width,
    backgroundColor: "#2a2a2a",
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: "#ccc",
  },
  infoSection: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00b5cc",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#3a3a3a",
  },
  infoLabel: {
    fontSize: 16,
    color: "#aaa",
    width: 120,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
  },
});
