import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import SearchBar from "../../components/SearchBar";
import config from "../../utils/conf";

const difficulties = [
  { id: "Todos", label: "Todos" },
  { id: 1, label: "Bajo" },
  { id: 2, label: "Medio" },
  { id: 3, label: "Alto" }
];

const ExerciseLibrary = ({ navigation }) => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Todos"); // Nuevo estado para la categoría seleccionada
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/ejercicio`);
      const data = await response.json();
      console.log(data);
      setExercises(data);
      setFilteredExercises(data); // Inicializa filteredExercises con todos los ejercicios
    } catch (error) {
      console.error("Error al obtener ejercicios:", error);
    }
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    switch (category) {
      case "Todos":
        setFilteredExercises(exercises);
        break;
      case "Sin equipo":
        setFilteredExercises(exercises.filter((exercise) => !exercise.Equipo));
        break;
      case "Cardiovasculares":
        setFilteredExercises(
          exercises.filter((exercise) => exercise.ID_Modalidad === 3)
        );
        break;
      default:
        setFilteredExercises(exercises);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter((exercise) =>
        exercise.ejercicio.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredExercises(filtered);
    }
  };

  const filterByMuscle = (muscle) => {
    let filtered = exercises;

    if (selectedCategory === "Sin equipo") {
        filtered = filtered.filter((exercise) => !exercise.Equipo);
    }

    if (muscle !== "Todos") {
        filtered = filtered.filter((exercise) => {
            return exercise.Musculo && exercise.Musculo.includes(muscle);
        });
    }

    setFilteredExercises(filtered);
};

const filterByDifficulty = (difficultyID) => {
  console.log(difficultyID);
  setSelectedDifficulty(difficultyID);
  let filtered = [...exercises];

  if (difficultyID !== "Todos") {
    filtered = filtered.filter(exercise => exercise.ID_Dificultad === difficultyID);
  }

  // Reapply other filters if an
  if (selectedCategory !== "Todos") {
    filtered = filtered.filter(exercise =>
      selectedCategory === "Sin equipo" ? !exercise.Equipo : exercise.ID_Modalidad === 3
    );
  }

  if (selectedMuscle) {
    filtered = filtered.filter(exercise =>
      exercise.Musculo && exercise.Musculo.includes(selectedMuscle)
    );
  }

  setFilteredExercises(filtered);
};


  const navigateToDetailScreen = (exercise) => {
    navigation.navigate("DetallesEjercicio", { exercise });
  };

  const categories = ["Todos", "Sin equipo"];
  const muscles = [
    { id: 1, descripcion: "Pecho" },
    { id: 2, descripcion: "Espalda" },
    { id: 3, descripcion: "Hombro" },
    { id: 4, descripcion: "Bicep" },
    { id: 5, descripcion: "Tricep" },
    { id: 6, descripcion: "Cuadricep" },
    { id: 7, descripcion: "Femoral" },
    { id: 8, descripcion: "Gluteo" },
    { id: 9, descripcion: "Pantorrilla" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ejercicios</Text>
      </View>
      <SearchBar onSearch={handleSearch} />
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          style={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => handleCategoryFilter("Todos")}
            style={[
              styles.categoryButton,
              selectedCategory === "Todos" ? styles.selectedButton : null,
            ]}
          >
            <Text style={styles.categoryButtonText}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCategoryFilter("Sin equipo")}
            style={[
              styles.categoryButton,
              selectedCategory === "Sin equipo" ? styles.selectedButton : null,
            ]}
          >
            <Text style={styles.categoryButtonText}>Sin equipo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleCategoryFilter("Cardiovasculares")}
            style={[
              styles.categoryButton,
              selectedCategory === "Cardiovasculares"
                ? styles.selectedButton
                : null,
            ]}
          >
            <Text style={styles.categoryButtonText}>Cardiovasculares</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <View style={styles.muscleContainer}>
        <ScrollView
          horizontal
          style={styles.scrollContainer}
          showsHorizontalScrollIndicator={false}
        >
          {muscles.map((muscle, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (selectedMuscle === muscle.descripcion) {
                  setSelectedMuscle(null); // Deselecciona si es el mismo músculo
                  setFilteredExercises(exercises); // Muestra todos los ejercicios
                } else {
                  filterByMuscle(muscle.descripcion);
                  setSelectedMuscle(muscle.descripcion); // Actualiza el músculo seleccionado
                }
              }}
              style={[
                styles.muscleButton,
                selectedMuscle === muscle.descripcion
                  ? styles.selectedButton
                  : null,
              ]}
            >
              <Text style={styles.muscleButtonText}>{muscle.descripcion}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView horizontal style={styles.difficultyContainer} showsHorizontalScrollIndicator={false}>
      {difficulties.map((difficulty) => (
        <TouchableOpacity 
          key={difficulty.id} 
          onPress={() => filterByDifficulty(difficulty.id === "Todos" ? null : difficulty.id)}
          style={[styles.categoryButton, selectedDifficulty === difficulty.id ? styles.selectedButton : null]}
        >
          <Text style={styles.categoryButtonText}>{difficulty.label}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
      </View>
      <ScrollView style={styles.exerciseList}>
        {filteredExercises.map((exercise, index) => (
          <TouchableOpacity
            key={index}
            style={styles.exerciseItem}
            onPress={() => navigateToDetailScreen(exercise)}
          >
            <View style={styles.exerciseContent}>
              <Text style={styles.exerciseTitle}>{exercise.ejercicio}</Text>
              <Text style={styles.exerciseCategory}>
                {exercise.ID_Modalidad === 3
                  ? "Cardiovascular"
                  : exercise.Musculo}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  backButton: {
    fontSize: 24,
    color: "#000",
    paddingRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchBar: {
    margin: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  categoryContainer: {
    flexDirection: "row",
    marginTop: 10,
    height: 50,
  },
  difficultyContainer: {
    flexDirection: "row",
    marginTop: 10,
    height: 50,
  },
  selectedButton: {
    backgroundColor: "#a0a0a0", // Un color diferente para destacar la selección
  },
  categoryButton: {
    margin: 5,
    padding: 10,
    paddingHorizontal: 72,
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
  },
  categoryButtonText: {
    fontSize: 14,
  },
  contentContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    height: 50,
  },
  exerciseList: {
    flex: 1,
    marginTop: 20,
  },
  exerciseItem: {
    padding: 20,
    margin: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseCategory: {
    fontSize: 15,
    marginTop: 5,
    color: "#666",
  },
  scrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  muscleContainer: {
    height: 100,
    marginTop: 20,
  },
  muscleButton: {
    marginHorizontal: 5,
    paddingVertical: 0,
    paddingHorizontal: 16,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  muscleButtonText: {
    fontSize: 14,
  },
});

export default ExerciseLibrary;
